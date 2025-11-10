"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Activity, CheckCircle2, AlertCircle, XCircle, RefreshCw } from "lucide-react"
import { checkHealth, config } from "@/lib/genlayer"
import { toast } from "sonner"

export function NetworkStatus() {
  const [status, setStatus] = useState<"healthy" | "degraded" | "down" | "unknown">("unknown")
  const [latency, setLatency] = useState<number>(0)
  const [contractConfigured, setContractConfigured] = useState(false)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    checkNetworkStatus()
    const interval = setInterval(checkNetworkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  async function checkNetworkStatus() {
    const result = await checkHealth()
    if (result.success) {
      setStatus(result.status as any)
      setLatency(result.latency || 0)
      setContractConfigured(result.contractConfigured || false)
    } else {
      setStatus("down")
    }
  }

  async function handleRefresh() {
    setChecking(true)
    toast.loading("Checking network status...", { id: "network" })
    await checkNetworkStatus()
    toast.success("Network status updated", { id: "network" })
    setChecking(false)
  }

  const statusConfig = {
    healthy: { 
      icon: CheckCircle2, 
      label: "Healthy", 
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950"
    },
    degraded: { 
      icon: AlertCircle, 
      label: "Degraded", 
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-950"
    },
    down: { 
      icon: XCircle, 
      label: "Down", 
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-950"
    },
    unknown: { 
      icon: Activity, 
      label: "Unknown", 
      color: "text-gray-600",
      bgColor: "bg-gray-100 dark:bg-gray-950"
    }
  }

  const current = statusConfig[status]
  const Icon = current.icon

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Icon className={`h-4 w-4 ${current.color}`} />
          <span className="text-xs">{current.label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-1 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Network Status
            </h4>
            <p className="text-xs text-muted-foreground">
              Real-time connection information
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant="outline" className={`${current.bgColor} ${current.color} border-0`}>
                <Icon className="h-3 w-3 mr-1" />
                {current.label}
              </Badge>
            </div>

            {latency > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Latency</span>
                <span className="text-sm font-medium">{latency}ms</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Contract</span>
              <Badge variant={contractConfigured ? "default" : "destructive"}>
                {contractConfigured ? "Connected" : "Not Configured"}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">RPC URL</span>
              </div>
              <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                {config.rpcUrl}
              </p>
            </div>

            {config.contractAddress && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Contract Address</span>
                </div>
                <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                  {config.contractAddress}
                </p>
              </div>
            )}
          </div>

          <Button 
            onClick={handleRefresh} 
            disabled={checking}
            size="sm"
            variant="outline"
            className="w-full"
          >
            <RefreshCw className={`h-3 w-3 mr-2 ${checking ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
