import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { volunteersApi, badgesApi } from '../services/api.js';
import { Volunteer, Badge } from '../types/index.js';
import { ArrowLeft, AlertCircle, Check, Award } from 'lucide-react';

export const BadgeAssignmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const volunteerData = await volunteersApi.get(id!);
      setVolunteer(volunteerData);

      // Try to fetch badges from API
      try {
        const badgesData = await badgesApi.list();
        setBadges(badgesData);
      } catch (badgeError) {
        console.warn('Failed to fetch badges from API, using default badges:', badgeError);
        // Use default badges if API fails
        const defaultBadges: Badge[] = [
          {
            id: '1',
            name: 'Star Volunteer',
            description: 'Awarded to exceptional volunteers',
            emoji: '⭐',
            criteria: 'manual',
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Super Helper',
            description: 'For amazing contributions',
            emoji: '🦸',
            criteria: 'manual',
            created_at: new Date().toISOString(),
          },
          {
            id: '3',
            name: '100 Hour Champion',
            description: 'Volunteered 100+ hours',
            emoji: '🏆',
            criteria: 'hours',
            criteria_value: 100,
            created_at: new Date().toISOString(),
          },
          {
            id: '4',
            name: 'Event Master',
            description: 'Participated in 10+ events',
            emoji: '🎯',
            criteria: 'events',
            criteria_value: 10,
            created_at: new Date().toISOString(),
          },
          {
            id: '5',
            name: 'Perfect Attendance',
            description: 'Never missed a scheduled event',
            emoji: '✅',
            criteria: 'manual',
            created_at: new Date().toISOString(),
          },
        ];
        setBadges(defaultBadges);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load volunteer data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBadge) {
      setError('Please select a badge');
      return;
    }

    setIsAssigning(true);
    setError('');
    setSuccess('');

    try {
      await volunteersApi.assignBadge(id!, selectedBadge);
      setSuccess(`✨ Badge assigned successfully to ${volunteer?.full_name}!`);
      setSelectedBadge('');
      setTimeout(() => {
        navigate('/volunteers');
      }, 2000);
    } catch (err: any) {
      console.error('Failed to assign badge:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to assign badge';
      setError(errorMessage);
    } finally {
      setIsAssigning(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/volunteers')}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">🏆 Award Badge</h1>
          <p className="text-slate-400 mt-1">Recognize volunteer achievements</p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-start gap-3">
          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <p className="text-green-200">{success}</p>
        </div>
      )}

      {/* Volunteer Info */}
      {volunteer && (
        <div className="card p-6">
          <div className="flex items-start gap-4">
            {volunteer.photo_url ? (
              <img
                src={volunteer.photo_url}
                alt={volunteer.full_name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                {volunteer.full_name.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-white">{volunteer.full_name}</h2>
              <p className="text-slate-400">{volunteer.email}</p>
              <p className="text-sm text-slate-500 mt-1">
                Status: {volunteer.status === 'active' ? '🟢 Active' : volunteer.status === 'inactive' ? '🔵 Inactive' : '🚫 Blocked'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Badge Assignment Form */}
      <div className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5" />
          Select Badge to Award
        </h2>

        <form onSubmit={handleAssignBadge} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-3">
              Available Badges
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {badges.length > 0 ? (
                badges.map((badge) => (
                  <label
                    key={badge.id}
                    className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedBadge === badge.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="badge"
                      value={badge.id}
                      checked={selectedBadge === badge.id}
                      onChange={(e) => setSelectedBadge(e.target.value)}
                      className="w-4 h-4 cursor-pointer mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{badge.emoji || '🏆'}</span>
                        <div>
                          <h3 className="font-bold text-white">{badge.name}</h3>
                          {badge.description && (
                            <p className="text-xs text-slate-400 mt-1">{badge.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </label>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-slate-400">No badges available</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isAssigning || !selectedBadge || badges.length === 0}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              {isAssigning ? 'Assigning...' : 'Award Badge'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/volunteers')}
              className="btn-secondary"
              disabled={isAssigning}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BadgeAssignmentPage;
