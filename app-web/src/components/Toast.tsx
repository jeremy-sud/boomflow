'use client'

import { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react'

/** Toast notification type */
interface Toast {
  readonly id: string
  readonly type: 'success' | 'error' | 'info' | 'badge'
  readonly title: string
  readonly message: string
  readonly duration?: number
}

/** Context type for toast system */
interface ToastContextType {
  readonly toasts: Toast[]
  readonly addToast: (toast: Omit<Toast, 'id'>) => void
  readonly removeToast: (id: string) => void
}

/**
 * Maps tier to emoji
 */
const TIER_EMOJI_MAP: Record<string, string> = {
  GOLD: '🥇',
  SILVER: '🥈',
  BRONZE: '🥉',
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7)
    setToasts(prev => [...prev, { ...toast, id }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({ toasts, addToast, removeToast }), [toasts, addToast, removeToast])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

/** Props for ToastItem component */
interface ToastItemProps {
  readonly toast: Toast
  readonly onClose: () => void
}

/**
 * Individual toast notification component
 */
function ToastItem({ toast, onClose }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Animated entrance
    requestAnimationFrame(() => setIsVisible(true))

    // Auto-close
    const duration = toast.duration || (toast.type === 'badge' ? 5000 : 3000)
    const timer = setTimeout(() => {
      setIsLeaving(true)
      setTimeout(onClose, 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [toast.duration, toast.type, onClose])

  const bgColors = {
    success: 'bg-green-500/90',
    error: 'bg-red-500/90',
    info: 'bg-blue-500/90',
    badge: 'bg-gradient-to-r from-yellow-500 to-amber-500',
  }

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    badge: '🏆',
  }

  return (
    <div
      className={`
        ${bgColors[toast.type]}
        min-w-80 max-w-md p-4 rounded-xl shadow-2xl
        backdrop-blur-sm border border-white/20
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${toast.type === 'badge' ? 'animate-pulse' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icons[toast.type]}</span>
        <div className="flex-1">
          <h4 className="font-bold text-white text-sm">{toast.title}</h4>
          <p className="text-white/90 text-sm mt-0.5">{toast.message}</p>
        </div>
        <button
          onClick={() => {
            setIsLeaving(true)
            setTimeout(onClose, 300)
          }}
          className="text-white/70 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white/50 rounded-full"
          style={{
            animation: `shrink ${toast.duration || (toast.type === 'badge' ? 5000 : 3000)}ms linear forwards`
          }}
        />
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}

// Hook to show badge earned notification (with confetti!)
export function useBadgeToast() {
  const { addToast } = useToast()

  const showBadgeEarned = useCallback((badgeName: string, tier: string) => {
    const tierEmoji = TIER_EMOJI_MAP[tier] ?? '🥉'
    
    addToast({
      type: 'badge',
      title: `${tierEmoji} New Badge!`,
      message: `You unlocked "${badgeName}"`,
      duration: 5000,
    })

    // Confetti effect - use globalThis for SSR compatibility
    if (globalThis.window !== undefined) {
      triggerConfetti()
    }
  }, [addToast])

  return { showBadgeEarned }
}

// Simple CSS confetti
function triggerConfetti() {
  const container = document.createElement('div')
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    overflow: hidden;
  `
  document.body.appendChild(container)

  const colors = ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#32CD32', '#9370DB']
  
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div')
    const color = colors[Math.floor(Math.random() * colors.length)]
    const left = Math.random() * 100
    const delay = Math.random() * 0.5
    const duration = 2 + Math.random() * 2
    
    confetti.style.cssText = `
      position: absolute;
      top: -10px;
      left: ${left}%;
      width: 10px;
      height: 10px;
      background: ${color};
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      animation: confetti-fall ${duration}s ease-out ${delay}s forwards;
    `
    container.appendChild(confetti)
  }

  // Add keyframes
  const style = document.createElement('style')
  style.textContent = `
    @keyframes confetti-fall {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)

  // Clean up after animation
  setTimeout(() => {
    container.remove()
    style.remove()
  }, 5000)
}
