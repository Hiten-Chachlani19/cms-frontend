import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: '✍️',
      title: 'Create & Publish',
      description:
        'Create articles and publish content through a simple and intuitive interface.',
    },
    {
      icon: '🗂️',
      title: 'Content Management',
      description:
        'Organize, manage, edit and maintain all your content from one centralized dashboard.',
    },
    {
      icon: '💬',
      title: 'Community Discussions',
      description:
        'Allow users to reply, discuss and interact with published content.',
    },
    {
      icon: '❤️',
      title: 'Likes & Reposts',
      description:
        'Engage with content through likes and reposts while tracking interaction counts.',
    },
    {
      icon: '📊',
      title: 'Analytics',
      description:
        'Understand your content performance with useful engagement and activity insights.',
    },
    {
      icon: '🔐',
      title: 'Role-Based Access',
      description:
        'Control what users can do with dedicated Admin, Author and Viewer permissions.',
    },
  ];

  const roles = [
    {
      role: 'Admin',
      icon: '🛡️',
      description:
        'Manage users, content and the overall CMS environment.',
      points: [
        'Manage users',
        'Manage published content',
        'Monitor platform activity',
        'Access analytics',
      ],
    },
    {
      role: 'Author',
      icon: '✍️',
      description:
        'Create and manage your own content and participate in discussions.',
      points: [
        'Create posts',
        'Edit own posts',
        'Delete own posts',
        'Interact with content',
      ],
    },
    {
      role: 'Viewer',
      icon: '👁️',
      description:
        'Explore published content and participate in the community.',
      points: [
        'Browse content',
        'Read articles',
        'Like posts',
        'Reply to discussions',
      ],
    },
  ];

  const workflow = [
    {
      number: '01',
      title: 'Create',
      text: 'Authors create meaningful content using the CMS.',
    },
    {
      number: '02',
      title: 'Manage',
      text: 'Content can be edited, organized and maintained easily.',
    },
    {
      number: '03',
      title: 'Publish',
      text: 'Published content becomes available to the community.',
    },
    {
      number: '04',
      title: 'Engage',
      text: 'Users can like, repost and discuss published content.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070a0f] text-white overflow-x-hidden">

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#070a0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}

          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-black shadow-lg shadow-blue-600/20">
              DP
            </div>

            <div>
              <div className="text-base font-black tracking-tight">
                DevPulse
              </div>

              <div className="hidden text-[8px] font-bold uppercase tracking-[0.2em] text-slate-600 sm:block">
                Content Management System
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-xs font-medium text-slate-400 transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#roles"
              className="text-xs font-medium text-slate-400 transition hover:text-white"
            >
              Roles
            </a>

            <a
              href="#workflow"
              className="text-xs font-medium text-slate-400 transition hover:text-white"
            >
              How it works
            </a>

            <a
              href="#about"
              className="text-xs font-medium text-slate-400 transition hover:text-white"
            >
              About
            </a>
          </nav>

          {/* Right */}

          <div className="flex items-center gap-2">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-500"
              >
                Dashboard →
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 transition hover:bg-white/[0.04] hover:text-white sm:block"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-black transition hover:bg-slate-200"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>


      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32">

        {/* Background Effects */}

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[130px]" />

          <div className="absolute left-[10%] top-[40%] h-64 w-64 rounded-full bg-indigo-600/5 blur-[100px]" />

          <div className="absolute right-[10%] top-[20%] h-72 w-72 rounded-full bg-purple-600/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">

          {/* Badge */}

          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.07] px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />

            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300">
              Modern Content Management System
            </span>
          </div>

          {/* Heading */}

          <h1 className="mx-auto max-w-5xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Create.
            <span className="text-blue-500"> Manage.</span>
            <br />
            Share your content.
          </h1>

          {/* Description */}

          <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
            DevPulse is a modern Content Management System designed to make
            creating, managing and engaging with digital content simple,
            organized and collaborative.
          </p>

          {/* CTA */}

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to={user ? '/dashboard' : '/register'}
              className="rounded-xl bg-blue-600 px-7 py-3.5 text-xs font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500"
            >
              {user ? 'Open Dashboard →' : 'Start Managing Content →'}
            </Link>

            <a
              href="#features"
              className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-7 py-3.5 text-xs font-bold text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
            >
              Explore Features
            </a>

          </div>

          {/* Small stats */}

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-3 divide-x divide-white/[0.07] border-y border-white/[0.06] py-6">

            <div>
              <p className="text-xl font-black text-white sm:text-2xl">
                3
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-widest text-slate-600">
                User Roles
              </p>
            </div>

            <div>
              <p className="text-xl font-black text-white sm:text-2xl">
                6+
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-widest text-slate-600">
                Core Features
              </p>
            </div>

            <div>
              <p className="text-xl font-black text-white sm:text-2xl">
                100%
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-widest text-slate-600">
                Responsive
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* =====================================================
          WHAT IS DEVPULSE
      ====================================================== */}

      <section
        id="about"
        className="border-y border-white/[0.06] bg-white/[0.015] py-20 sm:py-24"
      >

        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">

          {/* Text */}

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
              What is DevPulse?
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              One platform for your entire content lifecycle.
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-500">
              DevPulse brings content creation, management, publishing and
              community interaction together in one centralized platform.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-500">
              Instead of managing content across multiple disconnected tools,
              users can create posts, manage existing content, interact with
              the community and monitor activity directly from the CMS.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {[
                'Content Creation',
                'Content Management',
                'User Management',
                'Analytics',
                'Community',
                'Authentication',
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-[10px] font-semibold text-slate-400"
                >
                  ✓ {item}
                </span>
              ))}
            </div>

          </div>


          {/* Visual Dashboard Mockup */}

          <div className="relative">

            <div className="absolute -inset-4 rounded-3xl bg-blue-500/5 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1119] shadow-2xl">

              {/* Fake browser top */}

              <div className="flex h-10 items-center gap-1.5 border-b border-white/[0.06] px-4">

                <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/60" />

                <div className="ml-4 h-5 flex-1 rounded bg-white/[0.025]" />

              </div>

              <div className="grid grid-cols-[90px_1fr] sm:grid-cols-[130px_1fr]">

                {/* Sidebar */}

                <div className="border-r border-white/[0.06] p-3">

                  <div className="mb-5 h-7 rounded-lg bg-blue-600/20" />

                  {[
                    'Dashboard',
                    'Content',
                    'Analytics',
                    'Settings',
                  ].map((item, index) => (
                    <div
                      key={item}
                      className={`mb-2 rounded-lg px-2 py-2 text-[8px] ${
                        index === 0
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'text-slate-700'
                      }`}
                    >
                      {item}
                    </div>
                  ))}

                </div>

                {/* Main */}

                <div className="p-4 sm:p-6">

                  <div className="mb-5">
                    <div className="h-3 w-24 rounded bg-white/10" />
                    <div className="mt-2 h-2 w-40 rounded bg-white/[0.04]" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">

                    {[
                      ['Total Posts', '248'],
                      ['Engagement', '8.4K'],
                      ['Authors', '42'],
                      ['Replies', '1.2K'],
                    ].map(([title, value]) => (
                      <div
                        key={title}
                        className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3"
                      >
                        <p className="text-[8px] text-slate-600">
                          {title}
                        </p>

                        <p className="mt-2 text-lg font-black text-white">
                          {value}
                        </p>

                        <div className="mt-2 h-1 rounded-full bg-blue-500/20">
                          <div className="h-1 w-2/3 rounded-full bg-blue-500" />
                        </div>
                      </div>
                    ))}

                  </div>

                  <div className="mt-4 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">

                    <div className="flex items-center justify-between">
                      <div className="h-2 w-20 rounded bg-white/10" />
                      <div className="h-2 w-12 rounded bg-white/[0.04]" />
                    </div>

                    <div className="mt-5 flex h-24 items-end gap-2">

                      {[35, 55, 42, 75, 58, 85, 70, 95, 78, 88].map(
                        (height, index) => (
                          <div
                            key={index}
                            className="flex-1 rounded-t bg-blue-500/30"
                            style={{ height: `${height}%` }}
                          />
                        )
                      )}

                    </div>

                  </div>

                </div>

              </div>
            </div>
          </div>

        </div>
      </section>


      {/* =====================================================
          FEATURES
      ====================================================== */}

      <section id="features" className="py-20 sm:py-28">

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          <div className="max-w-2xl">

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
              Features
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Everything you need to manage content.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500">
              Built around the complete content management workflow — from
              creation to community engagement.
            </p>

          </div>


          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {features.map((feature) => (

              <div
                key={feature.title}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500/20 hover:bg-white/[0.035]"
              >

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.035] text-lg transition group-hover:border-blue-500/20 group-hover:bg-blue-500/10">
                  {feature.icon}
                </div>

                <h3 className="mt-5 text-sm font-bold text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 text-xs leading-6 text-slate-500">
                  {feature.description}
                </p>

              </div>

            ))}

          </div>

        </div>
      </section>


      {/* =====================================================
          ROLES
      ====================================================== */}

      <section
        id="roles"
        className="border-y border-white/[0.06] bg-white/[0.015] py-20 sm:py-28"
      >

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          <div className="text-center">

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
              Role Based Access
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Everyone gets the right level of access.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500">
              DevPulse separates responsibilities using role-based access
              control, keeping your content platform organized and secure.
            </p>

          </div>


          <div className="mt-12 grid gap-5 md:grid-cols-3">

            {roles.map((item, index) => (

              <div
                key={item.role}
                className={`rounded-2xl border p-6 ${
                  index === 1
                    ? 'border-blue-500/25 bg-blue-500/[0.04]'
                    : 'border-white/[0.06] bg-white/[0.02]'
                }`}
              >

                <div className="flex items-center justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] text-lg">
                    {item.icon}
                  </div>

                  <span className="rounded-full border border-white/[0.06] px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest text-slate-600">
                    Role {index + 1}
                  </span>

                </div>

                <h3 className="mt-6 text-lg font-black text-white">
                  {item.role}
                </h3>

                <p className="mt-3 text-xs leading-6 text-slate-500">
                  {item.description}
                </p>

                <div className="mt-6 space-y-3 border-t border-white/[0.06] pt-5">

                  {item.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-2 text-[10px] font-medium text-slate-400"
                    >
                      <span className="text-blue-400">✓</span>
                      {point}
                    </div>
                  ))}

                </div>

              </div>

            ))}

          </div>

        </div>
      </section>


      {/* =====================================================
          WORKFLOW
      ====================================================== */}

      <section id="workflow" className="py-20 sm:py-28">

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
                How it works
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                From idea to published content.
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-500">
                DevPulse simplifies the complete content lifecycle so users
                can focus on creating useful content instead of managing
                complicated workflows.
              </p>

              <Link
                to={user ? '/dashboard' : '/register'}
                className="mt-7 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white transition hover:bg-blue-500"
              >
                {user ? 'Go to Dashboard →' : 'Create Your Account →'}
              </Link>

            </div>


            <div className="space-y-3">

              {workflow.map((item) => (

                <div
                  key={item.number}
                  className="group flex gap-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition hover:border-blue-500/20 hover:bg-white/[0.035]"
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 font-mono text-[10px] font-bold text-blue-400">
                    {item.number}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {item.title}
                    </h3>

                    <p className="mt-1.5 text-xs leading-5 text-slate-500">
                      {item.text}
                    </p>
                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          SECURITY / BENEFITS
      ====================================================== */}

      <section className="border-y border-white/[0.06] bg-white/[0.015] py-20">

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-4 md:grid-cols-3">

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <div className="text-xl">🔐</div>
              <h3 className="mt-4 text-sm font-bold">
                Secure Authentication
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-500">
                Authenticated users receive access based on their assigned
                role and permissions.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <div className="text-xl">📱</div>
              <h3 className="mt-4 text-sm font-bold">
                Responsive Experience
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-500">
                The CMS interface is designed to work smoothly across
                desktop, tablet and mobile devices.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <div className="text-xl">⚡</div>
              <h3 className="mt-4 text-sm font-bold">
                Simple & Efficient
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-500">
                A clean interface keeps content management fast and easy to
                understand.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          CTA
      ====================================================== */}

      <section className="relative overflow-hidden py-24 sm:py-32">

        <div className="absolute inset-0 bg-blue-600/[0.035]" />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-lg font-black shadow-xl shadow-blue-600/20">
            DP
          </div>

          <h2 className="mt-7 text-3xl font-black tracking-tight sm:text-5xl">
            Ready to manage your content?
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500">
            Join DevPulse and get a centralized platform for creating,
            managing and engaging with digital content.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to={user ? '/dashboard' : '/register'}
              className="rounded-xl bg-blue-600 px-7 py-3.5 text-xs font-bold text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-500"
            >
              {user ? 'Open Dashboard →' : 'Get Started Free →'}
            </Link>

            {!user && (
              <Link
                to="/login"
                className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-7 py-3.5 text-xs font-bold text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
              >
                Already have an account?
              </Link>
            )}

          </div>

        </div>
      </section>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-white/[0.06]">

        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">

          <div className="flex items-center gap-3">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-[10px] font-black">
              DP
            </div>

            <div>
              <p className="text-xs font-bold text-white">
                DevPulse
              </p>

              <p className="text-[9px] text-slate-700">
                Content Management System
              </p>
            </div>

          </div>

          <p className="text-[9px] text-slate-700">
            © 2026 DevPulse. Built for modern content management.
          </p>

          <div className="flex gap-5">
            <a
              href="#features"
              className="text-[9px] font-semibold text-slate-600 hover:text-slate-300"
            >
              Features
            </a>

            <a
              href="#roles"
              className="text-[9px] font-semibold text-slate-600 hover:text-slate-300"
            >
              Roles
            </a>

            <a
              href="#workflow"
              className="text-[9px] font-semibold text-slate-600 hover:text-slate-300"
            >
              Workflow
            </a>
          </div>

        </div>

      </footer>

    </div>
  );
}