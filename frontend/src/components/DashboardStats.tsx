import React from 'react';
import { AnalyticsSummary } from '../types/index.js';
import { TrendingUp } from 'lucide-react';

interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  unit?: string;
  trend?: number;
  color?: 'purple' | 'blue' | 'green' | 'pink' | 'yellow';
}

const KPICard: React.FC<KPICardProps> = ({
  icon,
  label,
  value,
  unit = '',
  trend,
  color = 'purple',
}) => {
  const colorClasses = {
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30',
    blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/30',
    green: 'from-green-500/20 to-green-500/5 border-green-500/30',
    pink: 'from-pink-500/20 to-pink-500/5 border-pink-500/30',
    yellow: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30',
  };

  return (
    <div
      className={`kpi-card bg-gradient-to-br ${colorClasses[color]} border border-slate-700/50`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-bold">{trend > 0 ? '+' : ''}{trend}%</span>
          </div>
        )}
      </div>
      <p className="text-slate-400 text-sm mb-2">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl sm:text-4xl font-bold text-white">{value}</span>
        {unit && <span className="text-slate-400 text-sm">{unit}</span>}
      </div>
    </div>
  );
};

interface DashboardStatsProps {
  analytics: AnalyticsSummary | null;
  isLoading?: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ analytics, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="kpi-card animate-pulse">
            <div className="h-32 bg-slate-700/30 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <KPICard
        icon="👥"
        label="Total Volunteers"
        value={analytics.total_volunteers}
        color="purple"
      />
      <KPICard
        icon="🟢"
        label="Active (30d)"
        value={analytics.active_volunteers}
        color="green"
      />
      <KPICard
        icon="📅"
        label="Upcoming Events"
        value={analytics.upcoming_events}
        color="blue"
      />
      <KPICard
        icon="⏱️"
        label="Total Hours"
        value={Math.round(analytics.total_hours_contributed)}
        unit="hrs"
        color="yellow"
      />
      <KPICard
        icon="📊"
        label="Event Fill Rate"
        value={analytics.event_fill_rate}
        unit="%"
        color="pink"
      />
      <KPICard
        icon="📉"
        label="No-show Rate"
        value={analytics.no_show_rate}
        unit="%"
        color="pink"
      />
    </div>
  );
};
