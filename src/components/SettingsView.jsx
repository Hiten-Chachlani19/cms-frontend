import React from 'react';

export default function SettingsView({ user }) {
  return (
    <div className="max-w-xl bg-slate-800 p-6 border border-slate-700 rounded-2xl space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Account Settings</h2>
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Display Name</label>
        <input
          type="text"
          defaultValue={user?.display_name || user?.handle}
          className="w-full px-4 py-2 bg-slate-700/60 border border-slate-600 rounded-xl text-white"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
        <input
          type="email"
          disabled
          defaultValue={user?.email}
          className="w-full px-4 py-2 bg-slate-700/30 border border-slate-600/50 rounded-xl text-slate-400"
        />
      </div>
    </div>
  );
}