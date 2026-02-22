import { useState } from 'react'
import { api } from '../api/api'

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            await api.login(email, password)
            onLogin()
        } catch (err) {
            setError(err.message || 'Connection failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-12"
            style={{ background: 'linear-gradient(135deg, #1a56db 0%, #1e3a8a 100%)' }}
        >
            <div className="w-full max-w-sm">
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                    {/* Card top accent */}
                    <div className="bg-blue-700 px-8 pt-8 pb-6 text-white">
                        <h1 className="text-2xl font-bold tracking-tight">Sign In</h1>
                        <p className="text-blue-200 text-sm mt-1">to continue shopping</p>
                    </div>

                    <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
                        {error && (
                            <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100 italic">
                                {error}
                            </div>
                        )}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5"
                            >
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                data-testid="email-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                data-testid="password-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            data-testid="login-btn"
                            className={`w-full bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-gray-900 font-bold py-3.5 rounded-lg text-sm tracking-wide transition-all shadow-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Signing in...' : 'Login'}
                        </button>
                    </form>

                    <div className="border-t border-gray-100 px-8 py-4 bg-gray-50">
                        <p className="text-xs text-gray-400 text-center">
                            Demo app — no real authentication required
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
