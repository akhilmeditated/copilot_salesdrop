import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const emptyDrop = {
  title: '',
  description: '',
  is_active: false,
  week_date: '',
};

const DropsManager = () => {
  const [drops, setDrops] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDrop, setEditingDrop] = useState(null);
  const [formData, setFormData] = useState(emptyDrop);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    loadDrops();
  }, []);

  const loadDrops = async () => {
    const { data } = await supabase.from('drops').select('*').order('created_at', { ascending: false });
    setDrops(data || []);
  };

  const openModal = (drop = null) => {
    setEditingDrop(drop);
    setFormData(drop ? { ...drop } : emptyDrop);
    setIsModalOpen(true);
    setFormErrors({});
    setSubmitError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDrop(null);
    setFormErrors({});
    setSubmitError('');
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      if (editingDrop) {
        const { error } = await supabase.from('drops').update(formData).eq('id', editingDrop.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('drops').insert([formData]);
        if (error) throw error;
      }
      await loadDrops();
      closeModal();
    } catch (error) {
      setSubmitError(error.message || 'Failed to save drop.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this drop?')) return;
    const { error } = await supabase.from('drops').delete().eq('id', id);
    if (!error) loadDrops();
  };

  return (
    <div>
      <button onClick={() => openModal()} style={{ margin: '1em 0' }}>Add New Drop</button>
      <ul>
        {drops.map(drop => (
          <li key={drop.id} style={{ marginBottom: 12 }}>
            <b>{drop.title}</b> {' '}
            <button onClick={() => openModal(drop)}>Edit</button>{' '}
            <button onClick={() => handleDelete(drop.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {isModalOpen && (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <label>Title: <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              {formErrors.title && <span style={{ color: 'red' }}>{formErrors.title}</span>}
            </label>
            <label>Description: <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} /></label>
            <label>Active: <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} /></label>
            <label>Week Date: <input type="date" value={formData.week_date || ''} onChange={e => setFormData({ ...formData, week_date: e.target.value })} /></label>
            <div>
              <button type="submit">{editingDrop ? 'Update Drop' : 'Create Drop'}</button>
              <button type="button" onClick={closeModal} style={{ marginLeft: 8 }}>Cancel</button>
              {submitError && <div style={{ color: 'red', marginTop: 10 }}>{submitError}</div>}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DropsManager;
