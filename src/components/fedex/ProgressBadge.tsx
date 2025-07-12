import React from 'react'

interface ProgressBadgeProps {
  percentage: number
  size?: 'small' | 'medium' | 'large'
  animated?: boolean
}

export function ProgressBadge({ percentage, size = 'medium', animated = true }: ProgressBadgeProps) {
  const sizes = {
    small: { container: 'w-20 h-20', text: 'text-lg', label: 'text-xs' },
    medium: { container: 'w-32 h-32', text: 'text-3xl', label: 'text-sm' },
    large: { container: 'w-48 h-48', text: 'text-5xl', label: 'text-base' }
  }

  const sizeClasses = sizes[size]
  const circumference = 2 * Math.PI * 45 // radius of 45 for viewBox of 100

  return (
    <div className={`relative ${sizeClasses.container}`}>
      <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          className="text-gray-200"
        />
        
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#gradient)"
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (percentage / 100) * circumference}
          strokeLinecap="round"
          className={animated ? 'transition-all duration-1000 ease-out' : ''}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-bold text-gray-900 ${sizeClasses.text}`}>
          {percentage}%
        </span>
        <span className={`text-gray-600 ${sizeClasses.label}`}>Complete</span>
      </div>
    </div>
  )
}

export function MiniProgressBar({ percentage, label }: { percentage: number; label: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-600">{label}</span>
        <span className="text-xs font-medium text-gray-900">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}