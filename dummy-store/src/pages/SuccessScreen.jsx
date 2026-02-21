export default function SuccessScreen({ onContinue }) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden w-full max-w-md">
                {/* Top bar */}
                <div className="bg-green-500 h-1.5 w-full" />

                <div className="p-10 text-center">
                    {/* Green check icon */}
                    <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <svg
                            className="w-14 h-14 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1
                        data-testid="success-msg"
                        className="text-2xl font-bold text-gray-900 mb-2"
                    >
                        Order Successful
                    </h1>

                    <p className="text-sm text-gray-500 mb-2">
                        Your order has been placed and is being processed.
                    </p>
                    <p className="text-sm text-gray-400 mb-8">
                        You'll receive a confirmation notification shortly.
                    </p>

                    {/* Order reference */}
                    <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 mb-8 inline-block">
                        <p className="text-xs text-gray-400">Order ID</p>
                        <p className="text-sm font-mono font-bold text-gray-700 mt-0.5">
                            #{Math.floor(Math.random() * 9000000 + 1000000)}
                        </p>
                    </div>

                    <button
                        onClick={onContinue}
                        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 rounded-lg transition-colors text-sm"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    )
}
