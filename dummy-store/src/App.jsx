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

  // Sync cart with backend on mount
  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const data = await api.getCart()
      setCart(data)
    } catch (err) {
      console.error('Failed to fetch cart', err)
    }
  }

  const addToCart = async (product, qty = 1) => {
    try {
      const updatedCart = await api.addToCart(product.id, qty)
      setCart(updatedCart)
    } catch (err) {
      console.error('Failed to add to cart', err)
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
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
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
            const updated = await api.updateCartQty(id, qty);
            setCart(updated);
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
