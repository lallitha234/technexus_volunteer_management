import React from 'react';
import { Volunteer } from '../types/index.js';
import { Edit2, Trash2, Star } from 'lucide-react';

interface VolunteerCardProps {
  volunteer: Volunteer;
  onEdit?: (volunteer: Volunteer) => void;
  onDelete?: (volunteer: Volunteer) => void;
  onBadge?: (id: string) => void;
}

export const VolunteerCard: React.FC<VolunteerCardProps> = ({
  volunteer,
  onEdit,
  onDelete,
  onBadge,
}) => {
  return (
    <div className="card p-4 sm:p-6 hover:scale-105 transition-transform duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex gap-3 flex-1 min-w-0">
          {volunteer.photo_url ? (
            <img
              src={volunteer.photo_url}
              alt={volunteer.full_name}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
              {volunteer.full_name.charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-white truncate">{volunteer.full_name}</h3>
            <p className="text-xs sm:text-sm text-slate-400 truncate">{volunteer.email}</p>
            {volunteer.pronouns && (
              <p className="text-xs text-slate-500">{volunteer.pronouns}</p>
            )}
          </div>
        </div>

        {/* Status badge */}
        <div className="badge whitespace-nowrap">
          {volunteer.status === 'active' ? '🟢 Active' : volunteer.status === 'inactive' ? '🔵 Inactive' : '🚫 Blocked'}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
        <div className="bg-slate-700/30 rounded p-2">
          <p className="text-slate-400">⏱️ Hours</p>
          <p className="font-bold text-white">{volunteer.total_hours}</p>
        </div>
        <div className="bg-slate-700/30 rounded p-2">
          <p className="text-slate-400">📅 Events</p>
          <p className="font-bold text-white">{volunteer.total_events}</p>
        </div>
      </div>

      {/* Skills */}
      {volunteer.skills.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-2">Skills</p>
          <div className="flex flex-wrap gap-1">
            {volunteer.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded">
                {skill}
              </span>
            ))}
            {volunteer.skills.length > 3 && (
              <span className="text-xs text-slate-400">+{volunteer.skills.length - 3}</span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-slate-700/50">
        {onBadge && (
          <button
            onClick={() => onBadge(volunteer.id)}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs rounded bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30 transition-colors"
          >
            <Star className="w-3 h-3" />
            <span className="hidden sm:inline">Badge</span>
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(volunteer)}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs rounded bg-blue-500/20 text-blue-200 hover:bg-blue-500/30 transition-colors"
          >
            <Edit2 className="w-3 h-3" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(volunteer)}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs rounded bg-red-500/20 text-red-200 hover:bg-red-500/30 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        )}
      </div>
    </div>
  );
};
