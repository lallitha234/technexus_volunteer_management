import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsApi } from '../services/api.js';
import type { Event } from '../types/index.js';
import { ArrowLeft, Plus, Trash2, Users } from 'lucide-react';
import { useRefresh } from '../context/RefreshContext.js';
import { formatTimeIST, datetimeLocalToUTCISO } from '../utils/timeUtils.js';

interface Shift {
  id: string;
  event_id: string;
  role_name: string;
  description?: string;
  required_skills: string[];
  start_at: Date;
  end_at: Date;
  seat_count: number;
  filled_count: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export const ShiftsManagementPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { refreshDashboard } = useRefresh();
  const [event, setEvent] = useState<Event | null>(null);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewShiftForm, setShowNewShiftForm] = useState(false);
  const [formData, setFormData] = useState({
    role_name: '',
    description: '',
    required_skills: '',
    start_at: '',
    end_at: '',
    seat_count: 1,
  });

  useEffect(() => {
    if (id) {
      fetchEventAndShifts();
    }
  }, [id]);

  const fetchEventAndShifts = async () => {
    try {
      const eventData = await eventsApi.get(id!);
      setEvent(eventData);
      
      const shiftsData = await eventsApi.getShifts(id!);
      setShifts(Array.isArray(shiftsData) ? shiftsData : []);
    } catch (error) {
      console.error('Failed to fetch event or shifts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value,
    }));
  };

  const handleAddShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      const skills = formData.required_skills
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill);

      await eventsApi.createShift({
        event_id: id,
        role_name: formData.role_name,
        description: formData.description,
        required_skills: skills,
        start_at: datetimeLocalToUTCISO(formData.start_at),
        end_at: datetimeLocalToUTCISO(formData.end_at),
        seat_count: formData.seat_count,
      });

      setFormData({
        role_name: '',
        description: '',
        required_skills: '',
        start_at: '',
        end_at: '',
        seat_count: 1,
      });
      setShowNewShiftForm(false);
      fetchEventAndShifts();
      window.dispatchEvent(new Event('dashboardRefresh'));
    } catch (error) {
      console.error('Failed to create shift:', error);
      alert('Failed to create shift');
    }
  };

  const handleDeleteShift = async (shiftId: string) => {
    if (!confirm('Delete this shift?')) return;

    try {
      // You may need to add a deleteShift API method
      console.log('Delete shift:', shiftId);
      // await shiftsApi.delete(shiftId);
      // fetchEventAndShifts();
    } catch (error) {
      console.error('Failed to delete shift:', error);
    }
  };

  const formatTime = (dateString: string | Date) => {
    return formatTimeIST(dateString);
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
          <p className="text-slate-400 mt-4">Loading shifts...</p>
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
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/events')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Manage Shifts</h1>
            <p className="text-slate-400 mt-1">{event.title}</p>
          </div>
        </div>
        <button
          onClick={() => setShowNewShiftForm(!showNewShiftForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Shift
        </button>
      </div>

      {/* New Shift Form */}
      {showNewShiftForm && (
        <div className="card p-6 space-y-4">
          <h2 className="text-xl font-bold text-white">Create New Shift</h2>
          <form onSubmit={handleAddShift} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Role Name *
              </label>
              <input
                type="text"
                name="role_name"
                value={formData.role_name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                placeholder="e.g., Setup Crew"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                placeholder="What will volunteers do in this shift?"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Start Time *
                </label>
                <input
                  type="datetime-local"
                  name="start_at"
                  value={formData.start_at}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  End Time *
                </label>
                <input
                  type="datetime-local"
                  name="end_at"
                  value={formData.end_at}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Available Seats *
                </label>
                <input
                  type="number"
                  name="seat_count"
                  value={formData.seat_count}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Required Skills (comma-separated)
                </label>
                <input
                  type="text"
                  name="required_skills"
                  value={formData.required_skills}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  placeholder="e.g., leadership, communication"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="submit" className="btn-primary">
                Create Shift
              </button>
              <button
                type="button"
                onClick={() => setShowNewShiftForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Shifts List */}
      <div className="space-y-4">
        {shifts.length > 0 ? (
          shifts.map((shift) => (
            <div key={shift.id} className="card p-6 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{shift.role_name}</h3>
                  {shift.description && (
                    <p className="text-sm text-slate-400 mt-1">{shift.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteShift(shift.id)}
                  className="p-2 hover:bg-red-500/20 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                <div>
                  <p className="text-slate-500 text-xs">Time</p>
                  <p className="font-medium">{formatTime(shift.start_at)} - {formatTime(shift.end_at)}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Availability</p>
                  <p className="font-medium flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {shift.filled_count}/{shift.seat_count} volunteers
                  </p>
                </div>
                {shift.required_skills && shift.required_skills.length > 0 && (
                  <div>
                    <p className="text-slate-500 text-xs">Required Skills</p>
                    <p className="font-medium">{shift.required_skills.join(', ')}</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate(`/events/${id}/shifts/${shift.id}`)}
                className="text-sm text-purple-400 hover:text-purple-300 mt-2"
              >
                Manage Assignments →
              </button>
            </div>
          ))
        ) : (
          <div className="card p-12 text-center">
            <p className="text-4xl mb-4">🕐</p>
            <h3 className="text-xl font-bold text-white mb-2">No shifts yet</h3>
            <p className="text-slate-400">Create shifts to assign volunteers to this event</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="card p-4 bg-slate-700/50">
        <p className="text-sm text-slate-300">
          <span className="font-medium">{shifts.length}</span> shift{shifts.length !== 1 ? 's' : ''} created
        </p>
      </div>
    </div>
  );
};
