'use client';

import { useState, useEffect, useCallback } from 'react';
import { getProducts } from "@/lib/actions/product.action";
import { Eye, Edit, Trash2, Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import Image from 'next/image';
import EditProductModal from './EditProductModal';
import DeleteConfirmModal from './DeleteConfirmModal';
// import ViewProductModal from './ViewProductModal';
// import EditProductModal from './EditProductModal';
// import DeleteConfirmModal from './DeleteConfirmModal';

export default function ManageProductsTable() {
    const [products, setProducts] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

    // Filter & Query States
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    // Modals Core State
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Fetch Logic linked with backend GET params
    // Fetch Logic linked with backend GET params
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        let queryString = `?page=${page}&limit=8&sort=${sort}`;
        if (search) queryString += `&search=${encodeURIComponent(search)}`;
        if (category) queryString += `&category=${encodeURIComponent(category)}`;

        const res = await getProducts(queryString);

        console.log("API Response Context:", res);
        if (res && !res.error) {

            const rootData = res.data || res;

            setProducts(rootData.products || []);
            setPagination(rootData.pagination || { page: 1, totalPages: 1 });
        } else {
            setProducts([]);
        }
        setLoading(false);
    }, [page, search, category, sort]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <div className="w-full space-y-4">
            {/* Search, Sort and Filter UI Controls */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white dark:bg-[#161F30] p-4 rounded-xl border border-gray-100 dark:border-gray-800/80 transition-all">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text" placeholder="Search threads..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-gray-950 dark:text-white"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <select
                        value={sort} onChange={(e) => setSort(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161F30] text-xs focus:outline-none text-gray-700 dark:text-gray-300"
                    >
                        <option value="newest">Newest First</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {/* Main Responsive Table Box */}
            <div className="w-full bg-white dark:bg-[#161F30] border border-gray-100 dark:border-gray-800/80 rounded-2xl overflow-hidden shadow-sm transition-all">
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
                                    <td colSpan={5} className="text-center p-8 text-gray-400">Loading dynamic data streams...</td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center p-8 text-gray-400">No products found matching query criteria.</td>
                                </tr>
                            ) : (
                                products.map((product) => (
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
                                                <button onClick={() => { setSelectedProduct(product); setIsViewOpen(true); }} className="p-1.5 text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"><Eye size={15} /></button>
                                                <button onClick={() => { setSelectedProduct(product); setIsEditOpen(true); }} className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"><Edit size={15} /></button>
                                                <button onClick={() => { setSelectedProduct(product); setIsDeleteOpen(true); }} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"><Trash2 size={15} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Dynamic Pagination Footer Control */}
                {pagination.totalPages > 1 && (
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between text-xs">
                        <span className="text-gray-400">Page {pagination.page} of {pagination.totalPages}</span>
                        <div className="flex items-center gap-1">
                            <button
                                disabled={page === 1} onClick={() => setPage(prev => prev - 1)}
                                className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 text-gray-500 dark:text-gray-400"
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <button
                                disabled={page === pagination.totalPages} onClick={() => setPage(prev => prev + 1)}
                                className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 text-gray-500 dark:text-gray-400"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Render Dynamic Actions Modals Safely */}
            {/* <ViewProductModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} product={selectedProduct} /> */}
            <EditProductModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} product={selectedProduct} onSuccess={fetchProducts} />

            <DeleteConfirmModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} product={selectedProduct} onSuccess={fetchProducts} />
        </div>
    );
}