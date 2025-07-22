import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const emptyTool = (dropId) => ({
  drop_id: dropId || '',
  name: '',
  description: '',
  category: '',
  logo_text: '',
  image_url: null,
  maker_name: '',
  maker_company: '',
  website_url: '',
  is_premium: false,
  order_index: 0,
  notes: '',
});

const ToolsManager = () => {
  const [tools, setTools] = useState([]);
  const [drops, setDrops] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState(null);
  const [formData, setFormData] = useState(emptyTool(''));
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [toolsRes, dropsRes] = await Promise.all([
      supabase.from('tools').select('*').order('created_at', { ascending: false }),
      supabase.from('drops').select('*').order('created_at', { ascending: false }),
    ]);
    setTools(toolsRes.data || []);
    setDrops(dropsRes.data || []);
  };

  const openModal = (tool = null) => {
    if (tool) {
      setEditingTool(tool);
      setFormData({ ...tool });
    } else {
      setEditingTool(null);
      setFormData(emptyTool(drops[0]?.id || ''));
    }
    setIsModalOpen(true);
    setFormErrors({});
    setSubmitError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTool(null);
    setFormErrors({});
    setSubmitError('');
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Required';
    if (!formData.description.trim()) errors.description = 'Required';
    if (!formData.category.trim()) errors.category = 'Required';
    if (!formData.drop_id) errors.drop_id = 'Required';
    if (formData.website_url && !/^https?:\/\//.test(formData.website_url)) errors.website_url = 'Must start with http:// or https://';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const dataToSend = {
        ...formData,
        logo_text: formData.logo_text || formData.name.slice(0, 2).toUpperCase(),
      };
      if (editingTool) {
        const { error } = await supabase.from('tools').update(dataToSend).eq('id', editingTool.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('tools').insert([dataToSend]);
        if (error) throw error;
      }
      await loadData();
      closeModal();
    } catch (error) {
      setSubmitError(error.message || 'Failed to save tool.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tool?')) return;
    const { error } = await supabase.from('tools').delete().eq('id', id);
    if (!error) loadData();
  };

  return (
    <div>
      <button onClick={() => openModal()} style={{ margin: '1em 0' }}>Add New Tool</button>
      <ul>
        {tools.map(tool => (
          <li key={tool.id} style={{ marginBottom: 12 }}>
            <b>{tool.name}</b> ({tool.category}){' '}
            <button onClick={() => openModal(tool)}>Edit</button>{' '}
            <button onClick={() => handleDelete(tool.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {isModalOpen && (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <label>Drop:
              <select value={formData.drop_id} onChange={e => setFormData({ ...formData, drop_id: e.target.value })}>
                <option value="">Select</option>
                {drops.map(drop => <option key={drop.id} value={drop.id}>{drop.title || drop.id}</option>)}
              </select>
              {formErrors.drop_id && <span style={{ color: 'red' }}>{formErrors.drop_id}</span>}
            </label>
            <label>Name: <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              {formErrors.name && <span style={{ color: 'red' }}>{formErrors.name}</span>}
            </label>
            <label>Description: <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              {formErrors.description && <span style={{ color: 'red' }}>{formErrors.description}</span>}
            </label>
            <label>Category: <input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
              {formErrors.category && <span style={{ color: 'red' }}>{formErrors.category}</span>}
            </label>
            <label>Logo Text: <input value={formData.logo_text} onChange={e => setFormData({ ...formData, logo_text: e.target.value })} maxLength={2} /></label>
            <label>Maker Name: <input value={formData.maker_name} onChange={e => setFormData({ ...formData, maker_name: e.target.value })} /></label>
            <label>Maker Company: <input value={formData.maker_company} onChange={e => setFormData({ ...formData, maker_company: e.target.value })} /></label>
            <label>Website URL: <input value={formData.website_url} onChange={e => setFormData({ ...formData, website_url: e.target.value })} />
              {formErrors.website_url && <span style={{ color: 'red' }}>{formErrors.website_url}</span>}
            </label>
            <label>Admin Notes: <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} /></label>
            <label>
              Premium Tool: <input type="checkbox" checked={formData.is_premium} onChange={e => setFormData({ ...formData, is_premium: e.target.checked })} />
            </label>
            <div>
              <button type="submit">{editingTool ? 'Update Tool' : 'Create Tool'}</button>
              <button type="button" onClick={closeModal} style={{ marginLeft: 8 }}>Cancel</button>
              {submitError && <div style={{ color: 'red', marginTop: 10 }}>{submitError}</div>}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ToolsManager;
