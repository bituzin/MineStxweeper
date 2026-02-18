import React from 'react';
import { Calendar } from 'lucide-react';

export default function Gm() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-stacks-gradient1 to-stacks-gradient2 flex flex-col items-center justify-center">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-12 max-w-xl w-full flex flex-col items-center">
        <Calendar size={48} className="text-primary-400 mb-4" />
        <h1 className="text-5xl font-extrabold text-primary-400 mb-4 tracking-tight">GM! 👋</h1>
        <p className="text-lg text-gray-300 mb-6 text-center">Good morning, StacksSweep community!<br />Start your day with positive vibes and blockchain energy.</p>
        <div className="bg-gray-900 rounded-xl p-6 w-full text-center mb-4">
          <span className="text-2xl font-bold text-yellow-400">#SweepGM</span>
          <p className="text-gray-400 mt-2">Share your greeting and connect with others!</p>
        </div>
        <button className="bg-primary-400 hover:bg-primary-500 text-white font-bold py-3 px-8 rounded-xl text-lg transition">Send GM</button>
      </div>
    </div>
  );
}
