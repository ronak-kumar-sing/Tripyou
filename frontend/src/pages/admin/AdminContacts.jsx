import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { contactService } from '../../services/contactService';
import Loading from '../../components/common/Loading';
import { Mail, Phone, Calendar, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await contactService.getAllContacts();
      setContacts(response.data);
    } catch (error) {
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await contactService.updateContactStatus(id, status);
      toast.success('Status updated');
      fetchContacts();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await contactService.deleteContact(id);
      toast.success('Message deleted');
      fetchContacts();
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    filter === 'all' ? true : contact.status === filter
  );

  if (loading) return <Loading />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Contact Messages</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {['all', 'new', 'responded', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${filter === status
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              {status} ({contacts.filter(c => status === 'all' || c.status === status).length})
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredContacts.map((contact) => (
          <div key={contact.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${contact.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      contact.status === 'responded' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                    }`}>
                    {contact.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <Mail size={14} />
                    <a href={`mailto:${contact.email}`} className="hover:text-primary-500">
                      {contact.email}
                    </a>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} />
                      <a href={`tel:${contact.phone}`} className="hover:text-primary-500">
                        {contact.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{formatDate(contact.created_at)}</span>
                  </div>
                </div>
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-700">Subject: </span>
                  <span className="text-sm text-gray-600 capitalize">{contact.subject}</span>
                </div>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{contact.message}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <select
                value={contact.status}
                onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="new">New</option>
                <option value="responded">Responded</option>
                <option value="archived">Archived</option>
              </select>

              <button
                onClick={() => handleDelete(contact.id)}
                className="text-red-600 hover:text-red-800 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}

        {filteredContacts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No messages found</p>
          </div>
        )}
      </div>
    </div>
  );
}
