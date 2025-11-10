"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Scale, Brain, Shield, Zap } from "lucide-react"

export function WelcomeDialog() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("justice-oracle-welcome-seen")
    if (!hasSeenWelcome) {
      setOpen(true)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem("justice-oracle-welcome-seen", "true")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded bg-black dark:bg-white">
              <Scale className="h-8 w-8 text-white dark:text-black" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Welcome to Justice Oracle
          </DialogTitle>
          <DialogDescription className="text-center">
            AI-powered decentralized arbitration on GenLayer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid gap-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-3 items-start">
                  <div className="p-2 rounded bg-muted shrink-0">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">AI-Powered Resolution</h3>
                    <p className="text-sm text-muted-foreground">
                      Multi-LLM consensus analyzes evidence and delivers fair verdicts with transparent reasoning
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-3 items-start">
                  <div className="p-2 rounded bg-muted shrink-0">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Transparent & Immutable</h3>
                    <p className="text-sm text-muted-foreground">
                      All decisions, reasoning, and evidence stored on-chain. Full audit trail guaranteed.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-3 items-start">
                  <div className="p-2 rounded bg-muted shrink-0">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Fast & Affordable</h3>
                    <p className="text-sm text-muted-foreground">
                      Only 10 tokens to file • 1% platform fee • Appeal mechanism included
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">How It Works</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="shrink-0">1</Badge>
                <span className="text-muted-foreground">File dispute with case description and evidence URLs</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="shrink-0">2</Badge>
                <span className="text-muted-foreground">Both parties submit additional evidence during gathering period</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="shrink-0">3</Badge>
                <span className="text-muted-foreground">AI analyzes all evidence and issues verdict with distribution</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="shrink-0">4</Badge>
                <span className="text-muted-foreground">Appeal window opens or finalize to distribute funds</span>
              </div>
            </div>
          </div>

          <Card className="bg-muted">
            <CardContent className="pt-6 text-center">
              <p className="text-sm font-medium mb-2">Ready to get started?</p>
              <p className="text-xs text-muted-foreground">
                Connect your wallet to file disputes or explore existing cases
              </p>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button onClick={handleClose} className="w-full">
            Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
