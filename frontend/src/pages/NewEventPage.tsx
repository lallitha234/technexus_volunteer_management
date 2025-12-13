import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsApi } from '../services/api.js';
import { ArrowLeft, AlertCircle, MapPin } from 'lucide-react';

interface FormData {
  title: string;
  description: string;
  location_address: string;
  location_lat: number | null;
  location_lng: number | null;
  tags: string[];
  start_at: string;
  end_at: string;
  estimated_volunteers: number;
}

const COMMON_TAGS = [
  'Community Service',
  'Education',
  'Environmental',
  'Healthcare',
  'Sports',
  'Arts & Culture',
  'Youth Development',
  'Disaster Relief',
];

export const NewEventPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    location_address: '',
    location_lat: null,
    location_lng: null,
    tags: [],
    start_at: '',
    end_at: '',
    estimated_volunteers: 5,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number'
          ? value === ''
            ? null
            : parseInt(value)
          : value,
    }));
  };

  const handleTagToggle = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Event title is required');
      return;
    }
    if (!formData.start_at) {
      setError('Start date/time is required');
      return;
    }
    if (!formData.end_at) {
      setError('End date/time is required');
      return;
    }
    if (new Date(formData.start_at) >= new Date(formData.end_at)) {
      setError('End time must be after start time');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description || null,
        location_address: formData.location_address || null,
        location_lat: formData.location_lat,
        location_lng: formData.location_lng,
        tags: formData.tags,
        start_at: formData.start_at,
        end_at: formData.end_at,
        estimated_volunteers: formData.estimated_volunteers,
        status: 'draft',
      };

      await eventsApi.create(payload);
      navigate('/events');
    } catch (err: any) {
      console.error('Failed to create event:', err);
      setError(
        err?.response?.data?.message ||
          'Failed to create event. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/events')}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">Create New Event</h1>
          <p className="text-slate-400 mt-1">Set up a new volunteer event</p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📅</span> Event Details
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Community Cleanup Day"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell volunteers about this event..."
              rows={4}
              className="input-field resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                name="start_at"
                value={formData.start_at}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                End Date & Time *
              </label>
              <input
                type="datetime-local"
                name="end_at"
                value={formData.end_at}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" /> Location Address
            </label>
            <input
              type="text"
              name="location_address"
              value={formData.location_address}
              onChange={handleInputChange}
              placeholder="e.g., Central Park, New York"
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Latitude
              </label>
              <input
                type="number"
                name="location_lat"
                value={formData.location_lat || ''}
                onChange={handleInputChange}
                placeholder="40.7829"
                step="0.0001"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Longitude
              </label>
              <input
                type="number"
                name="location_lng"
                value={formData.location_lng || ''}
                onChange={handleInputChange}
                placeholder="-73.9654"
                step="0.0001"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Estimated Volunteers
            </label>
            <input
              type="number"
              name="estimated_volunteers"
              value={formData.estimated_volunteers}
              onChange={handleInputChange}
              min="1"
              className="input-field"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="card p-6 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🏷️</span> Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {COMMON_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  formData.tags.includes(tag)
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create Event'}
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
