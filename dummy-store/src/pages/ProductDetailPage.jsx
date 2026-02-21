import { useState } from 'react'
import Navbar from '../components/Navbar'

function StarRating({ rating, count }) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
            <span className="text-sm text-blue-600 font-medium">{rating} / 5</span>
            <span className="text-sm text-gray-400">{count.toLocaleString()} ratings</span>
        </div>
    )
}

export default function ProductDetailPage({
    product,
    onAddToCart,
    cartCount,
    onGoCart,
    onBack,
    searchQuery,
    onSearch,
    onAccountClick,
}) {
    const [qty, setQty] = useState(1)
    const [added, setAdded] = useState(false)
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

    const handleAdd = () => {
        onAddToCart(product, qty)
        setAdded(true)
        setTimeout(() => setAdded(false), 1200)
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar
                cartCount={cartCount}
                onGoCart={onGoCart}
                searchQuery={searchQuery}
                onSearch={onSearch}
                onLogoClick={onBack}
                onAccountClick={onAccountClick}
            />

            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* Breadcrumb */}
                <nav className="text-xs text-gray-400 mb-4" aria-label="Breadcrumb">
                    <button onClick={onBack} className="hover:text-blue-600 transition-colors">Home</button>
                    <span className="mx-1">/</span>
                    <button onClick={onBack} className="hover:text-blue-600 transition-colors">Electronics</button>
                    <span className="mx-1">/</span>
                    <span className="text-gray-700 truncate">{product.name}</span>
                </nav>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
                        {/* Image column */}
                        <div className="md:col-span-2 bg-gray-50 flex items-center justify-center p-8 border-r border-gray-100">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="max-w-full max-h-80 object-contain rounded-lg"
                            />
                        </div>

                        {/* Info column */}
                        <div className="md:col-span-3 p-8">
                            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">{product.brand}</p>
                            <h1 className="text-xl font-bold text-gray-900 mb-3 leading-snug">{product.name}</h1>

                            <StarRating rating={product.rating} count={product.reviews} />

                            <hr className="my-5 border-gray-100" />

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-2">
                                <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                                <span className="text-lg text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                                <span className="text-base font-bold text-green-600">{discount}% off</span>
                            </div>
                            <p className="text-xs text-green-600 font-medium mb-5">
                                You save ${(product.originalPrice - product.price).toFixed(2)}
                            </p>

                            {/* Highlights */}
                            <div className="mb-5">
                                <h2 className="text-sm font-bold text-gray-700 mb-2">Highlights</h2>
                                <ul className="space-y-1.5">
                                    {product.features.map((f) => (
                                        <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                                            <svg className="w-3.5 h-3.5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-600 leading-relaxed mb-6">{product.description}</p>

                            {/* Quantity + Add */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                                        className="px-4 py-2.5 text-lg text-gray-600 hover:bg-gray-50 transition-colors"
                                        aria-label="Decrease quantity"
                                    >
                                        −
                                    </button>
                                    <span className="px-5 py-2.5 text-sm font-semibold text-gray-900 border-x border-gray-300 min-w-[48px] text-center">
                                        {qty}
                                    </span>
                                    <button
                                        onClick={() => setQty((q) => q + 1)}
                                        className="px-4 py-2.5 text-lg text-gray-600 hover:bg-gray-50 transition-colors"
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    data-testid="add-cart-btn"
                                    onClick={handleAdd}
                                    className={`flex-1 sm:flex-none px-10 py-3 rounded-lg font-bold text-sm transition-all duration-200 ${added
                                        ? 'bg-green-500 text-white'
                                        : 'bg-amber-400 hover:bg-amber-500 text-gray-900'
                                        }`}
                                >
                                    {added ? '✓ Added to Cart' : 'Add to Cart'}
                                </button>

                                <button
                                    onClick={() => { handleAdd(); onGoCart() }}
                                    className="flex-1 sm:flex-none px-10 py-3 rounded-lg font-bold text-sm bg-blue-700 hover:bg-blue-800 text-white transition-colors"
                                >
                                    Buy Now
                                </button>
                            </div>

                            <p className="text-xs text-gray-400 mt-4">Free delivery · Easy 30-day returns · In Stock</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
