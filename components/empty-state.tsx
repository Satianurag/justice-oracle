"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { FileText, Gavel, AlertCircle } from "lucide-react"

interface EmptyStateProps {
  type: "no-disputes" | "no-evidence" | "no-config"
}

export function EmptyState({ type }: EmptyStateProps) {
  const router = useRouter()

  const states = {
    "no-disputes": {
      icon: Gavel,
      title: "No disputes filed yet",
      description: "Be the first to use AI-powered arbitration. File a dispute to get started.",
      action: "File Your First Dispute",
      onClick: () => router.push("/file")
    },
    "no-evidence": {
      icon: FileText,
      title: "No evidence submitted",
      description: "Both parties can submit evidence to support their case. Add your first piece of evidence now.",
      action: "Submit Evidence",
      onClick: () => {}
    },
    "no-config": {
      icon: AlertCircle,
      title: "Contract not configured",
      description: "Set NEXT_PUBLIC_CONTRACT_ADDRESS in your .env.local file to connect to the smart contract.",
      action: "View Setup Guide",
      onClick: () => window.open("https://github.com/your-repo#setup", "_blank")
    }
  }

  const state = states[type]
  const Icon = state.icon

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="p-4 rounded-full bg-muted mb-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-2">{state.title}</h3>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          {state.description}
        </p>
        <Button onClick={state.onClick}>
          {state.action}
        </Button>
      </CardContent>
    </Card>
  )
}
