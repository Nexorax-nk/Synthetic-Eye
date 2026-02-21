import Navbar from "../components/Navbar"

export default function ProfilePage({ onBack, cartCount, onGoCart }) {
    const user = {
        name: 'Admin User',
        email: 'admin@hack.com',
        memberSince: 'Feb 2026',
        orders: [
            { id: 'ORD001', date: '2025-02-15', total: 129.98, status: 'Delivered' },
            { id: 'ORD002', date: '2026-02-18', total: 54.99, status: 'Processing' }
        ]
    }

    return (
        <div className="min-h-screen bg-gray-50 uppercase-tracking">
            <Navbar
                cartCount={cartCount}
                onGoCart={onGoCart}
                onLogoClick={onBack}
                searchQuery=""
                onSearch={() => { }}
                onAccountClick={() => { }}
            />

            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="flex items-center gap-6 mb-10">
                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">{user.name}</h1>
                        <p className="text-gray-500 font-medium">{user.email} · Member since {user.memberSince}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-100 pb-3">Recent Orders</h2>
                            <div className="space-y-4">
                                {user.orders.map(order => (
                                    <div key={order.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                                        <div>
                                            <p className="font-bold text-gray-900">Order #{order.id}</p>
                                            <p className="text-xs text-gray-400 font-medium">{order.date}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-gray-900">${order.total}</p>
                                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-100 pb-3">Saved Addresses</h2>
                            <div className="p-4 rounded-xl border border-dashed border-gray-200 text-center text-gray-400 text-sm italic font-medium">
                                No addresses saved yet.
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-blue-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-200">
                            <h3 className="text-xs font-black uppercase tracking-widest mb-2 opacity-80">Plus Member</h3>
                            <p className="text-xl font-bold mb-4">You have 450 SuperCoins!</p>
                            <button className="w-full bg-white text-blue-700 font-black py-2.5 rounded-lg text-xs uppercase tracking-wider hover:bg-blue-50 transition-colors">
                                View Rewards
                            </button>
                        </div>

                        <button
                            onClick={onBack}
                            className="w-full bg-white text-gray-900 font-bold py-3.5 rounded-2xl border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors text-sm"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
