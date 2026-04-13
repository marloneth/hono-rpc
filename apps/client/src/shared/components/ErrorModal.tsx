import { useError } from "../context/ErrorContext";

export function ErrorModal() {
  const { error, clearError } = useError();

  if (!error) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={clearError}
    >
      <div
        className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="bg-red-100 text-red-500 rounded-full p-2 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-11.25a.75.75 0 011.5 0v4.5a.75.75 0 01-1.5 0v-4.5zm.75 7.5a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">Something went wrong</h2>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
        </div>

        <button
          onClick={clearError}
          className="mt-5 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
