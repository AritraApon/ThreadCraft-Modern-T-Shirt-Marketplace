'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

function Counter({ value }: { value: number }) {
  const spring = useSpring(0, { duration: 2 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
}

export default function Statistics() {
  return (
    <section className="py-16 bg-amber-500 text-white">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          { label: "Happy Customers", count: 5000 },
          { label: "Products Sold", count: 12000 },
          { label: "Cities Covered", count: 64 },
          { label: "Quality Rating", count: 99 },
        ].map((stat, i) => (
          <div key={i}>
            <div className="text-4xl font-black mb-2">
              <Counter value={stat.count} />+
            </div>
            <p className="text-xs uppercase tracking-widest font-bold opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}