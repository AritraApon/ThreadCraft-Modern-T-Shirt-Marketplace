'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CreditCard, Package, MapPin } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { CartItem } from '@/types/cart';
import Image from 'next/image';
import Link from 'next/link';

interface ShippingFormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
}

function CheckoutContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentError = searchParams.get('error');

  const [form, setForm] = useState<ShippingFormData>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch('/api/cart', { credentials: 'include', cache: 'no-store' });
      const data = await res.json();
      if (data.success) setCartItems(data.data?.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
    if (paymentError) {
      const messages: Record<string, string> = {
        payment_failed: 'Payment failed. Please try again.',
        payment_invalid: 'Payment verification failed.',
        payment_validation_failed: 'Could not validate your payment. Contact support.',
        invalid_order: 'Invalid order reference.',
        server_error: 'A server error occurred. Please try again.',
      };
      toast.error(messages[paymentError] || 'Payment error. Please try again.');
    }
  }, [fetchCart, paymentError]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 80 : 0;
  const total = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    setSubmitting(true);

    try {
      // 1. Create the order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          shippingInfo: form,
          orderItems: cartItems.map((item) => ({
            productId: item.productId,
            title: item.title,
            image: item.image,
            price: item.price,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          })),
          totalAmount: total,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        toast.error(orderData.message || 'Failed to create order');
        setSubmitting(false);
        return;
      }

      const orderId = orderData.data?._id;

      // 2. Initiate SSLCommerz payment
      const paymentRes = await fetch('/api/payment/sslcommerz/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ orderId }),
      });

      const paymentData = await paymentRes.json();
      if (!paymentData.success || !paymentData.data?.gatewayUrl) {
        toast.error(paymentData.message || 'Could not connect to payment gateway');
        setSubmitting(false);
        return;
      }

      // 3. Redirect to SSLCommerz payment gateway
      window.location.href = paymentData.data.gatewayUrl;
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500" size={36} />
      </div>
    );
  }

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
        <Package size={48} className="text-gray-300 dark:text-gray-600" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nothing to checkout</h2>
        <p className="text-sm text-gray-500">Add items to your cart first.</p>
        <Link href="/shop" className="px-5 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 transition-colors">
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-1 border-l-4 border-amber-500 pl-4">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <CreditCard size={28} className="text-amber-500" />
          Checkout
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Complete your order details below</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-white dark:bg-[#161F30] border border-gray-100 dark:border-gray-800/80 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-4">
              <MapPin size={16} className="text-amber-500" />
              <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white">Shipping Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-colors"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-colors"
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Full Address *</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House no, Road, Area"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-colors"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Dhaka"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-colors"
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="1200"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Payment Notice */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
            <CreditCard size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400">Secure Payment via SSLCommerz</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                You'll be redirected to a secure payment page. Supports bKash, Nagad, Cards, and more.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="space-y-4"
        >
          <div className="bg-white dark:bg-[#161F30] border border-gray-100 dark:border-gray-800/80 rounded-2xl p-6 space-y-5 sticky top-24">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-4">
              <Package size={16} className="text-amber-500" />
              <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white">Order Summary</h2>
            </div>

            {/* Items */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item._id as string} className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                    {item.image && <Image src={item.image} alt={item.title} fill className="object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{item.title}</p>
                    <p className="text-[10px] text-gray-400">× {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-gray-900 dark:text-white flex-shrink-0">
                    ৳{(item.price * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t border-gray-100 dark:border-gray-800 pt-4">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900 dark:text-white">৳{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Delivery</span>
                <span className="font-semibold text-gray-900 dark:text-white">৳{shipping}</span>
              </div>
              <div className="flex justify-between font-black text-base border-t border-gray-100 dark:border-gray-800 pt-2">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-amber-500">৳{total.toFixed(0)}</span>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
              className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm shadow-amber-500/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <><Loader2 size={18} className="animate-spin" /> Connecting to Gateway...</>
              ) : (
                <><CreditCard size={18} /> Place Order & Pay</>
              )}
            </motion.button>
          </div>
        </motion.div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500" size={36} />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
