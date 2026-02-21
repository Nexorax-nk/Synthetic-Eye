export default function SuccessPage({ onContinue }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="text-center max-w-sm w-full">
                {/* Green checkmark */}
                <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <svg
                        className="w-12 h-12 text-green-500"
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

                <p className="text-gray-500 text-sm mb-8">
                    Your order has been placed and is being processed. You will receive a confirmation shortly.
                </p>

                <button
                    onClick={onContinue}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    )
}
