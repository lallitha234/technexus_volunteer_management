import React, { useEffect, useState } from 'react';
import { eventsApi } from '../services/api.js';
import { Event } from '../types/index.js';
import { Calendar, MapPin, Users, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EventsPage: React.FC = () => {
  const navigate = useNavigate();
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

  const handlePublish = async (id: string) => {
    try {
      await eventsApi.publish(id);
      fetchEvents();
    } catch (error) {
      console.error('Failed to publish event:', error);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this event?')) return;
    try {
      await eventsApi.cancel(id);
      fetchEvents();
    } catch (error) {
      console.error('Failed to cancel event:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
      <div className="card p-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="input-field"
        >
          <option value="draft">📝 Draft</option>
          <option value="published">🟢 Published</option>
          <option value="cancelled">⛔ Cancelled</option>
          <option value="completed">✅ Completed</option>
        </select>
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
            <div key={event.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>
                  {event.description && (
                    <p className="text-sm text-slate-400 mb-3 line-clamp-2">{event.description}</p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-slate-300">
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
                </div>

                {/* Actions */}
                <div className="flex gap-2 w-full sm:w-auto">
                  {event.status === 'draft' && (
                    <button
                      onClick={() => handlePublish(event.id)}
                      className="flex-1 sm:flex-none btn-primary text-xs sm:text-sm"
                    >
                      Publish
                    </button>
                  )}
                  {event.status === 'published' && (
                    <button
                      onClick={() => handleCancel(event.id)}
                      className="flex-1 sm:flex-none px-3 py-2 bg-red-500/20 text-red-200 hover:bg-red-500/30 rounded text-xs sm:text-sm"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="flex-1 sm:flex-none btn-secondary text-xs sm:text-sm"
                  >
                    View
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
          <p className="text-slate-400">Create your first event to get started</p>
        </div>
      )}
    </div>
  );
};
