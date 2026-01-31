/**
 * @fileoverview Floating feedback button with modal for anonymous feedback submission.
 * Only visible to non-developer roles. Minimal UI impact.
 * Styled to match the warm teal/orange theme of the portal.
 */

import React, { useState } from 'react';
import { MessageSquarePlus, X, Send, Loader2 } from 'lucide-react';
import { submitFeedback } from '../../services/feedbackService';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'bug', label: '🐛 Bug Report' },
  { value: 'feature', label: '✨ Feature Request' },
  { value: 'improvement', label: '💡 Improvement' },
  { value: 'other', label: '💬 Other' },
];

const FeedbackButton = () => {
  const { userInfo } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('other');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Don't render for developers
  if (!userInfo || userInfo.role === 'developer') {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Please enter your feedback');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitFeedback({ message: message.trim(), category });
      toast.success('Feedback submitted anonymously!');
      setMessage('');
      setCategory('other');
      setIsOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button - Teal theme */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 bg-[#34656D] hover:bg-[#2a5259] text-[#FAF8F1] p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#34656D] focus:ring-offset-2"
        title="Send Feedback"
        aria-label="Open feedback form"
      >
        <MessageSquarePlus size={24} />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Content */}
          <div 
            className="bg-[#FAF8F1] rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-[#34656D]/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Teal gradient */}
            <div className="bg-gradient-to-r from-[#34656D] to-[#3d7a84] px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-[#FAF8F1] font-semibold text-lg">Send Feedback</h2>
                <p className="text-[#FAF8F1]/80 text-sm">Your feedback is anonymous</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#FAF8F1]/80 hover:text-[#FAF8F1] transition-colors"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Category Select */}
              <div>
                <label className="block text-sm font-medium text-[#334443] mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                        category === cat.value
                          ? 'border-[#34656D] bg-[#34656D]/10 text-[#34656D] font-medium'
                          : 'border-[#34656D]/20 hover:border-[#34656D]/40 text-[#334443]/70 bg-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Textarea */}
              <div>
                <label className="block text-sm font-medium text-[#334443] mb-2">
                  Your Feedback
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what's on your mind..."
                  rows={4}
                  maxLength={2000}
                  className="w-full px-4 py-3 border border-[#34656D]/20 rounded-lg focus:ring-2 focus:ring-[#34656D] focus:border-transparent resize-none transition-all bg-white text-[#334443] placeholder-[#334443]/40"
                />
                <p className="text-xs text-[#334443]/50 mt-1 text-right">
                  {message.length}/2000
                </p>
              </div>

              {/* Anonymous Notice */}
              <div className="bg-[#FAEAB1]/50 rounded-lg px-4 py-3 text-sm text-[#334443] border border-[#FAEAB1]">
                <span className="font-medium">🔒 Privacy:</span> Only your role ({userInfo.role}) will be visible to developers. Your identity remains anonymous.
              </div>

              {/* Submit Button - Orange accent */}
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="w-full bg-[#E07B39] hover:bg-[#c96a2f] disabled:bg-[#334443]/30 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Feedback
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackButton;
