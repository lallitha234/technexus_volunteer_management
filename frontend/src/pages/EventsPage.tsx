import React, { useEffect, useState } from 'react';
import { eventsApi } from '../services/api.js';
import type { Event } from '../types/index.js';
import { Calendar, MapPin, Users, Plus, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRefresh } from '../context/RefreshContext.js';
import { formatDateIST } from '../utils/timeUtils.js';

export const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshDashboard } = useRefresh();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('published');

  useEffect(() => {
    fetchEvents();
  }, [status]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const data = await eventsApi.list({ status: status || undefined });
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerDashboardRefresh = () => {
    window.dispatchEvent(new Event('dashboardRefresh'));
  };

  const handlePublish = async (id: string) => {
    try {
      await eventsApi.publish(id);
      fetchEvents();
      triggerDashboardRefresh();
    } catch (error) {
      console.error('Failed to publish event:', error);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this event?')) return;
    try {
      await eventsApi.cancel(id);
      fetchEvents();
      triggerDashboardRefresh();
    } catch (error) {
      console.error('Failed to cancel event:', error);
    }
  };

  const handleRevertToDraft = async (id: string) => {
    if (!confirm('Revert event to draft status? This will unpublish the event.')) return;
    try {
      await eventsApi.revertToDraft(id);
      fetchEvents();
      triggerDashboardRefresh();
    } catch (error) {
      console.error('Failed to revert event to draft:', error);
    }
  };

  const handleCompleteEvent = async (id: string) => {
    if (!confirm('Mark this event as completed?')) return;
    try {
      await eventsApi.complete(id);
      fetchEvents();
      triggerDashboardRefresh();
    } catch (error) {
      console.error('Failed to complete event:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await eventsApi.delete(id);
      fetchEvents();
      triggerDashboardRefresh();
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return formatDateIST(dateString);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-white">📅 Events</h1>
          <p className="text-slate-400 mt-1">Create and manage volunteer events</p>
        </div>
        <button onClick={() => navigate('/events/new')} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Event
        </button>
      </div>

      {/* Status filter */}
      <div className="card p-4 flex gap-2 flex-wrap">
        {[
          { label: '📝 Draft', value: 'draft' },
          { label: '🟢 Published', value: 'published' },
          { label: '⛔ Cancelled', value: 'cancelled' },
          { label: '✅ Completed', value: 'completed' },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setStatus(option.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              status === option.value
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Events list */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card h-32 animate-pulse"></div>
          ))}
        </div>
      ) : events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="card p-6 hover:shadow-lg transition-shadow border-l-4 border-pink-500">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>
                  {event.description && (
                    <p className="text-sm text-slate-400 mb-3 line-clamp-2">{event.description}</p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-slate-300 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(event.start_at)}
                    </div>
                    {event.location_address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {event.location_address}
                      </div>
                    )}
                    {event.estimated_volunteers && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {event.estimated_volunteers} volunteers
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {event.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-blue-500/20 text-blue-200 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 w-full flex-wrap">
                  {event.status === 'draft' && (
                    <>
                      <button
                        onClick={() => handlePublish(event.id)}
                        className="btn-primary text-xs sm:text-sm"
                      >
                        Publish
                      </button>
                      <button
                        onClick={() => navigate(`/events/${event.id}/edit`)}
                        className="btn-secondary text-xs sm:text-sm flex items-center gap-1"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    </>
                  )}
                  {event.status === 'published' && (
                    <>
                      <button
                        onClick={() => handleCancel(event.id)}
                        className="px-3 py-2 bg-red-500/20 text-red-200 hover:bg-red-500/30 rounded text-xs sm:text-sm"
                      >
                        Cancel Event
                      </button>
                      <button
                        onClick={() => navigate(`/events/${event.id}/shifts`)}
                        className="btn-secondary text-xs sm:text-sm"
                      >
                        Manage Shifts
                      </button>
                      <button
                        onClick={() => handleCompleteEvent(event.id)}
                        className="px-3 py-2 bg-green-500/20 text-green-200 hover:bg-green-500/30 rounded text-xs sm:text-sm"
                      >
                        Mark Complete
                      </button>
                      <button
                        onClick={() => handleRevertToDraft(event.id)}
                        className="px-3 py-2 bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30 rounded text-xs sm:text-sm"
                      >
                        Revert to Draft
                      </button>
                    </>
                  )}
                  {event.status === 'cancelled' && (
                    <>
                      <button
                        onClick={() => handleRevertToDraft(event.id)}
                        className="px-3 py-2 bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30 rounded text-xs sm:text-sm"
                      >
                        Revert to Draft
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="px-3 py-2 bg-red-500/20 text-red-200 hover:bg-red-500/30 rounded text-xs sm:text-sm flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </>
                  )}
                  {event.status === 'completed' && (
                    <>
                      <button
                        onClick={() => handleRevertToDraft(event.id)}
                        className="px-3 py-2 bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30 rounded text-xs sm:text-sm"
                      >
                        Revert to Draft
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="px-3 py-2 bg-red-500/20 text-red-200 hover:bg-red-500/30 rounded text-xs sm:text-sm flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </>
                  )}
                  {event.status !== 'published' && event.status !== 'draft' && event.status !== 'cancelled' && event.status !== 'completed' && (
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="px-3 py-2 bg-red-500/20 text-red-200 hover:bg-red-500/30 rounded text-xs sm:text-sm flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="btn-secondary text-xs sm:text-sm ml-auto"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-4">📅</p>
          <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
          <p className="text-slate-400 mb-6">
            {status === 'draft'
              ? ''
              : 'No events with this status'}
          </p>
        </div>
      )}
    </div>
  );
};
