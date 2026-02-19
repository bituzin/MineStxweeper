import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { sendGm } from '../lib/stacks';

export default function Gm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSendGm = async () => {
    try {
      setLoading(true);
      setMessage(null);
      const txId = await sendGm();
      setMessage(`GM sent! Transaction: ${txId}`);
    } catch (error: any) {
      console.error('Failed to send GM:', error);
      setMessage(error?.message || 'Failed to send GM');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-stacks-gradient1 to-stacks-gradient2 flex flex-col items-center justify-center font-army">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-12 max-w-xl w-full flex flex-col items-center font-army">
        <Calendar size={48} className="text-primary-400 mb-4" />
        <h1 className="text-5xl font-extrabold text-primary-400 mb-4 tracking-tight font-army">GM! 👋</h1>
        <p className="text-lg text-gray-300 mb-6 text-center font-army">Good morning, StacksSweep community!<br />Start your day with positive vibes and blockchain energy.</p>
        <div className="bg-gray-900 rounded-xl p-6 w-full text-center mb-4 font-army">
          <span className="text-2xl font-bold text-yellow-400 font-army">#SweepGM</span>
          <p className="text-gray-400 mt-2 font-army">Share your greeting and connect with others!</p>
        </div>
        <button 
          onClick={handleSendGm}
          disabled={loading}
          className="bg-primary-400 hover:bg-primary-500 text-white font-bold py-3 px-8 rounded-xl text-lg transition font-army disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send GM'}
        </button>
        {message && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-300">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
