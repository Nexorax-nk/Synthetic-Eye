export default function CartPage({ cart, total, onCheckout, onBack, onUpdateQty }) {
    const isEmpty = cart.length === 0
    const savings = cart.reduce((acc, p) => acc + (p.originalPrice - p.price) * p.qty, 0)

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-blue-700 text-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
                    <button onClick={onBack} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-bold text-lg">ShopNow</span>
                    </button>
                    <span className="text-blue-200 text-sm ml-2">My Cart</span>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-6">
                {isEmpty ? (
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-16 text-center">
                        <svg className="w-20 h-20 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h2 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty!</h2>
                        <p className="text-gray-400 text-sm mb-6">Add items to get started</p>
                        <button
                            onClick={onBack}
                            className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-8 py-3 rounded-lg transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-5">
                        {/* Items list */}
                        <div className="flex-1 min-w-0 space-y-3">
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100">
                                    <h1 className="text-base font-bold text-gray-800">
                                        My Cart <span className="text-gray-400 font-normal">({cart.length} item{cart.length > 1 ? 's' : ''})</span>
                                    </h1>
                                </div>

                                {cart.map((item, idx) => (
                                    <div
                                        key={item.id}
                                        className={`flex gap-4 px-6 py-5 ${idx < cart.length - 1 ? 'border-b border-gray-100' : ''}`}
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-lg bg-gray-50 shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-blue-600 uppercase">{item.brand}</p>
                                            <h3 className="text-sm font-semibold text-gray-900 truncate mt-0.5">{item.name}</h3>
                                            <div className="flex items-baseline gap-2 mt-1">
                                                <span className="text-base font-bold text-gray-900">${item.price.toFixed(2)}</span>
                                                <span className="text-xs text-gray-400 line-through">${item.originalPrice.toFixed(2)}</span>
                                                <span className="text-xs text-green-600 font-semibold">
                                                    {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                                                </span>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center mt-3 gap-4">
                                                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-gray-50">
                                                    <button
                                                        onClick={() => onUpdateQty(item.id, item.qty - 1)}
                                                        className="px-2 py-1 hover:bg-gray-200 text-gray-600 font-bold"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="px-3 py-1 text-xs font-bold text-gray-800 border-x border-gray-200 bg-white min-w-[32px] text-center">
                                                        {item.qty}
                                                    </span>
                                                    <button
                                                        onClick={() => onUpdateQty(item.id, item.qty + 1)}
                                                        className="px-2 py-1 hover:bg-gray-200 text-gray-600 font-bold"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => onUpdateQty(item.id, 0)}
                                                    className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-tight transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="text-base font-bold text-gray-900">
                                                ${(item.price * item.qty).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <p className="text-xs text-green-600 font-medium bg-green-50 border border-green-100 rounded-lg px-4 py-2.5 flex items-center gap-2">
                                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Your order is eligible for <strong>FREE Delivery</strong>
                            </p>
                        </div>

                        {/* Summary panel */}
                        <aside className="w-full lg:w-80 shrink-0">
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden sticky top-20">
                                <div className="px-6 py-4 border-b border-gray-100">
                                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price Details</h2>
                                </div>

                                <div className="px-6 py-5 space-y-3 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Price ({cart.length} item{cart.length > 1 ? 's' : ''})</span>
                                        <span>${cart.reduce((s, p) => s + p.originalPrice * p.qty, 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-green-600 font-medium">
                                        <span>Discount</span>
                                        <span>− ${savings.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Delivery Charges</span>
                                        <span className="text-green-600 font-medium">FREE</span>
                                    </div>
                                    <hr className="border-dashed border-gray-200" />
                                    <div className="flex justify-between font-bold text-gray-900 text-base">
                                        <span>Total Amount</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                    <p className="text-green-600 font-medium text-xs">
                                        You will save ${savings.toFixed(2)} on this order
                                    </p>
                                </div>

                                {/* THE CHECKOUT BUTTON — dominant and centered */}
                                <div className="px-6 pb-6">
                                    <button
                                        data-testid="checkout-btn"
                                        onClick={onCheckout}
                                        className="w-full bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-gray-900 font-bold py-4 rounded-lg text-base tracking-wide transition-colors shadow-md hover:shadow-lg"
                                    >
                                        Place Order · ${total.toFixed(2)}
                                    </button>
                                    <p className="text-[10px] text-gray-400 text-center mt-2">
                                        Safe and Secure Payments · Easy Returns
                                    </p>
                                </div>
                            </div>
                        </aside>
                    </div>
                )}
            </main>
        </div>
    )
}
