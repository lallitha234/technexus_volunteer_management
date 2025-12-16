import React, { useEffect, useState } from 'react';
import { volunteersApi } from '../services/api.js';
import { Volunteer } from '../types/index.js';
import { VolunteerCard } from '../components/VolunteerCard.js';
import { Pagination } from '../components/Pagination.js';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal.js';
import { Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRefresh } from '../context/RefreshContext.js';

export const VolunteersPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshDashboard } = useRefresh();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('active');
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    volunteerId: string;
    volunteerName: string;
    isDeleting: boolean;
  }>({
    isOpen: false,
    volunteerId: '',
    volunteerName: '',
    isDeleting: false,
  });
  const pageSize = 12;

  const fetchVolunteers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await volunteersApi.list({
        status,
        search: search || undefined,
      });
      // Handle both array and wrapped response formats
      const volunteersList = Array.isArray(data) ? data : (data?.data || []);
      setVolunteers(volunteersList);
      setPage(1);
    } catch (err) {
      console.error('Failed to fetch volunteers:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load volunteers. Please try again.';
      setError(errorMessage);
      setVolunteers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, [status, search]);

  const handleDeleteClick = (volunteer: Volunteer) => {
    setDeleteModal({
      isOpen: true,
      volunteerId: volunteer.id,
      volunteerName: volunteer.full_name,
      isDeleting: false,
    });
  };

  const handleConfirmDelete = async () => {
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    try {
      await volunteersApi.delete(deleteModal.volunteerId);
      setVolunteers(volunteers.filter((v) => v.id !== deleteModal.volunteerId));
      setDeleteModal({ isOpen: false, volunteerId: '', volunteerName: '', isDeleting: false });
      window.dispatchEvent(new Event('dashboardRefresh'));
    } catch (error) {
      console.error('Failed to delete volunteer:', error);
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, volunteerId: '', volunteerName: '', isDeleting: false });
  };

  const paginatedVolunteers = volunteers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Volunteer"
        message="Are you sure you want to delete this volunteer? They will be archived and their records will be preserved."
        itemName={deleteModal.volunteerName}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteModal.isDeleting}
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-white">👥 Volunteers</h1>
          <p className="text-slate-400 mt-1">Manage your volunteer community</p>
        </div>
        <button onClick={() => navigate('/volunteers/new')} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Volunteer
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 space-y-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Status filter */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-field"
          >
            <option value="active">🟢 Active</option>
            <option value="inactive">🔵 Inactive</option>
            <option value="blocked">🚫 Blocked</option>
          </select>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="card p-4 bg-red-500/10 border border-red-500/30">
          <div className="flex items-center justify-between">
            <p className="text-red-200">{error}</p>
            <button
              onClick={fetchVolunteers}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Volunteers grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card h-64 animate-pulse"></div>
          ))}
        </div>
      ) : paginatedVolunteers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedVolunteers.map((volunteer) => (
              <VolunteerCard
                key={volunteer.id}
                volunteer={volunteer}
                onEdit={(v) => navigate(`/volunteers/${v.id}/edit`)}
                onDelete={handleDeleteClick}
                onBadge={(id) => navigate(`/volunteers/${id}/badge`)}
              />
            ))}
          </div>
          <Pagination
            page={page}
            pageSize={pageSize}
            total={volunteers.length}
            onPageChange={setPage}
          />
        </>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-4">👥</p>
          <h3 className="text-xl font-bold text-white mb-2">No volunteers found</h3>
          <p className="text-slate-400">
            {search ? 'Try adjusting your search' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default VolunteersPage;
