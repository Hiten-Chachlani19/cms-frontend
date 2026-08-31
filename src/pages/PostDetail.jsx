
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');

  const [postingReply, setPostingReply] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [repostLoading, setRepostLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState('');

  const [error, setError] = useState('');

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError('');

      const postResponse = await api.get(`/posts/${id}`);

      const fetchedPost =
        postResponse.data?.data || postResponse.data;

      setPost(fetchedPost);
      setEditBody(fetchedPost?.body || '');

      try {
        const repliesResponse = await api.get(
          `/posts/${id}/replies`
        );

        const fetchedReplies =
          repliesResponse.data?.data ||
          repliesResponse.data ||
          [];

        setReplies(
          Array.isArray(fetchedReplies)
            ? fetchedReplies
            : []
        );
      } catch (replyError) {
        console.error(
          'Failed to load replies:',
          replyError
        );

        setReplies(
          fetchedPost?.replies ||
            fetchedPost?.comments ||
            []
        );
      }
    } catch (err) {
      console.error('Failed to load post:', err);
      setError(
        err.response?.data?.message ||
          'Unable to load this post.'
      );
    } finally {
      setLoading(false);
    }
  };

  const isLiked =
    Boolean(post?.liked) ||
    Boolean(post?.is_liked);

  const isReposted =
    Boolean(post?.reposted) ||
    Boolean(post?.is_reposted);

  const authorHandle =
    post?.author?.handle ||
    post?.user?.handle ||
    'developer';

  const authorName =
    post?.author?.display_name ||
    post?.user?.display_name ||
    authorHandle;

  const authorInitial =
    authorHandle.charAt(0).toUpperCase();

  const currentUserId = String(user?.id || '');

  const postAuthorId = String(
    post?.user_id ||
      post?.author_id ||
      post?.author?.id ||
      post?.user?.id ||
      ''
  );

  const isOwner =
    currentUserId &&
    postAuthorId &&
    currentUserId === postAuthorId;

  const formatDate = (date) => {
    if (!date) return '';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return '';
    }

    return parsedDate.toLocaleString([], {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (likeLoading || !post) return;

    const previousLiked = isLiked;
    const previousCount = Number(post.like_count || 0);

    setLikeLoading(true);

    setPost((previous) => ({
      ...previous,
      liked: !previousLiked,
      is_liked: !previousLiked,
      like_count: previousLiked
        ? Math.max(0, previousCount - 1)
        : previousCount + 1,
    }));

    try {
      if (previousLiked) {
        await api.delete(`/posts/${id}/likes`);
      } else {
        await api.post(`/posts/${id}/likes`);
      }
    } catch (err) {
      console.error('Like failed:', err);

      setPost((previous) => ({
        ...previous,
        liked: previousLiked,
        is_liked: previousLiked,
        like_count: previousCount,
      }));
    } finally {
      setLikeLoading(false);
    }
  };

  const handleRepost = async () => {
  if (!user) {
    navigate('/login');
    return;
  }

  if (repostLoading || !post) return;

  const previousReposted = isReposted;
  const previousCount = Number(post.repost_count || 0);

  setRepostLoading(true);

  try {
    const response = await api.post(`/posts/${id}/repost`);

    console.log('REPOST SUCCESS:', response.data);

    setPost((previous) => ({
      ...previous,
      reposted: !previousReposted,
      is_reposted: !previousReposted,
      repost_count: previousReposted
        ? Math.max(0, previousCount - 1)
        : previousCount + 1,
    }));
  } catch (err) {
    console.error('REPOST ERROR:', err);

    console.log('STATUS:', err.response?.status);
    console.log('DATA:', err.response?.data);

    alert(
      err.response?.data?.message ||
      err.response?.data?.error ||
      'Repost failed. Check backend logs.'
    );
  } finally {
    setRepostLoading(false);
  }
};

  const handleReply = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    if (!replyText.trim() || postingReply) {
      return;
    }

    try {
      setPostingReply(true);

      const response = await api.post(
        `/posts/${id}/replies`,
        {
          body: replyText.trim(),
        }
      );

      const newReply =
        response.data?.data ||
        response.data;

      if (newReply) {
        setReplies((previous) => [
          newReply,
          ...previous,
        ]);
      }

      setReplyText('');

      setPost((previous) => ({
        ...previous,
        reply_count:
          Number(previous.reply_count || 0) + 1,
      }));
    } catch (err) {
      console.error('Reply failed:', err);

      alert(
        err.response?.data?.message ||
          'Failed to post reply.'
      );
    } finally {
      setPostingReply(false);
    }
  };

  const handleUpdate = async () => {
    if (!editBody.trim()) {
      alert('Post cannot be empty.');
      return;
    }

    try {
      setActionLoading(true);

      const response = await api.patch(
        `/posts/${id}`,
        {
          body: editBody.trim(),
        }
      );

      const updatedPost =
        response.data?.data ||
        response.data;

      setPost((previous) => ({
        ...previous,
        ...(updatedPost || {}),
        body: editBody.trim(),
      }));

      setIsEditing(false);
    } catch (err) {
      console.error('Update failed:', err);

      alert(
        err.response?.data?.message ||
          'Failed to update post.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this post?'
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      await api.delete(`/posts/${id}`);

      navigate('/dashboard');
    } catch (err) {
      console.error('Delete failed:', err);

      alert(
        err.response?.data?.message ||
          'Failed to delete post.'
      );

      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090d] text-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 rounded-full border-2 border-slate-800 border-t-blue-500 animate-spin" />

          <p className="text-sm font-semibold text-slate-400">
            Loading discussion...
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Fetching post details
          </p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#07090d] text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/[0.07] bg-[#0c1017] p-7 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-2xl">
            !
          </div>

          <h1 className="mt-5 text-xl font-black">
            Post unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error ||
              'This post may have been deleted or does not exist.'}
          </p>

          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
          >
            Back to Dashboard
          </button>

          <button
            onClick={() => navigate('/')}
            className="mt-2 w-full rounded-xl border border-white/[0.07] px-5 py-3 text-sm font-semibold text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090d] text-slate-100">

      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/[0.035] blur-3xl" />
      </div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#07090d]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">

          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-white/[0.04] hover:text-white"
          >
            <span className="text-base transition-transform group-hover:-translate-x-1">
              ←
            </span>

            <span className="hidden sm:inline">
              Back
            </span>
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-black shadow-lg shadow-blue-600/20">
              ⚡
            </div>

            <span className="hidden text-sm font-black tracking-tight text-white sm:block">
              DevPulse
            </span>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="rounded-xl border border-white/[0.06] px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-white/[0.04] hover:text-white"
          >
            Dashboard
          </button>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-10">

        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-2 text-[10px] font-semibold text-slate-600">
          <button
            onClick={() => navigate('/')}
            className="hover:text-blue-400"
          >
            Home
          </button>

          <span>/</span>

          <span className="text-slate-500">
            Discussion
          </span>

          <span>/</span>

          <span className="font-mono">
            #{post.id}
          </span>
        </div>

        {/* Main Post */}
        <article className="overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0c1017] shadow-2xl shadow-black/20">

          {/* Accent */}
          <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

          <div className="p-5 sm:p-7 md:p-9">

            {/* Author */}
            <div className="flex items-start justify-between gap-4">

              <div className="flex min-w-0 items-center gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-black text-white shadow-lg shadow-blue-600/10">
                  {authorInitial}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-black text-white">
                      {authorName}
                    </span>

                    {isOwner && (
                      <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[9px] font-bold text-blue-400">
                        YOU
                      </span>
                    )}
                  </div>

                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    @{authorHandle}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-[10px] font-medium text-slate-600">
                  {formatDate(post.created_at)}
                </p>

                <p className="mt-1 font-mono text-[9px] text-slate-700">
                  POST #{post.id}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="mt-8">

              {isEditing ? (
                <div>
                  <textarea
                    value={editBody}
                    onChange={(e) =>
                      setEditBody(e.target.value)
                    }
                    autoFocus
                    className="min-h-[180px] w-full resize-y rounded-2xl border border-blue-500/30 bg-[#07090d] p-5 text-sm leading-7 text-slate-200 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    placeholder="Write your post..."
                  />

                  <div className="mt-3 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditBody(post.body || '');
                      }}
                      disabled={actionLoading}
                      className="rounded-xl border border-white/[0.07] px-4 py-2.5 text-xs font-bold text-slate-400 transition hover:bg-white/[0.04] hover:text-white disabled:opacity-40"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleUpdate}
                      disabled={
                        actionLoading ||
                        !editBody.trim()
                      }
                      className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-500 disabled:opacity-40"
                    >
                      {actionLoading
                        ? 'Saving...'
                        : 'Save Changes'}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-line break-words text-[15px] leading-7 text-slate-300 sm:text-base sm:leading-8">
                  {post.body ||
                    'No text content available.'}
                </p>
              )}
            </div>

            {/* Owner Actions */}
            {isOwner && !isEditing && (
              <div className="mt-7 flex flex-wrap gap-2 border-t border-white/[0.05] pt-5">
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-2.5 text-xs font-bold text-slate-400 transition hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-white"
                >
                  ✎ Edit Post
                </button>

                <button
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="rounded-xl border border-red-500/10 bg-red-500/[0.04] px-4 py-2.5 text-xs font-bold text-red-400 transition hover:bg-red-500/10 disabled:opacity-40"
                >
                  {actionLoading
                    ? 'Deleting...'
                    : 'Delete Post'}
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#07090d]">

              <div className="border-r border-white/[0.05] p-4 text-center">
                <p className="text-lg font-black text-white">
                  {post.like_count || 0}
                </p>

                <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-600">
                  Likes
                </p>
              </div>

              <div className="border-r border-white/[0.05] p-4 text-center">
                <p className="text-lg font-black text-white">
                  {post.reply_count ||
                    replies.length ||
                    0}
                </p>

                <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-600">
                  Replies
                </p>
              </div>

              <div className="p-4 text-center">
                <p className="text-lg font-black text-white">
                  {post.repost_count || 0}
                </p>

                <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-600">
                  Reposts
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-wrap gap-2">

              <button
                onClick={handleLike}
                disabled={likeLoading}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold transition sm:flex-none ${
                  isLiked
                    ? 'border-red-500/20 bg-red-500/10 text-red-400'
                    : 'border-white/[0.06] bg-white/[0.02] text-slate-500 hover:border-red-500/20 hover:bg-red-500/[0.06] hover:text-red-400'
                }`}
              >
                <span className="text-base">
                  {isLiked ? '♥' : '♡'}
                </span>

                {isLiked ? 'Liked' : 'Like'}
              </button>

              <button
                onClick={handleRepost}
                disabled={repostLoading}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold transition sm:flex-none ${
                  isReposted
                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                    : 'border-white/[0.06] bg-white/[0.02] text-slate-500 hover:border-emerald-500/20 hover:bg-emerald-500/[0.06] hover:text-emerald-400'
                }`}
              >
                <span className="text-base">
                  ↻
                </span>

                {isReposted
                  ? 'Reposted'
                  : 'Repost'}
              </button>

              <button
                onClick={() => {
                  document
                    .getElementById('reply-box')
                    ?.focus();
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-xs font-bold text-slate-500 transition hover:bg-white/[0.05] hover:text-white sm:flex-none"
              >
                <span className="text-base">
                  💬
                </span>

                Reply
              </button>
            </div>
          </div>
        </article>

        {/* Discussion */}
        <section className="mt-7">

          {/* Section Heading */}
          <div className="mb-4 flex items-center justify-between">

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">
                Community
              </p>

              <h2 className="mt-1 text-xl font-black text-white">
                Discussion
              </h2>
            </div>

            <div className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[10px] font-bold text-slate-500">
              {replies.length} replies
            </div>
          </div>

          {/* Reply Composer */}
          <form
            onSubmit={handleReply}
            className="rounded-2xl border border-white/[0.07] bg-[#0c1017] p-4 shadow-xl sm:p-5"
          >

            <div className="flex gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-[10px] font-black">
                {(user?.handle || 'U')
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">

                <textarea
                  id="reply-box"
                  value={replyText}
                  onChange={(e) =>
                    setReplyText(e.target.value)
                  }
                  placeholder={
                    user
                      ? 'Share your thoughts...'
                      : 'Sign in to join the discussion...'
                  }
                  onClick={() => {
                    if (!user) {
                      navigate('/login');
                    }
                  }}
                  className="min-h-[90px] w-full resize-none bg-transparent text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-700"
                />

                <div className="mt-3 flex flex-col gap-3 border-t border-white/[0.05] pt-3 sm:flex-row sm:items-center sm:justify-between">

                  <span className="text-[10px] text-slate-700">
                    Be respectful and constructive.
                  </span>

                  <button
                    type="submit"
                    disabled={
                      postingReply ||
                      !replyText.trim()
                    }
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    {postingReply
                      ? 'Posting...'
                      : 'Post Reply'}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Replies */}
          <div className="mt-5 space-y-3">

            {replies.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/[0.07] bg-white/[0.015] px-5 py-12 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.03] text-xl">
                  💬
                </div>

                <h3 className="mt-4 text-sm font-bold text-slate-400">
                  No replies yet
                </h3>

                <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-slate-700">
                  Start the conversation and be the
                  first developer to reply.
                </p>
              </div>
            ) : (
              replies.map((reply) => {

                const replyHandle =
                  reply.author?.handle ||
                  reply.user?.handle ||
                  'developer';

                const replyName =
                  reply.author?.display_name ||
                  reply.user?.display_name ||
                  replyHandle;

                const replyInitial =
                  replyHandle
                    .charAt(0)
                    .toUpperCase();

                return (
                  <article
                    key={reply.id}
                    className="rounded-2xl border border-white/[0.06] bg-[#0c1017] p-4 transition hover:border-white/[0.1] sm:p-5"
                  >

                    <div className="flex gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-[10px] font-black text-slate-300">
                        {replyInitial}
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="text-xs font-bold text-slate-300">
                            {replyName}
                          </span>

                          <span className="text-[10px] text-slate-700">
                            @{replyHandle}
                          </span>

                          <span className="text-[9px] text-slate-700">
                            •
                          </span>

                          <span className="text-[9px] text-slate-700">
                            {formatDate(
                              reply.created_at
                            )}
                          </span>
                        </div>

                        <p className="mt-3 whitespace-pre-line break-words text-sm leading-6 text-slate-400">
                          {reply.body ||
                            'No content available.'}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

        {/* Bottom Navigation */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/[0.05] py-7 text-center sm:flex-row sm:text-left">

          <div>
            <p className="text-xs font-bold text-slate-500">
              Enjoying the discussion?
            </p>

            <p className="mt-1 text-[10px] text-slate-700">
              Explore more developer conversations on DevPulse.
            </p>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-5 py-2.5 text-xs font-bold text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
          >
            Explore Posts →
          </button>
        </div>

      </main>
    </div>
  );
}
