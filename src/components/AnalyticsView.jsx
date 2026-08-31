import React from 'react';

export default function AnalyticsView({ postsCount, user }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Performance Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-800 border border-slate-700 rounded-2xl">
          <p className="text-xs text-slate-400 uppercase">Total Articles</p>
          <h3 className="text-3xl font-bold text-white mt-2">{postsCount}</h3>
        </div>
        <div className="p-5 bg-slate-800 border border-slate-700 rounded-2xl">
          <p className="text-xs text-slate-400 uppercase">Estimated Views</p>
          <h3 className="text-3xl font-bold text-blue-400 mt-2">{postsCount * 142}</h3>
        </div>
        <div className="p-5 bg-slate-800 border border-slate-700 rounded-2xl">
          <p className="text-xs text-slate-400 uppercase">Account Status</p>
          <h3 className="text-3xl font-bold text-emerald-400 mt-2">Active</h3>
        </div>
      </div>
    </div>
  );
}