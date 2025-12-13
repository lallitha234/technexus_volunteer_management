import React from 'react';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  pageSize,
  total,
  onPageChange,
}) => {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6 px-4 py-4">
      <p className="text-sm text-slate-400">
        Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors text-sm"
        >
          ← Previous
        </button>

        <div className="flex items-center gap-1">
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === page;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-2 py-1 rounded text-sm transition-colors ${
                  isActive
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 rounded bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors text-sm"
        >
          Next →
        </button>
      </div>
    </div>
  );
};
