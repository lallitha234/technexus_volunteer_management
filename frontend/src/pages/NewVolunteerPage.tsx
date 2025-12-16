import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { volunteersApi } from '../services/api.js';
import { ArrowLeft, AlertCircle, Check } from 'lucide-react';
import { useRefresh } from '../context/RefreshContext.js';

const SKILLS_OPTIONS = [
  'Event Planning',
  'Marketing',
  'Logistics',
  'Coaching',
  'Teaching',
  'Mentoring',
  'Tech Support',
  'First Aid',
  'Public Speaking',
  'Design',
  'Writing',
  'Photography',
  'Video Production',
  'Social Media',
  'Project Management',
];

const INTERESTS_OPTIONS = [
  'Community Service',
  'Education',
  'Environmental',
  'Healthcare',
  'Sports',
  'Arts & Culture',
  'Youth Development',
  'Senior Care',
  'Animal Welfare',
  'Disaster Relief',
];

const AVAILABILITY_WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const AVAILABILITY_TIME_SLOTS = [
  'Early Morning (6am-9am)',
  'Morning (9am-12pm)',
  'Afternoon (12pm-3pm)',
  'Evening (3pm-6pm)',
  'Late Evening (6pm-9pm)',
];

const PRONOUNS_OPTIONS = [
  'He/Him',
  'She/Her',  'They/Them',
  'Prefer not to say',];

const VOLUNTEER_STATUSES = [
  { label: '🟢 Active', value: 'active' },
  { label: '🔵 Inactive', value: 'inactive' },
  { label: '� Blocked', value: 'blocked' },
];

interface FormData {
  full_name: string;
  display_name: string;
  pronouns: string;
  email: string;
  phone: string;
  bio: string;
  admin_notes: string;
  status: 'active' | 'inactive' | 'blocked';
  skills: string[];
  interests: string[];
  availability_weekdays: string[];
  availability_time_slots: string[];
  consent_contact: boolean;
  consent_photo: boolean;
}

export const NewVolunteerPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshDashboard } = useRefresh();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    display_name: '',
    pronouns: '',
    email: '',
    phone: '',
    bio: '',
    admin_notes: '',
    status: 'active',
    skills: [],
    interests: [],
    availability_weekdays: [],
    availability_time_slots: [],
    consent_contact: false,
    consent_photo: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleWeekdayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      availability_weekdays: prev.availability_weekdays.includes(day)
        ? prev.availability_weekdays.filter((d) => d !== day)
        : [...prev.availability_weekdays, day],
    }));
  };

  const handleTimeSlotToggle = (slot: string) => {
    setFormData((prev) => ({
      ...prev,
      availability_time_slots: prev.availability_time_slots.includes(slot)
        ? prev.availability_time_slots.filter((s) => s !== slot)
        : [...prev.availability_time_slots, slot],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate required fields
    if (!formData.full_name.trim()) {
      setError('Full name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        full_name: formData.full_name,
        display_name: formData.display_name || formData.full_name,
        pronouns: formData.pronouns,
        email: formData.email,
        phone: formData.phone || null,
        bio: formData.bio || null,
        admin_notes: formData.admin_notes || null,
        status: formData.status,
        skills: formData.skills,
        interests: formData.interests,
        availability_weekdays: formData.availability_weekdays,
        availability_time_slots: formData.availability_time_slots,
        consent_contact: formData.consent_contact,
        consent_photo: formData.consent_photo,
      };

      await volunteersApi.create(payload);
      setSuccess(true);
      window.dispatchEvent(new Event('dashboardRefresh'));
      setTimeout(() => {
        navigate('/volunteers');
      }, 1500);
    } catch (err: any) {
      console.error('Failed to create volunteer:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create volunteer. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-white">Add New Volunteer</h1>
          <p className="text-slate-400 mt-1">Register a new community volunteer</p>
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
        {/* Basic Info Card */}
        <div className="card p-6 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>👤</span> Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Display Name
              </label>
              <input
                type="text"
                name="display_name"
                value={formData.display_name}
                onChange={handleInputChange}
                placeholder="John"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Pronouns
              </label>
              <select
                name="pronouns"
                value={formData.pronouns}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pronouns: e.target.value,
                  }))
                }
                className="input-field"
              >
                <option value="">Select pronouns...</option>
                {PRONOUNS_OPTIONS.map((pronoun) => (
                  <option key={pronoun} value={pronoun}>
                    {pronoun}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
              rows={3}
              className="input-field resize-none"
            />
          </div>
        </div>

        {/* Admin Section Card */}
        <div className="card p-6 space-y-4 border border-purple-500/30 bg-purple-500/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🛡️</span> Admin Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Volunteer Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as 'active' | 'inactive' | 'blocked',
                  }))
                }
                className="input-field"
              >
                {VOLUNTEER_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-2">
                Set the initial status for this volunteer
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Admin Notes
            </label>
            <textarea
              name="admin_notes"
              value={formData.admin_notes}
              onChange={handleInputChange}
              placeholder="Internal notes, background check status, special requirements, etc..."
              rows={4}
              className="input-field resize-none"
            />
            <p className="text-xs text-slate-400 mt-2">
              Private notes visible only to administrators
            </p>
          </div>
        </div>

        {/* Skills Card */}
        <div className="card p-6 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⭐</span> Skills
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SKILLS_OPTIONS.map((skill) => (
              <label key={skill} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.skills.includes(skill)}
                  onChange={() => handleSkillToggle(skill)}
                  className="w-4 h-4 rounded border-slate-600 text-purple-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                  {skill}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Interests Card */}
        <div className="card p-6 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>❤️</span> Interests
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {INTERESTS_OPTIONS.map((interest) => (
              <label key={interest} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.interests.includes(interest)}
                  onChange={() => handleInterestToggle(interest)}
                  className="w-4 h-4 rounded border-slate-600 text-purple-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                  {interest}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Availability Card */}
        <div className="card p-6 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📅</span> Availability
          </h2>

          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Preferred Weekdays</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {AVAILABILITY_WEEKDAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleWeekdayToggle(day)}
                  className={`px-3 py-2 rounded-lg font-medium transition-all ${
                    formData.availability_weekdays.includes(day)
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Preferred Time Slots</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {AVAILABILITY_TIME_SLOTS.map((slot) => (
                <label key={slot} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.availability_time_slots.includes(slot)}
                    onChange={() => handleTimeSlotToggle(slot)}
                    className="w-4 h-4 rounded border-slate-600 text-purple-500 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                    {slot}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Consent Card */}
        <div className="card p-6 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>✅</span> Consent & Preferences
          </h2>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="consent_contact"
              checked={formData.consent_contact}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-slate-600 text-purple-500 focus:ring-0 cursor-pointer mt-1"
            />
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
              I consent to be contacted about volunteering opportunities
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="consent_photo"
              checked={formData.consent_photo}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-slate-600 text-purple-500 focus:ring-0 cursor-pointer mt-1"
            />
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
              I consent to my photo being used in promotional materials
            </span>
          </label>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-start gap-3">
            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-green-200">Volunteer created successfully! Redirecting...</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isLoading || success}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : success ? 'Created!' : 'Create Volunteer'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/volunteers')}
            className="btn-secondary"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewVolunteerPage;
