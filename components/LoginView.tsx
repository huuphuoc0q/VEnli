import React, { useState } from 'react';
import { LogIn, BookOpen, Sparkles, Loader2, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { signInWithGoogle, loginWithEmail, registerWithEmail } from '../services/firebaseService';

export const LoginView: React.FC = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    try {
      await signInWithGoogle();
      // App.tsx onAuthStateChanged will handle the redirect
    } catch (err: any) {
      let friendlyError = 'Có lỗi xảy ra khi đăng nhập bằng Google.';
      if (err.code === 'auth/popup-closed-by-user') {
        friendlyError = 'Cửa sổ đăng nhập đã bị đóng.';
      }
      setError(friendlyError);
      setIsLoggingIn(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    if (mode === 'register' && !displayName.trim()) {
      setError('Vui lòng điền tên hiển thị.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    setIsLoggingIn(true);
    setError(null);

    try {
      if (mode === 'login') {
        await loginWithEmail(email.trim(), password);
      } else {
        await registerWithEmail(email.trim(), password, displayName.trim());
      }
    } catch (err: any) {
      let friendlyError = 'Có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.';
      if (err.code === 'auth/email-already-in-use') {
        friendlyError = 'Email này đã được sử dụng bởi một tài khoản khác.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyError = 'Địa chỉ email không hợp lệ.';
      } else if (err.code === 'auth/weak-password') {
        friendlyError = 'Mật khẩu quá yếu.';
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        friendlyError = 'Email hoặc mật khẩu không chính xác.';
      }
      setError(friendlyError);
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 transition-colors duration-300">
      
      {/* Decorative background blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl"></div>
        <div className="absolute top-[60%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20 mb-4 animate-bounce-short">
            <BookOpen size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">VocabFlow</h1>
          <p className="text-slate-550 dark:text-slate-400 font-medium text-sm">Học từ vựng thông minh, không lo gián đoạn.</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-800 transition-colors duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          
          <h2 className="text-xl font-black text-slate-800 dark:text-white mb-1">
            {mode === 'login' ? 'Chào mừng quay lại' : 'Tạo tài khoản mới'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            {mode === 'login' 
              ? 'Đăng nhập để tiếp tục đồng bộ dữ liệu học tập của bạn.' 
              : 'Đăng ký để đồng bộ dữ liệu lên đám mây cá nhân.'}
          </p>

          <form onSubmit={handleEmailSubmit} className="space-y-4 mb-5">
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">Tên hiển thị</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-400"><UserIcon size={16} /></span>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Tên của bạn..."
                    className="w-full text-xs p-3 pl-10 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/20 dark:text-white rounded-xl outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-semibold"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">Địa chỉ Email</label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400"><Mail size={16} /></span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@domain.com"
                  className="w-full text-xs p-3 pl-10 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/20 dark:text-white rounded-xl outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-semibold"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">Mật khẩu</label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400"><Lock size={16} /></span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs p-3 pl-10 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/20 dark:text-white rounded-xl outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-semibold"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-indigo-650 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition-all duration-300 active:scale-95 shadow-md shadow-indigo-500/10 text-xs disabled:opacity-50"
            >
              {isLoggingIn ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-150 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Hoặc</span>
            <div className="flex-grow border-t border-slate-150 dark:border-slate-800"></div>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-bold text-slate-700 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 active:scale-95 text-xs mt-3 ${
              isLoggingIn ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            <span>Tiếp tục với Google</span>
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-650 dark:text-red-400 font-bold animate-pulse">
              {error}
            </div>
          )}

          {/* Toggle login mode */}
          <div className="mt-6 text-center text-xs">
            <span className="text-slate-450 dark:text-slate-500 font-semibold">
              {mode === 'login' ? 'Bạn chưa có tài khoản?' : 'Đã có tài khoản rồi?'}
            </span>
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }}
              className="ml-1 text-indigo-600 dark:text-indigo-400 hover:underline font-extrabold"
            >
              {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập tại đây'}
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-850 text-center">
            <div className="inline-flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
              <Sparkles size={11} />
              <span>Bảo mật bởi Firebase Authentication</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
