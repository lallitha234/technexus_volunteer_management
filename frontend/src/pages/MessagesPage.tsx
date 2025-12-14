import React, { useEffect, useState } from 'react';
import { messagesApi } from '../services/api.js';
import { Message } from '../types/index.js';
import { Send } from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      // For demo purposes, we'll create a local state
      // In production, this would fetch from the backend
      setMessages([
        {
          id: '1',
          title: 'Event Reminder',
          body: 'Remember to confirm your attendance for the cleanup event tomorrow',
          sent_to_all: true,
          created_at: new Date().toISOString(),
          created_by: 'admin',
        },
        {
          id: '2',
          title: 'Thank You',
          body: 'Thank you for volunteering at the community event!',
          sent_to_all: true,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          created_by: 'admin',
        },
      ] as any);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setIsSending(true);
    try {
      await messagesApi.broadcast({
        subject: 'Broadcast Message',
        content: messageText,
        filter: {},
      });
      setMessageText('');
      fetchMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
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
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">💬 Messages</h1>
          <p className="text-slate-400 mt-1">Send notifications and updates to volunteers</p>
        </div>
      </div>

      {/* Compose message */}
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>✉️</span> Send Broadcast Message
        </h2>

        <form onSubmit={handleBroadcast} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Message
            </label>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message to send to all volunteers..."
              rows={4}
              className="input-field resize-none"
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSending || !messageText.trim()}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {isSending ? 'Sending...' : 'Send to All'}
            </button>
            <p className="text-sm text-slate-400">
              This will notify all active volunteers
            </p>
          </div>
        </form>
      </div>

      {/* Message history */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>📜</span> Message History
        </h2>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card h-24 animate-pulse"></div>
            ))}
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="card p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">
                      {message.title || 'Broadcast Message'}
                    </h3>
                    <p className="text-slate-300 mb-3">{message.body}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>
                        {message.sent_to_all
                          ? '👥 Sent to all volunteers'
                          : '👤 Sent to specific volunteers'}
                      </span>
                      <span>{formatDate(message.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <p className="text-4xl mb-4">💬</p>
            <h3 className="text-xl font-bold text-white mb-2">No messages yet</h3>
            <p className="text-slate-400">
              Send your first broadcast message to engage with volunteers
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
