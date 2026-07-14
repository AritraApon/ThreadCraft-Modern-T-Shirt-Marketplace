'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import { toast } from 'react-toastify';
import { Eye, EyeOff, Loader2, Shirt, User, ShieldCheck } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();

  // States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle Form Submit
  const handleLogin = async (e: FormEvent, demoEmail?: string, demoPassword?: string) => {
    if (e) e.preventDefault();

    // ডেমো বাটনের ডেটা থাকলে সেগুলো ব্যবহার করবে, না থাকলে স্টেট থেকে নেবে
    const targetEmail = demoEmail || email;
    const targetPassword = demoPassword || password;

    if (!targetEmail || !targetPassword) {
      toast.error("Please fill all fields!");
      return;
    }

    setIsLoading(true);

    try {
      // Better Auth Sign In
      await authClient.signIn.email({
        email: targetEmail,
        password: targetPassword,
        callbackURL: "/",
        rememberMe: rememberMe
      }, {
        onRequest: () => setIsLoading(true),
        onSuccess: () => {
          setIsLoading(false);
          toast.success("Welcome back to ThreadCraft!");
          router.push('/');
        },
        onError: (ctx) => {
          setIsLoading(false);
          toast.error(ctx.error.message || "Invalid email or password!");
        }
      });

    } catch (err) {
      setIsLoading(false);
      toast.error("An unexpected error occurred.");
    }
  };

  // ডেমো বাটনের ক্লিকের সাথে সাথে স্টেট আপডেট এবং লগইন কল হবে
  const handleDemoLogin = async (role: 'seller' | 'buyer') => {
    const demoEmail = role === 'seller' ? 'seller' : 'buyer@buyer.com';
    const demoPassword = role === 'seller' ? '404' : 'Buyer123';

    setEmail(demoEmail);
    setPassword(demoPassword);

    // অটো লগইন ট্রিগার করা হলো
    await handleLogin(null as any, demoEmail, demoPassword);
  };

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/"
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-[#161F30] border border-gray-100 dark:border-gray-800/80 shadow-xl rounded-2xl p-6 sm:p-8 transition-colors duration-300">

      {/* Brand Logo & Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white mb-3 shadow-md">
          <Shirt size={24} />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome Back</h2>
        <p className="text-xs text-gray-400 mt-1">Sign in to your ThreadCraft account</p>
      </div>

      {/* 🎯 ডেমো ক্রেডেনশিয়ালস সেকশন (থিমের সাথে একদম পারফেক্টলি ম্যাচড) */}
      <div className="mb-6 p-3.5 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
        <p className="text-[10px] font-bold uppercase tracking-wider text-center text-gray-400 dark:text-gray-500 mb-2.5">
          Quick Demo Login
        </p>
        <div className="flex justify-center items-center">
          {/* Buyer Demo Button */}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleDemoLogin('buyer')}
            className="flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold rounded-lg border border-amber-500/20 dark:border-amber-500/10 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 dark:hover:bg-amber-500/15 active:scale-95 transition-all"
          >
            <User size={13} />
            Demo Buyer
          </button>

          {/* Seller Demo Button */}
          {/* <button
            type="button"
            disabled={isLoading}
            onClick={() => handleDemoLogin('seller')}
            className="flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold rounded-lg border border-orange-500/20 dark:border-orange-500/10 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 dark:hover:bg-orange-500/15 active:scale-95 transition-all"
          >
            <ShieldCheck size={13} />
            Demo Seller
          </button>  */}
        </div>
      </div>

      <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Email Address</label>
          <input
            type="email" required placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 dark:focus:ring-amber-500/20 transition-all text-gray-900 dark:text-white"
          />
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 dark:focus:ring-amber-500/20 transition-all text-gray-900 dark:text-white"
            />
            <button
              type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-amber-500 focus:ring-amber-500/30 bg-transparent"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Remember me</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit" disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium text-sm rounded-lg shadow-sm focus:outline-none disabled:opacity-60 transition-all mt-2"
        >
          {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Sign In"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex py-4 items-center">
        <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
        <span className="flex-shrink mx-3 text-[10px] uppercase tracking-wider text-gray-400">Or continue with</span>
        <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
      </div>

      {/* Google SVG Button */}
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2.5 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-all mb-4"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.227C18.251 1.48 15.49 0 12.24 0 5.58 0 0 5.58 0 12.24s5.58 12.24 12.24 12.24c6.96 0 11.57-4.894 11.57-11.77 0-.79-.085-1.39-.187-1.927H12.24z"/>
        </svg>
        Sign in with Google
      </button>

      {/* Register Page Redirect Path */}
      <p className="text-center text-xs text-gray-500 dark:text-gray-400">
        Don't have an account?{' '}
        <Link href="/register" className="font-semibold text-amber-500 hover:text-amber-600 transition-colors">
          Sign Up
        </Link>
      </p>

    </div>
  );
}