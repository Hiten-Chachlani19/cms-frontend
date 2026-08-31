import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Feed() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const endpoint = searchQuery ? `/search?q=${searchQuery}` : '/posts';
      const res = await api.get(endpoint);
      setPosts(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [searchQuery]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const res = await api.post('/posts', { content: newPost });
      setPosts([res.data, ...posts]);
      setNewPost('');
    } catch (err) {
      alert('Failed to publish post!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex justify-center">
      <div className="w-full max-w-2xl border-x border-slate-800 min-h-screen p-4 flex flex-col gap-6">
        
        <header className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-slate-400">Welcome, @{user?.name || 'User'}</p>
          </div>
          <button 
            onClick={logout} 
            className="px-3 py-1.5 text-sm bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition">
            Logout
          </button>
        </header>

        <div>
          <input 
            type="text"
            placeholder="Search posts or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <form onSubmit={handleCreatePost} className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 flex flex-col gap-3">
          <textarea
            rows="3"
            placeholder="What's on your mind?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none resize-none"
          />
          <div className="flex justify-end border-t border-slate-700/50 pt-3">
            <button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2 rounded-lg text-sm transition">
              Post
            </button>
          </div>
        </form>

        <div className="flex flex-col gap-4">
          {loading ? (
            <p className="text-center text-slate-500 py-6">Loading Feed...</p>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} onPostUpdate={fetchPosts} />
            ))
          )}
        </div>

      </div>
    </div>
  );
}

function PostCard({ post, onPostUpdate }) {
  const [liked, setLiked] = useState(post.is_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState('');

  const handleLikeToggle = async () => {
    try {
      if (liked) {
        await api.delete(`/posts/${post.id}/likes`);
        setLikesCount((prev) => prev - 1);
      } else {
        await api.post(`/posts/${post.id}/likes`);
        setLikesCount((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRepost = async () => {
    try {
      await api.post(`/posts/${post.id}/repost`);
      onPostUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleReplies = async () => {
    if (!showReplies && replies.length === 0) {
      try {
        const res = await api.get(`/posts/${post.id}/replies`);
        setReplies(res.data.data || res.data);
      } catch (err) {
        console.error(err);
      }
    }
    setShowReplies(!showReplies);
  };

  const handleAddReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      const res = await api.post(`/posts/${post.id}/replies`, { content: replyText });
      setReplies([...replies, res.data]);
      setReplyText('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-200">@{post.user?.name || 'Anonymous'}</span>
        <span className="text-xs text-slate-500">{post.created_at || 'Just now'}</span>
      </div>

      <p className="text-slate-300 text-sm leading-relaxed">{post.content}</p>

      <div className="flex items-center gap-6 border-t border-slate-700/40 pt-3 text-xs text-slate-400">
        <button 
          onClick={handleLikeToggle} 
          className={`flex items-center gap-1.5 hover:text-red-400 ${liked ? 'text-red-500 font-semibold' : ''}`}>
          <span>♥</span> {likesCount}
        </button>

        <button onClick={handleRepost} className="hover:text-indigo-400 flex items-center gap-1">
          <span>🔁</span> Repost
        </button>

        <button onClick={toggleReplies} className="hover:text-slate-200">
          💬 Replies ({post.replies_count || replies.length})
        </button>
      </div>

      {showReplies && (
        <div className="mt-3 pt-3 border-t border-slate-700/30 flex flex-col gap-3 pl-4 border-l-2 border-slate-700">
          <form onSubmit={handleAddReply} className="flex gap-2">
            <input
              type="text"
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button type="submit" className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-lg text-xs font-medium">
              Reply
            </button>
          </form>

          <div className="flex flex-col gap-2">
            {replies.map((reply) => (
              <div key={reply.id} className="bg-slate-900/60 rounded-lg p-2.5 text-xs">
                <span className="font-semibold text-slate-400">@{reply.user?.name}: </span>
                <span className="text-slate-300">{reply.content}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}