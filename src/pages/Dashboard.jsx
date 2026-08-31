import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [showCreate, setShowCreate] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const res = await api.get('/posts');

      const data = res.data?.data || res.data || [];

      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const myPosts = useMemo(() => {
    const userId = String(user?.id || '');

    return posts.filter(
      (post) =>
        String(post.user_id || post.author?.id || '') === userId
    );
  }, [posts, user]);

  const filteredPosts = useMemo(() => {
    let result =
      activeSection === 'my-posts'
        ? myPosts
        : posts;

    if (search.trim()) {
      const q = search.toLowerCase();

      result = result.filter((post) => {
        return (
          post.body?.toLowerCase().includes(q) ||
          post.title?.toLowerCase().includes(q) ||
          post.author?.handle?.toLowerCase().includes(q)
        );
      });
    }

    return result;
  }, [posts, myPosts, activeSection, search]);

  const totalLikes = posts.reduce(
    (sum, post) => sum + Number(post.like_count || 0),
    0
  );

  const totalReplies = posts.reduce(
    (sum, post) => sum + Number(post.reply_count || 0),
    0
  );

  const totalReposts = posts.reduce(
    (sum, post) => sum + Number(post.repost_count || 0),
    0
  );

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!newPost.trim()) return;

    try {
      setCreating(true);

      const res = await api.post('/posts', {
        body: newPost.trim(),
      });

      const created = res.data?.data || res.data;

      setPosts((prev) => [created, ...prev]);
      setNewPost('');
      setShowCreate(false);
      setActiveSection('posts');
    } catch (err) {
      console.error('Failed to create post:', err);
      alert(
        err.response?.data?.message ||
          'Failed to create post'
      );
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error(err);
      navigate('/');
    }
  };

  const openPost = (id) => {
    navigate(`/post/${id}`);
  };

  const initials = (
    user?.handle ||
    user?.username ||
    user?.display_name ||
    'U'
  )
    .charAt(0)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#070a0f] text-white">

      {/* ================= MOBILE HEADER ================= */}

      <header className="lg:hidden sticky top-0 z-50 border-b border-white/[0.06] bg-[#070a0f]/95 backdrop-blur-xl">

        <div className="h-16 px-4 flex items-center justify-between">

          <button
            onClick={() => setActiveSection('overview')}
            className="flex items-center gap-2"
          >
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center font-black shadow-lg shadow-blue-600/20">
              D
            </div>

            <span className="font-black text-sm">
              DevPulse
            </span>
          </button>

          <button
            onClick={() => setShowCreate(true)}
            className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-lg"
          >
            +
          </button>

        </div>

      </header>


      {/* ================= DESKTOP SIDEBAR ================= */}

      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[250px] border-r border-white/[0.06] bg-[#090c12] flex-col">

        {/* Logo */}

        <div className="h-20 px-6 flex items-center gap-3 border-b border-white/[0.05]">

          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center font-black shadow-lg shadow-blue-600/20">
            D
          </div>

          <div>
            <div className="font-black tracking-tight">
              DevPulse
            </div>

            <div className="text-[9px] uppercase tracking-[0.2em] text-slate-600">
              CMS Platform
            </div>
          </div>

        </div>


        {/* User */}

        <div className="px-5 py-5">

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3 flex items-center gap-3">

            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-black">
              {initials}
            </div>

            <div className="min-w-0">

              <p className="text-xs font-bold truncate">
                @{user?.handle || user?.username || 'developer'}
              </p>

              <p className="text-[10px] text-slate-600 mt-1">
                Content Creator
              </p>

            </div>

          </div>

        </div>


        {/* Navigation */}

        <nav className="px-4 space-y-1">

          <SidebarButton
            active={activeSection === 'overview'}
            icon="⌂"
            label="Overview"
            onClick={() => setActiveSection('overview')}
          />

          <SidebarButton
            active={activeSection === 'posts'}
            icon="▤"
            label="All Posts"
            onClick={() => setActiveSection('posts')}
          />

          <SidebarButton
            active={activeSection === 'my-posts'}
            icon="✎"
            label="My Posts"
            onClick={() => setActiveSection('my-posts')}
            count={myPosts.length}
          />

          <SidebarButton
            active={activeSection === 'analytics'}
            icon="◫"
            label="Analytics"
            onClick={() => setActiveSection('analytics')}
          />

          <SidebarButton
            active={activeSection === 'settings'}
            icon="⚙"
            label="Settings"
            onClick={() => setActiveSection('settings')}
          />

        </nav>


        {/* Create */}

        <div className="px-4 mt-6">

          <button
            onClick={() => setShowCreate(true)}
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-bold transition shadow-lg shadow-blue-600/20"
          >
            + Create New Post
          </button>

        </div>


        {/* Bottom */}

        <div className="mt-auto p-4 border-t border-white/[0.05]">

          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-slate-500 hover:text-white hover:bg-white/[0.04]"
          >
            ← Back to Website
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-slate-500 hover:text-red-400 hover:bg-red-500/[0.04]"
          >
            ↪ Logout
          </button>

        </div>

      </aside>


      {/* ================= MAIN ================= */}

      <main className="lg:ml-[250px] min-h-screen">

        {/* Topbar */}

        <header className="hidden lg:flex h-20 border-b border-white/[0.06] items-center justify-between px-8 sticky top-0 z-40 bg-[#070a0f]/90 backdrop-blur-xl">

          <div>

            <p className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold">
              Workspace
            </p>

            <h1 className="text-lg font-black mt-1 capitalize">
              {activeSection.replace('-', ' ')}
            </h1>

          </div>


          <div className="flex items-center gap-3">

            <div className="relative">

              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">
                ⌕
              </span>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search posts..."
                className="w-64 rounded-xl border border-white/[0.06] bg-white/[0.025] py-2.5 pl-9 pr-3 text-xs outline-none focus:border-blue-500/40"
              />

            </div>

            <button
              onClick={() => setShowCreate(true)}
              className="rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold transition"
            >
              + Create
            </button>

          </div>

        </header>


        {/* Mobile Search */}

        <div className="lg:hidden px-4 pt-5">

          <div className="relative">

            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">
              ⌕
            </span>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts..."
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.025] py-3 pl-9 pr-3 text-xs outline-none"
            />

          </div>

        </div>


        <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">


          {/* ================= OVERVIEW ================= */}

          {activeSection === 'overview' && (

            <>

              {/* Welcome */}

              <section className="mb-8">

                <div className="rounded-3xl border border-blue-500/10 bg-gradient-to-br from-blue-600/[0.12] via-indigo-600/[0.06] to-transparent p-6 sm:p-8 relative overflow-hidden">

                  <div className="absolute right-0 top-0 h-40 w-40 bg-blue-500/10 blur-3xl rounded-full" />

                  <p className="text-xs text-blue-400 font-bold">
                    Welcome back 👋
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-black mt-2">
                    @{user?.handle || user?.username || 'developer'}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl">
                    Manage your content, publish new posts and
                    engage with the developer community.
                  </p>

                  <button
                    onClick={() => setShowCreate(true)}
                    className="mt-5 rounded-xl bg-white text-black px-5 py-2.5 text-xs font-bold hover:bg-slate-200 transition"
                  >
                    Create your next post →
                  </button>

                </div>

              </section>


              {/* Stats */}

              <section className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-8">

                <StatCard
                  label="Total Posts"
                  value={posts.length}
                  icon="▤"
                />

                <StatCard
                  label="My Posts"
                  value={myPosts.length}
                  icon="✎"
                />

                <StatCard
                  label="Total Likes"
                  value={totalLikes}
                  icon="♥"
                />

                <StatCard
                  label="Replies"
                  value={totalReplies}
                  icon="◌"
                />

              </section>


              {/* Recent Posts */}

              <section>

                <SectionHeader
                  title="Recent Posts"
                  subtitle="Latest content from the community"
                  action="View all"
                  onAction={() => setActiveSection('posts')}
                />

                <PostGrid
                  posts={posts.slice(0, 6)}
                  loading={loading}
                  onPostClick={openPost}
                />

              </section>

            </>

          )}


          {/* ================= POSTS ================= */}

          {(activeSection === 'posts' ||
            activeSection === 'my-posts') && (

            <>

              <div className="mb-6">

                <h2 className="text-2xl font-black">
                  {activeSection === 'my-posts'
                    ? 'My Posts'
                    : 'All Posts'}
                </h2>

                <p className="text-xs text-slate-600 mt-1">
                  {activeSection === 'my-posts'
                    ? 'Posts published by you'
                    : 'Browse the latest community content'}
                </p>

              </div>

              <PostGrid
                posts={filteredPosts}
                loading={loading}
                onPostClick={openPost}
              />

            </>

          )}


          {/* ================= ANALYTICS ================= */}

          {activeSection === 'analytics' && (

            <section>

              <div className="mb-8">

                <h2 className="text-2xl font-black">
                  Analytics
                </h2>

                <p className="text-xs text-slate-600 mt-1">
                  Overview of your content performance
                </p>

              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <StatCard
                  label="Posts"
                  value={myPosts.length}
                  icon="▤"
                />

                <StatCard
                  label="Likes"
                  value={myPosts.reduce(
                    (a, p) => a + Number(p.like_count || 0),
                    0
                  )}
                  icon="♥"
                />

                <StatCard
                  label="Replies"
                  value={myPosts.reduce(
                    (a, p) => a + Number(p.reply_count || 0),
                    0
                  )}
                  icon="◌"
                />

                <StatCard
                  label="Reposts"
                  value={myPosts.reduce(
                    (a, p) => a + Number(p.repost_count || 0),
                    0
                  )}
                  icon="↻"
                />

              </div>


              <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">

                <h3 className="text-sm font-bold">
                  Content Performance
                </h3>

                <div className="mt-6 space-y-5">

                  <MetricBar
                    label="Likes"
                    value={myPosts.reduce(
                      (a, p) => a + Number(p.like_count || 0),
                      0
                    )}
                  />

                  <MetricBar
                    label="Replies"
                    value={myPosts.reduce(
                      (a, p) => a + Number(p.reply_count || 0),
                      0
                    )}
                  />

                  <MetricBar
                    label="Reposts"
                    value={myPosts.reduce(
                      (a, p) => a + Number(p.repost_count || 0),
                      0
                    )}
                  />

                </div>

              </div>

            </section>

          )}


          {/* ================= SETTINGS ================= */}

          {activeSection === 'settings' && (

            <section>

              <div className="mb-8">

                <h2 className="text-2xl font-black">
                  Settings
                </h2>

                <p className="text-xs text-slate-600 mt-1">
                  Manage your account information
                </p>

              </div>


              <div className="max-w-2xl space-y-4">

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">

                  <p className="text-[10px] uppercase tracking-widest text-slate-600">
                    Username
                  </p>

                  <p className="text-sm font-semibold mt-2">
                    @{user?.handle || user?.username || 'developer'}
                  </p>

                </div>


                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">

                  <p className="text-[10px] uppercase tracking-widest text-slate-600">
                    Display Name
                  </p>

                  <p className="text-sm font-semibold mt-2">
                    {user?.display_name || 'Not provided'}
                  </p>

                </div>


                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">

                  <p className="text-[10px] uppercase tracking-widest text-slate-600">
                    Email
                  </p>

                  <p className="text-sm font-semibold mt-2 break-all">
                    {user?.email || 'Not provided'}
                  </p>

                </div>


                <button
                  onClick={handleLogout}
                  className="rounded-xl border border-red-500/20 bg-red-500/[0.05] text-red-400 px-5 py-3 text-xs font-bold hover:bg-red-500/10 transition"
                >
                  Logout from account
                </button>

              </div>

            </section>

          )}

        </div>

      </main>


      {/* ================= CREATE MODAL ================= */}

      {showCreate && (

        <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-xl rounded-3xl border border-white/[0.08] bg-[#0d1118] shadow-2xl">

            <div className="p-5 sm:p-6 border-b border-white/[0.06] flex items-center justify-between">

              <div>

                <h3 className="font-black">
                  Create Post
                </h3>

                <p className="text-[10px] text-slate-600 mt-1">
                  Share something with the developer community
                </p>

              </div>

              <button
                onClick={() => setShowCreate(false)}
                className="h-8 w-8 rounded-lg bg-white/[0.04] text-slate-500 hover:text-white"
              >
                ×
              </button>

            </div>


            <form onSubmit={handleCreatePost} className="p-5 sm:p-6">

              <div className="flex gap-3">

                <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-black">
                  {initials}
                </div>

                <textarea
                  autoFocus
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What's happening in tech?"
                  className="w-full min-h-[180px] resize-none bg-transparent text-sm leading-6 outline-none placeholder:text-slate-700"
                />

              </div>


              <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">

                <span className="text-[10px] text-slate-600">
                  {newPost.length} characters
                </span>

                <div className="flex gap-2">

                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-white/[0.04]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={creating || !newPost.trim()}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold disabled:opacity-40"
                  >
                    {creating ? 'Publishing...' : 'Publish Post'}
                  </button>

                </div>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}


/* =========================================================
   COMPONENTS
========================================================= */

function SidebarButton({
  active,
  icon,
  label,
  onClick,
  count,
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-semibold transition ${
        active
          ? 'bg-blue-500/10 text-blue-400'
          : 'text-slate-500 hover:text-white hover:bg-white/[0.035]'
      }`}
    >
      <span className="w-5 text-center">
        {icon}
      </span>

      <span className="flex-1 text-left">
        {label}
      </span>

      {count !== undefined && (
        <span className="text-[9px] bg-white/[0.05] px-1.5 py-0.5 rounded-md">
          {count}
        </span>
      )}
    </button>
  );
}


function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5 hover:border-white/[0.1] transition">

      <div className="flex items-center justify-between">

        <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">
          {label}
        </span>

        <span className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-sm">
          {icon}
        </span>

      </div>

      <p className="mt-4 text-2xl sm:text-3xl font-black">
        {value}
      </p>

    </div>
  );
}


function SectionHeader({
  title,
  subtitle,
  action,
  onAction,
}) {
  return (
    <div className="flex items-end justify-between mb-5">

      <div>

        <h2 className="text-sm font-black">
          {title}
        </h2>

        <p className="text-[10px] text-slate-600 mt-1">
          {subtitle}
        </p>

      </div>

      {action && (
        <button
          onClick={onAction}
          className="text-[10px] font-bold text-blue-400 hover:text-blue-300"
        >
          {action} →
        </button>
      )}

    </div>
  );
}


function PostGrid({
  posts,
  loading,
  onPostClick,
}) {
  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">

        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-48 rounded-2xl bg-white/[0.025] border border-white/[0.05] animate-pulse"
          />
        ))}

      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.08] p-12 text-center">

        <div className="text-3xl mb-3">
          ◌
        </div>

        <h3 className="text-sm font-bold">
          No posts found
        </h3>

        <p className="text-[10px] text-slate-600 mt-2">
          Try creating a post or changing your search.
        </p>

      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">

      {posts.map((post) => (

        <article
          key={post.id}
          onClick={() => onPostClick(post.id)}
          className="group cursor-pointer rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 hover:bg-white/[0.04] hover:border-blue-500/20 transition-all"
        >

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2 min-w-0">

              <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-black">
                {(post.author?.handle || 'D')
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <span className="text-[10px] font-bold truncate">
                @{post.author?.handle || 'developer'}
              </span>

            </div>

            <span className="text-[9px] text-slate-700">
              #{post.id}
            </span>

          </div>


          <p className="mt-5 text-xs leading-6 text-slate-400 line-clamp-5">
            {post.body || 'No content available.'}
          </p>


          <div className="mt-5 pt-4 border-t border-white/[0.05] flex items-center justify-between">

            <div className="flex gap-4 text-[9px] text-slate-600">

              <span>
                ♥ {post.like_count || 0}
              </span>

              <span>
                ◌ {post.reply_count || 0}
              </span>

              <span>
                ↻ {post.repost_count || 0}
              </span>

            </div>

            <span className="text-[9px] text-blue-400 opacity-0 group-hover:opacity-100 transition">
              Open →
            </span>

          </div>

        </article>

      ))}

    </div>
  );
}


function MetricBar({ label, value }) {
  const width = Math.min(Number(value) * 10, 100);

  return (
    <div>

      <div className="flex justify-between text-[10px] mb-2">

        <span className="text-slate-500">
          {label}
        </span>

        <span className="text-slate-300 font-bold">
          {value}
        </span>

      </div>

      <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">

        <div
          className="h-full bg-blue-500 rounded-full transition-all"
          style={{ width: `${width}%` }}
        />

      </div>

    </div>
  );
}