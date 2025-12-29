import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { categoriesService } from '../../services/categoriesService';
import Loading from '../../components/common/Loading';
import { Plus, Edit, Trash2 } from 'lucide-react';
import CategoryFormModal from '../../components/admin/CategoryFormModal';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesService.getCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await categoriesService.deleteCategory(id);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const handleOpenModal = (category = null) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingCategory(null);
    setIsModalOpen(false);
  };

  const handleSaveCategory = async (categoryData, categoryId) => {
    try {
      if (categoryId) {
        await categoriesService.updateCategory(categoryId, categoryData);
        toast.success('Category updated successfully');
      } else {
        await categoriesService.createCategory(categoryData);
        toast.success('Category created successfully');
      }
      fetchCategories();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error.response?.data?.message || 'Failed to save category');
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-40 overflow-hidden">
              <img
                src={category.image_url || 'https://via.placeholder.com/400x200'}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{category.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {category.tours_count || 0} tours
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(category)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCategory}
        category={editingCategory}
      />
    </div>
  );
}
