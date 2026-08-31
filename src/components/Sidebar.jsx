import React from 'react';

export default function Sidebar({ activeTab, setActiveTab, user, onLogout }) {
  const menuItems = [
    { id: 'posts', label: 'All Posts', icon: '📝' },
    { id: 'my-posts', label: 'My Content', icon: '📁' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col justify-between hidden md:flex shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-blue-600/30">
            C
          </div>
          <span className="text-xl font-bold tracking-wide text-white">CMS Portal</span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-700/60 bg-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-semibold text-blue-400 border border-slate-600 shrink-0">
              {user?.display_name?.[0]?.toUpperCase() || user?.handle?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-white truncate">{user?.display_name || user?.handle || 'User'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Logout"
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors shrink-0"
          >
            🚪
          </button>
        </div>
      </div>
    </aside>
  );
}