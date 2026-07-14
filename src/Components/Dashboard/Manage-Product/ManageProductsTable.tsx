'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
// 🎯 এখানে তোমার সব প্রোডাক্ট আনার সার্ভার অ্যাকশনটি ইমপোর্ট করো (যেমন: getProducts)
import { getProducts } from "@/lib/actions/product.action";
import { Eye, Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import EditProductModal from './EditProductModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import Link from 'next/link';

export default function ManageProductsTable() {
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // ফ্রন্টএন্ড সার্চ ও পেজিনেশন স্টেটস
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 8;

    // মোডাল স্টেটস
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // 🔄 ডাটাবেজ থেকে সব প্রোডাক্ট একবারে নিয়ে আসার লজিক
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            // ডিটেইলস পেজের অ্যাকশনে হাত না দিয়ে, জাস্ট নরমাল সব প্রোডাক্ট কল করা হচ্ছে
            const res = await getProducts({});

            if (res && res.success) {
                // API রেসপন্স ডাটার শেপ অনুযায়ী প্রোডাক্ট সেট করা
                const fetchedData = res.data?.products || res.data || [];
                setAllProducts(Array.isArray(fetchedData) ? fetchedData : []);
            } else {
                setAllProducts([]);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            setAllProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // 🔍 ফ্রন্টএন্ড সার্চ লজিক (ইনস্ট্যান্ট কাজ করবে)
    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return allProducts;

        const query = searchQuery.toLowerCase().trim();
        return allProducts.filter(product =>
            product.title?.toLowerCase().includes(query) ||
            product.category?.toLowerCase().includes(query)
        );
    }, [allProducts, searchQuery]);

    // 📄 ফ্রন্টএন্ড পেজিনেশন ক্যালকুলেশন
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

    useEffect(() => {
        if (page > totalPages) setPage(1);
    }, [searchQuery, totalPages, page]);

    const displayedProducts = useMemo(() => {
        const startIndex = (page - 1) * itemsPerPage;
        return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProducts, page]);

    return (
        <div className="w-full space-y-4">
            {/* সার্চ বার */}
            <div className="flex bg-white dark:bg-[#161F30] p-4 rounded-xl border border-gray-100 dark:border-gray-800/80">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                        className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs focus:outline-none text-gray-950 dark:text-white"
                    />
                </div>
            </div>

            {/* প্রোডাক্ট টেবিল */}
            <div className="w-full bg-white dark:bg-[#161F30] border border-gray-100 dark:border-gray-800/80 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-[#0B0F19]/30 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                <th className="p-4">Product Info</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-xs text-gray-700 dark:text-gray-300">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center p-8 text-gray-400">Loading products...</td>
                                </tr>
                            ) : displayedProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center p-8 text-gray-400">No products found.</td>
                                </tr>
                            ) : (
                                displayedProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50/40 dark:hover:bg-gray-800/10 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {product.images?.[0] && (
                                                    <Image width={36} height={36} src={product.images[0]} alt="" className="w-9 h-9 rounded-lg object-cover bg-gray-100" />
                                                )}
                                                <div>
                                                    <p className="font-semibold text-gray-950 dark:text-white">{product.title}</p>
                                                    <p className="text-[10px] text-gray-400 truncate max-w-[180px]">{product.shortDescription}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4"><span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{product.category || 'N/A'}</span></td>
                                        <td className="p-4 font-semibold text-gray-950 dark:text-white">${product.price}</td>
                                        <td className="p-4 font-medium">{product.stock} pcs</td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {/* 👁️ ভিউ / ডিটেইলস বাটন (প্রয়োজন হলে লিংকে রূপান্তর করতে পারো) */}
                                                <Link href={`/shop/${product._id || product.id}`} className="p-1.5 text-gray-400 hover:text-amber-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"><Eye size={15} /></Link>
                                                {/* 📝 এডিট বাটন */}
                                                <button onClick={() => { setSelectedProduct(product); setIsEditOpen(true); }} className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"><Edit size={15} /></button>
                                                {/* 🗑️ ডিলিট বাটন */}
                                                <button onClick={() => { setSelectedProduct(product); setIsDeleteOpen(true); }} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"><Trash2 size={15} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* পেজ কন্ট্রোল */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between text-xs">
                        <span className="text-gray-400">Page {page} of {totalPages}</span>
                        <div className="flex items-center gap-1">
                            <button
                                disabled={page === 1} onClick={() => setPage(prev => prev - 1)}
                                className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 text-gray-500 dark:text-gray-400"
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <button
                                disabled={page === totalPages} onClick={() => setPage(prev => prev + 1)}
                                className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 text-gray-500 dark:text-gray-400"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* মোডালগুলো সাকসেস হলে ডাটা রি-ফেচ করবে */}

            <EditProductModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} product={selectedProduct} onSuccess={fetchProducts} />
            <DeleteConfirmModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} product={selectedProduct} onSuccess={fetchProducts} />
        </div>
    );
}