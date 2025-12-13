import React, { useEffect, useState } from 'react';
import { tasksApi } from '../services/api.js';
import { Task } from '../types/index.js';
import { Check, Plus, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<'pending' | 'on_process' | 'completed'>('pending');

  useEffect(() => {
    fetchTasks();
  }, [status]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await tasksApi.list({ status });
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await tasksApi.complete(id);
      fetchTasks();
    } catch (error) {
      console.error('Failed to complete task:', error);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-white">⚡ Tasks</h1>
          <p className="text-slate-400 mt-1">Manage admin tasks and reminders</p>
        </div>
        <button
          onClick={() => navigate('/tasks/new')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </div>

      {/* Status filter */}
      <div className="card p-4 flex gap-2">
        {[
          { label: '📋 Pending', value: 'pending' as const },
          { label: '⏳ In Progress', value: 'on_process' as const },
          { label: '✅ Completed', value: 'completed' as const },
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

      {/* Tasks list */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card h-24 animate-pulse"></div>
          ))}
        </div>
      ) : tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="card p-6 hover:shadow-lg transition-shadow border-l-4 border-purple-500"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white">{task.title}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(
                        task.priority || 'medium'
                      )}`}
                    >
                      {task.priority || 'Medium'}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-sm text-slate-400 mb-3">{task.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {task.due_at ? (
                        formatDate(task.due_at)
                      ) : (
                        <span>No due date</span>
                      )}
                    </div>
                    {task.assigned_to && (
                      <div>Assigned to: {task.assigned_to}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {task.status === 'pending' && (
                    <button
                      onClick={() => handleComplete(task.id)}
                      className="btn-secondary flex items-center gap-2 text-sm"
                    >
                      <Check className="w-4 h-4" />
                      Mark Done
                    </button>
                  )}
                  {task.status === 'completed' && (
                    <span className="text-green-400 flex items-center gap-1">
                      <Check className="w-5 h-5" />
                      Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-4">⚡</p>
          <h3 className="text-xl font-bold text-white mb-2">No tasks</h3>
          <p className="text-slate-400">
            {status === 'pending'
              ? 'Great! You have no pending tasks'
              : 'No completed tasks yet'}
          </p>
        </div>
      )}
    </div>
  );
};
