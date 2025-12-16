import React, { useEffect, useState } from 'react';
import { messagesApi, volunteersApi } from '../services/api.js';
import { Message } from '../types/index.js';
import { Send, AlertCircle, Check, Trash2 } from 'lucide-react';

interface Volunteer {
  id: string;
  full_name: string;
  email: string;
}

export const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sendToAll, setSendToAll] = useState(true);
  const [selectedVolunteer, setSelectedVolunteer] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Fetch volunteers
      const volunteersData = await volunteersApi.list({ status: 'active' });
      setVolunteers(volunteersData);

      // Fetch messages - broadcast messages (sent_to_all is null/true)
      // Since the backend stores messages, we'll fetch them from there
      // For now, we'll create a local state or fetch from a messages list endpoint
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to load volunteers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    if (!messageSubject.trim()) {
      setError('Please enter a message subject');
      return;
    }

    setIsSending(true);
    setError('');
    setSuccess(false);

    try {
      if (sendToAll) {
        // Send broadcast to all active volunteers
        await messagesApi.broadcast({
          subject: messageSubject,
          content: messageText,
          filter: { status: 'active' },
        });
      } else {
        // Send to selected volunteer
        if (!selectedVolunteer) {
          setError('Please select a volunteer');
          setIsSending(false);
          return;
        }
        await messagesApi.send({
          to_volunteer_id: selectedVolunteer,
          subject: messageSubject,
          content: messageText,
        });
      }

      // Add message to local state for display
      const newMessage: any = {
        id: Date.now().toString(),
        title: messageSubject,
        body: messageText,
        sent_to_all: sendToAll,
        created_at: new Date().toISOString(),
        created_by: 'admin',
      };
      setMessages([newMessage, ...messages]);

      setMessageText('');
      setMessageSubject('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      console.error('Failed to send message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      setMessages(messages.filter((msg) => msg.id !== messageId));
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
          <p className="text-green-200">Message sent successfully!</p>
        </div>
      )}

      {/* Compose message */}
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>✉️</span> Send Message
        </h2>

        <form onSubmit={handleBroadcast} className="space-y-4">
          {/* Send To Options */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sendOption"
                checked={sendToAll}
                onChange={() => setSendToAll(true)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-sm font-medium text-slate-300">Send to All Active Volunteers</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sendOption"
                checked={!sendToAll}
                onChange={() => setSendToAll(false)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-sm font-medium text-slate-300">Send to Specific Volunteer</span>
            </label>
          </div>

          {/* Volunteer Selection */}
          {!sendToAll && (
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Select Volunteer *
              </label>
              <select
                value={selectedVolunteer}
                onChange={(e) => setSelectedVolunteer(e.target.value)}
                className="input-field"
                required={!sendToAll}
              >
                <option value="">Choose a volunteer...</option>
                {volunteers.map((volunteer) => (
                  <option key={volunteer.id} value={volunteer.id}>
                    {volunteer.full_name} ({volunteer.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Message Subject */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Subject *
            </label>
            <input
              type="text"
              value={messageSubject}
              onChange={(e) => setMessageSubject(e.target.value)}
              placeholder="Enter message subject..."
              className="input-field"
              required
            />
          </div>

          {/* Message Content */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Message *
            </label>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
              className="input-field resize-none"
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSending || !messageText.trim() || !messageSubject.trim()}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {isSending ? 'Sending...' : sendToAll ? 'Send to All' : 'Send Message'}
            </button>
            <p className="text-sm text-slate-400">
              {sendToAll ? '👥 Will notify all active volunteers' : '📧 Will send via email'}
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
                      {message.title || 'Message'}
                    </h3>
                    <p className="text-slate-300 mb-3">{message.body}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>
                        {message.sent_to_all
                          ? '👥 Sent to all active volunteers'
                          : '📧 Sent to specific volunteer'}
                      </span>
                      <span>{formatDate(message.created_at)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteMessage(message.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400 flex-shrink-0"
                    title="Delete message"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <p className="text-4xl mb-4">💬</p>
            <h3 className="text-xl font-bold text-white mb-2">No messages yet</h3>
            <p className="text-slate-400">
              Send your first message to engage with volunteers
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
