import { useState, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar'
import ProductGrid from '../components/ProductGrid'
import { api } from '../api/api'

const CATEGORIES = ['All', 'Mobiles', 'Laptops', 'Tablets', 'Audio', 'Gaming', 'Input Devices', 'Display', 'Cameras', 'Accessories', 'Smart Home', 'E-Readers']

const PRICE_RANGES = [
    { label: 'All', min: null, max: null },
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50 – $100', min: 50, max: 100 },
    { label: '$100 – $300', min: 100, max: 300 },
    { label: 'Above $300', min: 300, max: 10000 },
]

const NAV_FILTERS = ['Top Offers', 'Electronics', 'Accessories', 'New Arrivals', 'Clearance']

export default function CatalogPage({ onAddToCart, cartCount, onGoCart, onViewProduct, searchQuery, onSearch, onAccountClick }) {
    const [activeCategory, setActiveCategory] = useState('All')
    const [activePriceRange, setActivePriceRange] = useState(PRICE_RANGES[0])
    const [activeNavFilter, setActiveNavFilter] = useState(null)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchProducts = useCallback(async () => {
        setLoading(true)
        try {
            const params = {
                category: activeCategory,
                search: searchQuery,
            }
            if (activePriceRange.min !== null) params.minPrice = activePriceRange.min
            if (activePriceRange.max !== null) params.maxPrice = activePriceRange.max
            if (activeNavFilter) params.filter = activeNavFilter

            const data = await api.getProducts(params)
            setProducts(data)
        } catch (err) {
            console.error('Failed to fetch products', err)
        } finally {
            setLoading(false)
        }
    }, [activeCategory, searchQuery, activePriceRange, activeNavFilter])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    const handleNavFilterClick = (filter) => {
        if (activeNavFilter === filter) {
            setActiveNavFilter(null) // Toggle off
        } else {
            setActiveNavFilter(filter)
            // Reset other filters to avoid confusion
            setActiveCategory('All')
            setActivePriceRange(PRICE_RANGES[0])
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar
                cartCount={cartCount}
                onGoCart={onGoCart}
                searchQuery={searchQuery}
                onSearch={onSearch}
                onAccountClick={onAccountClick}
                onLogoClick={() => {
                    setActiveCategory('All')
                    setActiveNavFilter(null)
                    setActivePriceRange(PRICE_RANGES[0])
                    onSearch('')
                }}
            />

            {/* Hero / Banner strip (Top Nav Filters) */}
            <div className="bg-blue-700 text-white shadow-inner">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6 overflow-x-auto text-sm font-medium whitespace-nowrap">
                    {NAV_FILTERS.map((label) => (
                        <button
                            key={label}
                            onClick={() => handleNavFilterClick(label)}
                            className={`transition-all px-2 py-1 rounded ${activeNavFilter === label
                                ? 'bg-white text-blue-700 shadow-sm'
                                : 'text-blue-100 hover:text-white hover:bg-blue-600/50'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* Breadcrumb */}
                <nav className="text-[10px] text-gray-400 mb-6 flex items-center gap-1.5 uppercase font-bold tracking-wider" aria-label="Breadcrumb">
                    <span className="hover:text-blue-600 cursor-pointer">Home</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-600">
                        {activeNavFilter || activeCategory || 'All Products'}
                    </span>
                </nav>

                <div className="flex gap-8">
                    {/* Sidebar filters */}
                    <aside className="hidden lg:block w-56 shrink-0">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sticky top-24">
                            <h2 className="text-[11px] font-black text-gray-900 mb-4 uppercase tracking-widest border-b border-gray-100 pb-2">Category</h2>
                            <ul className="space-y-1">
                                {CATEGORIES.map((cat) => (
                                    <li key={cat}>
                                        <button
                                            onClick={() => {
                                                setActiveCategory(cat)
                                                setActiveNavFilter(null)
                                            }}
                                            className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all ${activeCategory === cat
                                                ? 'text-blue-700 font-bold bg-blue-50/50'
                                                : 'text-gray-500 hover:text-blue-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <div className="my-6 border-t border-gray-100" />

                            <h2 className="text-[11px] font-black text-gray-900 mb-4 uppercase tracking-widest border-b border-gray-100 pb-2">Price Range</h2>
                            <ul className="space-y-1">
                                {PRICE_RANGES.map((range) => (
                                    <li key={range.label}>
                                        <button
                                            onClick={() => setActivePriceRange(range)}
                                            className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all ${activePriceRange.label === range.label
                                                ? 'text-blue-700 font-bold bg-blue-50/50'
                                                : 'text-gray-500 hover:text-blue-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {range.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Product area */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200/60">
                            <div>
                                <h1 className="text-xl font-black text-gray-900 tracking-tight">
                                    {activeNavFilter || (activeCategory === 'All' ? 'All Tech Products' : activeCategory)}
                                    {searchQuery && <span className="text-gray-400 font-normal italic"> · Results for "{searchQuery}"</span>}
                                </h1>
                                <p className="text-xs text-gray-400 mt-1 font-medium">Showing {products.length} premium items curated for you</p>
                            </div>

                            {/* Mobile category pills */}
                            <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            setActiveCategory(cat)
                                            setActiveNavFilter(null)
                                        }}
                                        className={`shrink-0 text-xs px-4 py-2 rounded-full border transition-all ${activeCategory === cat
                                            ? 'bg-blue-700 text-white border-blue-700 shadow-md'
                                            : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <div key={i} className="bg-white h-80 rounded-xl border border-gray-100 shadow-sm" />
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-20 text-center">
                                <div className="text-5xl mb-4">🔍</div>
                                <h3 className="text-lg font-bold text-gray-800">No products found</h3>
                                <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">We couldn't find anything matching your current filters. Try resetting or adjusting your criteria.</p>
                                <button
                                    onClick={() => {
                                        setActiveCategory('All')
                                        setActiveNavFilter(null)
                                        setActivePriceRange(PRICE_RANGES[0])
                                        onSearch('')
                                    }}
                                    className="mt-6 text-blue-700 font-bold hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <ProductGrid
                                products={products}
                                onAddToCart={onAddToCart}
                                onViewProduct={onViewProduct}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
