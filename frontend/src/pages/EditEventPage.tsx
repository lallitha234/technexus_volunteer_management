import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsApi } from '../services/api.js';
import type { Event } from '../types/index.js';
import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react';
import { useRefresh } from '../context/RefreshContext.js';
import { utcISOToDatetimeLocal, datetimeLocalToUTCISO } from '../utils/timeUtils.js';

export const EditEventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { refreshDashboard } = useRefresh();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location_address: '',
    start_at: '',
    end_at: '',
    tags: '',
    estimated_volunteers: '',
  });

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const data = await eventsApi.get(id!);
      setEvent(data);
      
      setFormData({
        title: data.title || '',
        description: data.description || '',
        location_address: data.location_address || '',
        start_at: utcISOToDatetimeLocal(data.start_at),
        end_at: utcISOToDatetimeLocal(data.end_at),
        tags: data.tags?.join(', ') || '',
        estimated_volunteers: data.estimated_volunteers?.toString() || '',
      });
    } catch (error) {
      console.error('Failed to fetch event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsSaving(true);
    try {
      const tags = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const updatePayload = {
        title: formData.title,
        description: formData.description,
        location_address: formData.location_address,
        start_at: datetimeLocalToUTCISO(formData.start_at),
        end_at: datetimeLocalToUTCISO(formData.end_at),
        tags,
        estimated_volunteers: formData.estimated_volunteers ? parseInt(formData.estimated_volunteers) : undefined,
      };

      console.log('[EditEventPage] Submitting update with payload:', updatePayload);
      console.log('[EditEventPage] Event ID:', id);

      const result = await eventsApi.update(id, updatePayload);
      
      console.log('[EditEventPage] Update response:', result);

      window.dispatchEvent(new Event('dashboardRefresh'));
      navigate('/events');
    } catch (error) {
      console.error('Failed to update event:', error);
      alert(`Failed to update event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/events')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>
        <div className="card p-12 text-center">
          <div className="animate-spin inline-block w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"></div>
          <p className="text-slate-400 mt-4">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/events')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>
        <div className="card p-12 text-center">
          <p className="text-red-400">Event not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/events')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white">Edit Event</h1>
        <p className="text-slate-400 mt-1">Update event details</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Event Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            placeholder="e.g., Community Cleanup"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            placeholder="Event description..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Location
          </label>
          <input
            type="text"
            name="location_address"
            value={formData.location_address}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            placeholder="Event location"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Start Date & Time *
            </label>
            <input
              type="datetime-local"
              name="start_at"
              value={formData.start_at}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              End Date & Time *
            </label>
            <input
              type="datetime-local"
              name="end_at"
              value={formData.end_at}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Estimated Volunteers
            </label>
            <input
              type="number"
              name="estimated_volunteers"
              value={formData.estimated_volunteers}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              placeholder="e.g., 50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              placeholder="e.g., community, outdoor, cleanup"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/events')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
