const EmptyState = ({ message, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">

      {/* Icon */}
      <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-10 h-10 text-indigo-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7"
          />
        </svg>
      </div>

      <p className="text-gray-500 text-lg mb-6">{message}</p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="
            px-6 py-2.5
            bg-indigo-600
            hover:bg-indigo-700
            text-white
            font-semibold
            rounded-lg
            transition
          "
        >
          {actionLabel}
        </button>
      )}

    </div>
  );
};

export default EmptyState;