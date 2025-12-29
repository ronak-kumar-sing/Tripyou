import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboardService';
import Loading from '../../components/common/Loading';
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Map,
  FileText,
  MessageSquare
} from 'lucide-react';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardService.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loading fullScreen />;

  const statCards = [
    {
      title: 'Total Tours',
      value: stats?.totalTours || 0,
      icon: Map,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      icon: Calendar,
      color: 'bg-green-500',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Revenue',
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Blog Posts',
      value: stats?.totalBlogPosts || 0,
      icon: FileText,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Pending Bookings',
      value: stats?.pendingBookings || 0,
      icon: Calendar,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Contact Messages',
      value: stats?.totalContacts || 0,
      icon: MessageSquare,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-100',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`${stat.color.replace('bg-', 'text-')} w-6 h-6`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
          {stats?.recentBookings && stats.recentBookings.length > 0 ? (
            <div className="space-y-4">
              {stats.recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium text-gray-900">{booking.customer_name}</p>
                    <p className="text-sm text-gray-600">{booking.Tour?.title || 'Tour'}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                    }`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent bookings</p>
          )}
        </div>

        {/* Recent Contacts */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Messages</h2>
          {stats?.recentContacts && stats.recentContacts.length > 0 ? (
            <div className="space-y-4">
              {stats.recentContacts.map((contact) => (
                <div key={contact.id} className="border-b pb-3">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium text-gray-900">{contact.name}</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${contact.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                      {contact.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{contact.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent messages</p>
          )}
        </div>
      </div>
    </div>
  );
}
