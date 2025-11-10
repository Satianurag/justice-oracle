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
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center mb-3">
            <div className="p-2 rounded bg-primary/10">
              <Scale className="h-6 w-6 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">
            Welcome to Justice Oracle
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            AI-powered decentralized arbitration on GenLayer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <div className="grid gap-2">
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="flex gap-2 items-start">
                  <div className="p-1.5 rounded bg-primary/10 shrink-0">
                    <Brain className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">AI-Powered Resolution</h3>
                    <p className="text-xs text-muted-foreground">
                      Multi-LLM consensus analyzes evidence and delivers fair verdicts
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="flex gap-2 items-start">
                  <div className="p-1.5 rounded bg-green-100 dark:bg-green-950 shrink-0">
                    <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Transparent & Immutable</h3>
                    <p className="text-xs text-muted-foreground">
                      All decisions stored on-chain with full audit trail
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="flex gap-2 items-start">
                  <div className="p-1.5 rounded bg-amber-100 dark:bg-amber-950 shrink-0">
                    <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Fast & Affordable</h3>
                    <p className="text-xs text-muted-foreground">
                      Only 10 tokens • 1% fee • Appeal mechanism
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-sm mb-2">How It Works</h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="shrink-0 text-xs h-5 w-5 p-0 flex items-center justify-center">1</Badge>
                <span className="text-muted-foreground">File dispute with evidence</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="shrink-0 text-xs h-5 w-5 p-0 flex items-center justify-center">2</Badge>
                <span className="text-muted-foreground">Submit additional evidence</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="shrink-0 text-xs h-5 w-5 p-0 flex items-center justify-center">3</Badge>
                <span className="text-muted-foreground">AI analyzes and issues verdict</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="shrink-0 text-xs h-5 w-5 p-0 flex items-center justify-center">4</Badge>
                <span className="text-muted-foreground">Appeal or finalize distribution</span>
              </div>
            </div>
          </div>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-xs font-medium">Connect your wallet to get started</p>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="pt-2">
          <Button onClick={handleClose} className="w-full" size="sm">
            Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
