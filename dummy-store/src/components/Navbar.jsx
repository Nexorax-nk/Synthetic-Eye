import { useState } from 'react';
import { api } from '../api/api';

export default function Navbar({ cartCount, onGoCart, searchQuery, onSearch, onLogoClick, onAccountClick }) {
    const [isChaos, setIsChaos] = useState(api.chaos);

    const toggleChaos = async () => {
        const newChaos = !isChaos;
        setIsChaos(newChaos);
        api.chaos = newChaos;

        if (newChaos) {
            try {
                await fetch('http://localhost:5000/api/chaos', { method: 'POST' });
            } catch (e) {
                console.error("Failed to trigger global chaos", e);
            }
        }
    };

    return (
        <header className="bg-blue-700 text-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
                {/* Logo area */}
                <button
                    onClick={onLogoClick}
                    className="shrink-0 text-white font-bold text-xl tracking-wide hover:opacity-90 transition-opacity"
                    aria-label="Go to home"
                >
                    ShopNow
                </button>

                {/* Search bar */}
                <div className="flex-1 flex">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearch(e.target.value)}
                        placeholder="Search for products, brands and more"
                        aria-label="Search products"
                        className="flex-1 px-4 py-2.5 text-sm text-gray-800 bg-white rounded-l-md focus:outline-none placeholder-gray-400 min-w-0"
                    />
                    <button
                        className="bg-amber-400 hover:bg-amber-500 px-4 py-2.5 rounded-r-md transition-colors flex items-center justify-center shrink-0"
                        aria-label="Search"
                    >
                        <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-3 shrink-0">
                    {/* Chaos Toggle */}
                    <div className="flex items-center gap-2 mr-2">
                        <span className="text-[10px] uppercase font-black text-blue-200 tracking-wider">Chaos Mode</span>
                        <button
                            onClick={toggleChaos}
                            className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-200 ${isChaos ? 'bg-red-500' : 'bg-blue-900/40'}`}
                            aria-label="Toggle Chaos Mode"
                        >
                            <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${isChaos ? 'translate-x-5' : ''}`} />
                        </button>
                    </div>

                    {/* Profile */}
                    <button
                        onClick={onAccountClick}
                        className="flex items-center gap-1.5 hover:bg-blue-800 px-3 py-2 rounded transition-colors text-sm font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="hidden sm:inline">Account</span>
                    </button>

                    {/* Cart */}
                    <button
                        onClick={onGoCart}
                        data-testid="nav-cart-btn"
                        className="relative flex items-center gap-1.5 hover:bg-blue-800 px-3 py-2 rounded transition-colors text-sm font-medium"
                        aria-label={`Cart with ${cartCount} items`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="hidden sm:inline">Cart</span>
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-amber-400 text-gray-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    )
}
