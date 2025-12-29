import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { toursService } from '../../services/toursService';
import { categoriesService } from '../../services/categoriesService';
import Loading from '../../components/common/Loading';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import TourFormModal from '../../components/admin/TourFormModal';

export default function AdminTours() {
  const [tours, setTours] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [toursRes, categoriesRes] = await Promise.all([
        toursService.getTours({ limit: 100 }),
        categoriesService.getCategories(),
      ]);
      setTours(toursRes.data.tours || toursRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load tours');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tour?')) return;

    try {
      await toursService.deleteTour(id);
      toast.success('Tour deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete tour');
    }
  };

  const handleOpenModal = (tour = null) => {
    setEditingTour(tour);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingTour(null);
    setIsModalOpen(false);
  };

  const handleSaveTour = async (tourData, tourId) => {
    try {
      if (tourId) {
        await toursService.updateTour(tourId, tourData);
        toast.success('Tour updated successfully');
      } else {
        await toursService.createTour(tourData);
        toast.success('Tour created successfully');
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving tour:', error);
      toast.error(error.response?.data?.message || 'Failed to save tour');
    }
  };

  const filteredTours = tours.filter((tour) =>
    tour.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Tours</h1>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Tour
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search tours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Tours Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTours.map((tour) => (
                <tr key={tour.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={tour.images_json?.[0]?.url || 'https://via.placeholder.com/60'}
                        alt={tour.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{tour.title}</p>
                        <p className="text-sm text-gray-500">{tour.location_city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {categories.find(c => c.id === tour.category_id)?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">${tour.base_price}</p>
                    {tour.sale_price && (
                      <p className="text-xs text-green-600">Sale: ${tour.sale_price}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${tour.status === 'published' ? 'bg-green-100 text-green-700' :
                      tour.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                      {tour.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleOpenModal(tour)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(tour.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TourFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTour}
        tour={editingTour}
        categories={categories}
      />
    </div>
  );
}
