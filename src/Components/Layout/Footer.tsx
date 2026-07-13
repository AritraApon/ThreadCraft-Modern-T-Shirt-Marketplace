import Link from 'next/link';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F9FAFB] dark:bg-[#070A12] border-t border-gray-100 dark:border-gray-900/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

        {/* Top Segment: Brand & Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-gray-200/60 dark:border-gray-900/40">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-base font-black tracking-wider text-gray-900 dark:text-white uppercase">
              THREADS<span className="text-amber-500">&CO.</span>
            </span>
            <p className="text-[10px] text-gray-400">Premium apparel nodes engineered for absolute comfort.</p>
          </div>

          {/* Navigation Route Map */}
          <nav className="flex flex-wrap justify-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs font-bold text-gray-500 hover:text-amber-500 dark:text-gray-400 dark:hover:text-amber-400 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Segment: Copyright & Payment Matrix */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          {/* Copyright node featuring owner signature */}
          <p className="text-[11px] text-gray-400 font-medium">
            © {currentYear} THREADS & CO. Crafted by{' '}
            <Link
              href="https://github.com"
              target="_blank"
              className="text-gray-900 dark:text-gray-200 font-bold hover:text-amber-500 transition-colors"
            >
              Aritro Mazumdar
            </Link>
            . All Rights Reserved.
          </p>

          {/* Core Payment Provider Badges */}
          <div className="flex items-center gap-3 bg-white dark:bg-gray-950 px-4 py-2 rounded-xl border border-gray-200/60 dark:border-gray-900/60 shadow-sm">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mr-1">Secured Pay:</span>
            <span className="text-xs flex items-center gap-1 font-bold text-pink-500 bg-pink-50 dark:bg-pink-950/20 px-2 py-0.5 rounded-md" title="bKash">
              ৳ bKash
            </span>
            <span className="text-xs flex items-center gap-1 font-bold text-purple-500 bg-purple-50 dark:bg-purple-950/20 px-2 py-0.5 rounded-md" title="Rocket">
              🚀 Rocket
            </span>
            <span className="text-xs flex items-center gap-1 font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded-md" title="Stripe">
              💳 Stripe
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}