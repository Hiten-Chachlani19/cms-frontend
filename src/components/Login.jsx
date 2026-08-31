
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


export default function Login({ onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage('');
  setIsSubmitting(true);

  try {
    await login({ email, password });

    // Successful login → Landing Page
    navigate('/', { replace: true });

  } catch (err) {
    console.error('Login Error:', err);

    if (err.response?.status === 401) {
      setErrorMessage('Invalid Email or Password.');
    } else if (err.response?.data?.message) {
      setErrorMessage(err.response.data.message);
    } else {
      setErrorMessage('Server error! Check if backend is running.');
    }
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070b12] text-white">

      {/* =========================
          BACKGROUND
      ========================== */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-blue-600/[0.08] blur-[140px]" />

        <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-indigo-600/[0.07] blur-[140px]" />

        <div className="absolute left-[45%] top-[25%] h-[300px] w-[300px] rounded-full bg-violet-600/[0.04] blur-[120px]" />
      </div>

      {/* =========================
          NAV / LOGO
      ========================== */}
      <header className="relative z-10 mx-auto flex h-20 max-w-7xl items-center px-5 sm:px-8">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 text-lg font-black shadow-lg shadow-blue-500/20">
            ⚡
          </div>

          <div className="leading-none">
            <div className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-xl font-black tracking-tight text-transparent">
              DevPulse
            </div>

            <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
              Developer Feed
            </div>
          </div>

        </div>
      </header>

      {/* =========================
          MAIN
      ========================== */}
      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-5 py-10 sm:px-8">

        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* =========================
              LEFT — BRANDING
          ========================== */}
          <section className="hidden lg:block">

            <div className="max-w-xl">

              {/* Badge */}
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-blue-400">

                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-50" />
                  <span className="relative h-2 w-2 rounded-full bg-blue-400" />
                </span>

                Developer Community

              </div>

              {/* Heading */}
              <h1 className="text-5xl font-black leading-[1.08] tracking-tight xl:text-6xl">

                Your ideas.

                <br />

                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  Your community.
                </span>

              </h1>

              {/* Description */}
              <p className="mt-7 max-w-lg text-base leading-7 text-slate-400">
                Join developers sharing ideas, discussing technology,
                discovering trends, and building the future together.
              </p>

              {/* Feature Cards */}
              <div className="mt-10 grid max-w-lg grid-cols-2 gap-3">

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 backdrop-blur-xl">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-lg">
                    💡
                  </div>

                  <p className="text-xs font-bold text-slate-200">
                    Share Ideas
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-slate-600">
                    Post your thoughts and technical discoveries.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 backdrop-blur-xl">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-lg">
                    ⚡
                  </div>

                  <p className="text-xs font-bold text-slate-200">
                    Stay Connected
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-slate-600">
                    Follow discussions happening in the community.
                  </p>
                </div>

              </div>

              {/* Quote */}
              <div className="mt-8 border-l-2 border-blue-500/30 pl-4">
                <p className="text-xs italic leading-5 text-slate-600">
                  "Great software starts with great conversations."
                </p>
              </div>

            </div>
          </section>

          {/* =========================
              RIGHT — LOGIN CARD
          ========================== */}
          <section className="flex justify-center lg:justify-end">

            <div className="w-full max-w-md">

              <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-slate-900/75 p-7 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-8">

                {/* Card Glow */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-500/[0.07] blur-3xl" />

                <div className="relative">

                  {/* Mobile Logo */}
                  <div className="mb-7 flex items-center gap-3 lg:hidden">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                      ⚡
                    </div>

                    <div>
                      <div className="text-lg font-black">
                        DevPulse
                      </div>

                      <div className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
                        Developer Feed
                      </div>
                    </div>

                  </div>

                  {/* Header */}
                  <div className="mb-7">

                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/[0.08] text-lg">
                      👋
                    </div>

                    <h2 className="text-2xl font-black tracking-tight text-white">
                      Welcome back
                    </h2>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Sign in to continue your developer journey.
                    </p>

                  </div>

                  {/* Error */}
                  {errorMessage && (
                    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.07] p-3.5">

                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-xs">
                        !
                      </div>

                      <p className="pt-0.5 text-xs font-medium leading-5 text-red-400">
                        {errorMessage}
                      </p>

                    </div>
                  )}

                  {/* Form */}
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >

                    {/* Email */}
                    <div>

                      <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Email Address
                      </label>

                      <div className="group relative">

                        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-600 transition group-focus-within:text-blue-400">
                          @
                        </div>

                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full rounded-xl border border-white/[0.07] bg-black/20 py-3.5 pl-11 pr-4 text-sm text-slate-200 outline-none placeholder:text-slate-700 transition focus:border-blue-500/50 focus:bg-black/30 focus:ring-4 focus:ring-blue-500/[0.05]"
                          required
                        />

                      </div>

                    </div>

                    {/* Password */}
                    <div>

                      <div className="mb-2 flex items-center justify-between">

                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Password
                        </label>

                      </div>

                      <div className="group relative">

                        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-600 transition group-focus-within:text-blue-400">
                          •••
                        </div>

                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full rounded-xl border border-white/[0.07] bg-black/20 py-3.5 pl-11 pr-4 text-sm text-slate-200 outline-none placeholder:text-slate-700 transition focus:border-blue-500/50 focus:bg-black/30 focus:ring-4 focus:ring-blue-500/[0.05]"
                          required
                        />

                      </div>

                    </div>

                    {/* Login */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative mt-2 flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-600 py-3.5 text-xs font-black text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:from-blue-500 hover:via-indigo-500 hover:to-indigo-500 hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                    >

                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                      <span className="relative flex items-center gap-2">

                        {isSubmitting ? (
                          <>
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Logging in...
                          </>
                        ) : (
                          <>
                            Login
                            <span className="text-sm transition-transform group-hover:translate-x-1">
                              →
                            </span>
                          </>
                        )}

                      </span>

                    </button>

                  </form>

                  {/* Divider */}
                  <div className="my-7 flex items-center gap-3">

                    <div className="h-px flex-1 bg-white/[0.06]" />

                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-700">
                      New here?
                    </span>

                    <div className="h-px flex-1 bg-white/[0.06]" />

                  </div>

                  {/* Register */}
                  <div className="text-center">

                    <p className="text-xs text-slate-600">
                      Don't have a DevPulse account?
                    </p>

                    <button
                      onClick={onSwitchToRegister}
                      className="mt-2 rounded-lg px-3 py-1.5 text-xs font-bold text-blue-400 transition hover:bg-blue-500/[0.07] hover:text-blue-300"
                    >
                      Create an account →
                    </button>

                  </div>

                  {/* Bottom Note */}
                  <div className="mt-7 border-t border-white/[0.05] pt-5 text-center">
                    <p className="text-[9px] leading-4 text-slate-700">
                      By continuing, you're joining a community built
                      for developers and technology enthusiasts.
                    </p>
                  </div>

                </div>

              </div>

              {/* Footer */}
              <p className="mt-5 text-center text-[9px] font-medium uppercase tracking-widest text-slate-700">
                DevPulse · Developer Community
              </p>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}
