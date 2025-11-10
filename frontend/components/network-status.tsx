"use client"

import { useEffect, useState } from "react"
import { checkHealth } from "@/lib/genlayer"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Activity } from "lucide-react"

export function NetworkStatus() {
  const [status, setStatus] = useState<{
    status: string
    latency: number
    contractConfigured: boolean
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkStatus() {
      const health = await checkHealth()
      if (health.success) {
        setStatus({
          status: health.status,
          latency: health.latency,
          contractConfigured: health.contractConfigured || false,
        })
      } else {
        setStatus({
          status: 'down',
          latency: 0,
          contractConfigured: false,
        })
      }
      setLoading(false)
    }

    checkStatus()
    const interval = setInterval(checkStatus, 30000) // Check every 30s

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" />
        <span className="text-[10px] text-muted-foreground">Checking...</span>
      </div>
    )
  }

  if (!status) return null

  const statusConfig = {
    healthy: {
      color: 'bg-green-500',
      text: 'text-green-600',
      label: 'HEALTHY',
      description: 'All systems operational',
    },
    degraded: {
      color: 'bg-yellow-500',
      text: 'text-yellow-600',
      label: 'SLOW',
      description: 'Network experiencing high latency',
    },
    down: {
      color: 'bg-red-500',
      text: 'text-red-600',
      label: 'DOWN',
      description: 'Cannot connect to network',
    },
  }

  const config = statusConfig[status.status as keyof typeof statusConfig] || statusConfig.down

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 cursor-help">
            <div className={`h-2 w-2 rounded-full ${config.color} ${status.status === 'healthy' ? 'animate-pulse' : ''}`} />
            <span className={`text-[10px] font-medium ${config.text}`}>
              {config.label}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Activity className="h-3 w-3" />
              <span className="font-medium">{config.description}</span>
            </div>
            {status.status !== 'down' && (
              <>
                <div className="text-muted-foreground">
                  Latency: {status.latency}ms
                </div>
                <div className="text-muted-foreground">
                  Contract: {status.contractConfigured ? '✓ Configured' : '✗ Not configured'}
                </div>
              </>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
