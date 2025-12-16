import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsApi } from '../services/api.js';
import { Event } from '../types/index.js';
import { ArrowLeft, Calendar, MapPin, Users, Edit2 } from 'lucide-react';
import { formatDateIST } from '../utils/timeUtils.js';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shifts, setShifts] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchEvent();
      fetchShifts();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const data = await eventsApi.get(id!);
      setEvent(data);
    } catch (error) {
      console.error('Failed to fetch event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchShifts = async () => {
    try {
      const data = await eventsApi.getShifts(id!);
      setShifts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch shifts:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return formatDateIST(dateString);
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
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('/events')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>
        {event.status === 'draft' && (
          <button
            onClick={() => navigate(`/events/${id}/edit`)}
            className="btn-secondary flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit Event
          </button>
        )}
      </div>

      {/* Event Details */}
      <div className="card p-6 space-y-6">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{event.title}</h1>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                event.status === 'draft' ? 'bg-yellow-500/20 text-yellow-200' :
                event.status === 'published' ? 'bg-green-500/20 text-green-200' :
                event.status === 'cancelled' ? 'bg-red-500/20 text-red-200' :
                'bg-blue-500/20 text-blue-200'
              }`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            </div>
          </div>

          {event.description && (
            <p className="text-slate-300 text-base leading-relaxed">{event.description}</p>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-slate-400">Start Time</p>
              <p className="text-white font-medium">{formatDate(event.start_at)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-slate-400">End Time</p>
              <p className="text-white font-medium">{formatDate(event.end_at)}</p>
            </div>
          </div>

          {event.location_address && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-slate-400">Location</p>
                <p className="text-white font-medium">{event.location_address}</p>
              </div>
            </div>
          )}

          {event.estimated_volunteers && (
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-slate-400">Estimated Volunteers</p>
                <p className="text-white font-medium">{event.estimated_volunteers}</p>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div>
            <p className="text-sm text-slate-400 mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Shifts Section */}
      {event.status === 'published' && (
        <div className="card p-6 space-y-4">
          <h2 className="text-xl font-bold text-white">Shifts ({shifts.length})</h2>
          
          {shifts.length > 0 ? (
            <div className="space-y-3">
              {shifts.map((shift) => (
                <div key={shift.id} className="bg-slate-800 p-4 rounded-lg">
                  <p className="font-medium text-white">{shift.title || 'Shift'}</p>
                  {shift.start_time && (
                    <p className="text-sm text-slate-400">
                      {new Date(shift.start_time).toLocaleTimeString()} - {new Date(shift.end_time).toLocaleTimeString()}
                    </p>
                  )}
                  {shift.max_volunteers && (
                    <p className="text-sm text-slate-400">
                      Capacity: {shift.assigned_volunteers || 0}/{shift.max_volunteers}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-4">No shifts created yet</p>
          )}

          <button
            onClick={() => navigate(`/events/${id}/shifts`)}
            className="btn-primary w-full mt-4"
          >
            Manage Shifts
          </button>
        </div>
      )}
    </div>
  );
};
