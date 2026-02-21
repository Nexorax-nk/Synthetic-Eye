import { useState } from 'react'

function StarRating({ rating, count }) {
    const full = Math.floor(rating)
    const half = rating % 1 >= 0.5

    return (
        <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= full
                            ? 'text-amber-400'
                            : star === full + 1 && half
                                ? 'text-amber-300'
                                : 'text-gray-300'
                            }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
            <span className="text-xs text-gray-400">({count.toLocaleString()})</span>
        </div>
    )
}

export default function ProductCard({ product, onAddToCart, onViewProduct }) {
    const [adding, setAdding] = useState(false)
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

    const handleAdd = (e) => {
        e.stopPropagation()
        onAddToCart(product)
        setAdding(true)
        setTimeout(() => setAdding(false), 900)
    }

    return (
        <article
            data-testid={`product-${product.id}`}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col group"
            onClick={() => onViewProduct(product)}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onViewProduct(product)}
            aria-label={`View ${product.name}`}
        >
            {/* Image */}
            <div className="relative overflow-hidden bg-gray-50 aspect-square">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                />
                {product.badge && (
                    <span className="absolute top-2 left-2 bg-amber-400 text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                        {product.badge}
                    </span>
                )}
            </div>

            {/* Details */}
            <div className="p-4 flex flex-col flex-1">
                <p className="text-[11px] text-blue-600 font-semibold uppercase tracking-wider mb-0.5">
                    {product.brand}
                </p>
                <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-1.5 line-clamp-2">
                    {product.name}
                </h3>
                <StarRating rating={product.rating} count={product.reviews} />

                {/* Price row */}
                <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    <span className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                    <span className="text-xs font-semibold text-green-600">{discount}% off</span>
                </div>

                {/* Add to Cart */}
                <button
                    data-testid="add-cart-btn"
                    onClick={handleAdd}
                    className={`mt-auto w-full py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${adding
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-700 hover:bg-blue-800 text-white'
                        }`}
                >
                    {adding ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
            </div>
        </article>
    )
}
