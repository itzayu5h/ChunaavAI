/**
 * Floating WhatsApp share button
 * Fixed position bottom-right corner
 * Appears on all pages
 */

export default function WhatsAppFloat() {
  const shareText = encodeURIComponent(
    'ChunaavAI par election ke baare mein seekho! 🗳️🇮🇳 India ka best election education platform: '
  )
  
  return (
    <a
      href={`https://wa.me/?text=${shareText}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 z-40 md:bottom-6"
      aria-label="Share on WhatsApp"
    >
      <div 
        className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-2xl shadow-lg"
        style={{ 
          boxShadow: '0 4px 12px rgba(37,211,102,0.4)' 
        }}
      >
        💬
      </div>
    </a>
  )
}
