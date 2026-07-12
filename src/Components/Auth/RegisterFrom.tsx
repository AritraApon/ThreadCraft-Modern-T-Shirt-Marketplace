'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import { toast } from 'react-toastify';
import { Eye, EyeOff, Loader2, Shirt, Image as ImageIcon } from 'lucide-react';

export default function RegisterForm() {
  const router = useRouter();

  // States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ImgBB Image Upload Function
  const uploadImageToImgBB = async (file: File): Promise<string | null> => {
    const apiKey = process.env.NEXT_PUBLIC_NEXT_BASE_IMGBB_API;
    if (!apiKey) {
      console.error("ImgBB API key is missing!");
      return null;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.success) return result.data.url;
      return null;
    } catch (error) {
      console.error("ImgBB Upload Error:", error);
      return null;
    }
  };

  // Handle Form Submit
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill all fields!");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters!");
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        const uploadedUrl = await uploadImageToImgBB(imageFile);
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      // Better Auth SignUp (ডিফল্ট রোল buyer হিসেবে সেভ হবে)
      await authClient.signUp.email({
        email,
        password,
        name,
        image: imageUrl || undefined,
        // role: "buyer",
      }, {
        onRequest: () => setIsLoading(true),
        onSuccess: () => {
          setIsLoading(false);
          toast.success("Welcome to ThreadCraft!");
          router.push('/');
        },
        onError: (ctx) => {
          setIsLoading(false);
          toast.error(ctx.error.message || "Registration failed!");
        }
      });

    } catch (err) {
      setIsLoading(false);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/"
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-[#161F30] border  border-gray-100 dark:border-gray-800/80 shadow-xl rounded-2xl p-6 sm:p-8 transition-colors duration-300">

      {/* Brand Logo & Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white mb-3 shadow-md">
          <Shirt size={24} />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Create An Account</h2>
        <p className="text-xs text-gray-400 mt-1">Join ThreadCraft marketplace today</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
          <input
            type="text" required placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 dark:focus:ring-amber-500/20 transition-all text-gray-900 dark:text-white"
          />
        </div>

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

        {/* Avatar Upload */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Avatar Image (Optional)</label>
          <label className="flex items-center justify-center gap-2 w-full h-12 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer bg-gray-50/50 dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
            <ImageIcon size={16} className="text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
              {imageFile ? imageFile.name : "Choose profile picture"}
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit" disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium text-sm rounded-lg shadow-sm focus:outline-none disabled:opacity-60 transition-all mt-2"
        >
          {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Sign Up"}
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

      {/* Footer redirect */}
      <p className="text-center text-xs text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-amber-500 hover:text-amber-600 transition-colors">
          Sign In
        </Link>
      </p>

    </div>
  );
}