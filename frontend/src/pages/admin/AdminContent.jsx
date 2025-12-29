import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { contentService } from '../../services/contentService';
import Loading from '../../components/common/Loading';
import { Save } from 'lucide-react';

export default function AdminContent() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await contentService.getAllContent();
      setContent(response.data);
    } catch (error) {
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, data) => {
    setSaving(true);
    try {
      await contentService.updateContent(id, data);
      toast.success('Content updated successfully');
      fetchContent();
    } catch (error) {
      toast.error('Failed to update content');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (id, field, value) => {
    setContent((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  if (loading) return <Loading />;

  const groupedContent = content.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Content Settings</h1>

      <div className="space-y-6">
        {Object.entries(groupedContent).map(([section, items]) => (
          <div key={section} className="bg-white rounded-lg shadow">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900 capitalize">
                {section.replace(/-/g, ' ')} Section
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {items.map((item) => (
                <div key={item.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {item.key.replace(/_/g, ' ')}
                    </label>
                    <span className="text-xs text-gray-500">{item.content_type}</span>
                  </div>

                  {item.content_type === 'text' && (
                    <input
                      type="text"
                      value={item.content || ''}
                      onChange={(e) => handleChange(item.id, 'content', e.target.value)}
                      className="input"
                    />
                  )}

                  {item.content_type === 'textarea' && (
                    <textarea
                      value={item.content || ''}
                      onChange={(e) => handleChange(item.id, 'content', e.target.value)}
                      rows="4"
                      className="input"
                    />
                  )}

                  {item.content_type === 'image' && (
                    <div>
                      <input
                        type="text"
                        value={item.content || ''}
                        onChange={(e) => handleChange(item.id, 'content', e.target.value)}
                        placeholder="Image URL"
                        className="input mb-2"
                      />
                      {item.content && (
                        <img
                          src={item.content}
                          alt={item.key}
                          className="w-32 h-32 object-cover rounded"
                        />
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => handleUpdate(item.id, { content: item.content })}
                    disabled={saving}
                    className="mt-3 btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save size={16} />
                    Save
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
