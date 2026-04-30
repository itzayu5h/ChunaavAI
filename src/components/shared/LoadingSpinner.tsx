/**
 * Loading spinner with bilingual message
 * @param message - Optional custom message
 * @param fullScreen - If true, centers on full screen
 */

interface LoadingSpinnerProps {
  message?: string
  fullScreen?: boolean
}

export default function LoadingSpinner({ 
  message = 'Loading... / लोड हो रहा है...',
  fullScreen = false,
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${
      fullScreen ? 'min-h-screen' : 'py-20'
    }`}>
      <div className="w-12 h-12 border-4 border-gray-200 border-t-[#FF6F00] rounded-full animate-spin" />
      <p className="mt-4 text-gray-500 text-sm text-center px-4">
        {message}
      </p>
    </div>
  )
}
