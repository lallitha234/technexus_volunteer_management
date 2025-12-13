import React, { useEffect, useState } from 'react';
import { volunteersApi } from '../services/api.js';
import { Volunteer } from '../types/index.js';
import { VolunteerCard } from '../components/VolunteerCard.js';
import { Pagination } from '../components/Pagination.js';
import { Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const VolunteersPage: React.FC = () => {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('active');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const fetchVolunteers = async () => {
    setIsLoading(true);
    try {
      const data = await volunteersApi.list({
        status,
        search: search || undefined,
      });
      setVolunteers(data);
      setPage(1);
    } catch (error) {
      console.error('Failed to fetch volunteers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, [status, search]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this volunteer?')) return;

    try {
      await volunteersApi.delete(id);
      setVolunteers(volunteers.filter((v) => v.id !== id));
    } catch (error) {
      console.error('Failed to delete volunteer:', error);
    }
  };

  const paginatedVolunteers = volunteers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="space-y-6">
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
            <option value="archived">🔴 Archived</option>
          </select>
        </div>
      </div>

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
                onDelete={handleDelete}
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
            {search ? 'Try adjusting your search' : 'Add your first volunteer to get started'}
          </p>
        </div>
      )}
    </div>
  );
};
