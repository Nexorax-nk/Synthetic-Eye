import { useState, useEffect } from 'react'
import './index.css'
import LoginPage from './pages/LoginPage'
import CatalogPage from './pages/CatalogPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import SuccessScreen from './pages/SuccessScreen'
import ProfilePage from './pages/ProfilePage'
import { api } from './api/api'

export default function App() {
  const [page, setPage] = useState('login')
  const [cart, setCart] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [globalError, setGlobalError] = useState(null)

  const showError = (msg) => {
    setGlobalError(msg)
    setTimeout(() => setGlobalError(null), 5000)
  }

  // Sync cart with backend on mount
  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const data = await api.getCart()
      if (Array.isArray(data)) {
        setCart(data)
      } else {
        setCart([])
      }
    } catch (err) {
      console.error('Failed to fetch cart', err)
      showError(err.message)
      setCart([])
    }
  }

  const addToCart = async (product, qty = 1) => {
    try {
      const updatedCart = await api.addToCart(product.id, qty)
      setCart(updatedCart)
    } catch (err) {
      console.error('Failed to add to cart', err)
      showError(err.message)
    }
  }

  const cartCount = cart.reduce((acc, p) => acc + p.qty, 0)
  const cartTotal = cart.reduce((acc, p) => acc + p.price * p.qty, 0)

  const navigate = (target, extra) => {
    if (target === 'detail' && extra) setSelectedProduct(extra)
    setPage(target)
  }

  const handleCheckout = async () => {
    try {
      await api.placeOrder()
      setCart([])
      setPage('success')
    } catch (err) {
      console.error('Checkout failed', err)
      showError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans relative overflow-x-hidden">
      {globalError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600/95 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold z-50 shadow-2xl flex items-center gap-3 border border-red-500 max-w-[90vw]">
          <span className="text-2xl isolate">🚨</span>
          <span className="tracking-wide text-sm md:text-base leading-tight">System Error: {globalError}</span>
        </div>
      )}

      {page === 'login' && <LoginPage onLogin={() => setPage('catalog')} />}

      {page === 'catalog' && (
        <CatalogPage
          onAddToCart={addToCart}
          cartCount={cartCount}
          onGoCart={() => setPage('cart')}
          onViewProduct={(p) => navigate('detail', p)}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onAccountClick={() => setPage('profile')}
        />
      )}

      {page === 'detail' && selectedProduct && (
        <ProductDetailPage
          product={selectedProduct}
          onAddToCart={addToCart}
          cartCount={cartCount}
          onGoCart={() => setPage('cart')}
          onBack={() => setPage('catalog')}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onAccountClick={() => setPage('profile')}
        />
      )}

      {page === 'cart' && (
        <CartPage
          cart={cart}
          total={cartTotal}
          onCheckout={handleCheckout}
          onBack={() => setPage('catalog')}
          onUpdateQty={async (id, qty) => {
            try {
              const updated = await api.updateCartQty(id, qty);
              setCart(updated);
            } catch (err) {
              showError(err.message);
            }
          }}
        />
      )}

      {page === 'profile' && (
        <ProfilePage
          onBack={() => setPage('catalog')}
          cartCount={cartCount}
          onGoCart={() => setPage('cart')}
        />
      )}

      {page === 'success' && (
        <SuccessScreen onContinue={() => { setPage('catalog') }} />
      )}
    </div>
  )
}
