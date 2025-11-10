"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { FileText, User, Scale, Brain, TrendingUp, ExternalLink, AlertTriangle } from "lucide-react"
import { getDispute, getDisputeEvidence, appealVerdict } from "@/lib/genlayer"
import { toast } from "sonner"
import { SubmitEvidenceForm } from "./submit-evidence-form"

interface DisputeDetailsDialogProps {
  disputeId: number | null
  open: boolean
  onClose: () => void
  onUpdate?: () => void
}

export function DisputeDetailsDialog({ disputeId, open, onClose, onUpdate }: DisputeDetailsDialogProps) {
  const [dispute, setDispute] = useState<any>(null)
  const [evidence, setEvidence] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [appealing, setAppealing] = useState(false)
  
  useEffect(() => {
    if (open && disputeId !== null) {
      loadDisputeDetails()
    }
  }, [open, disputeId])
  
  async function loadDisputeDetails() {
    if (disputeId === null) return
    
    setLoading(true)
    try {
      const [disputeResult, evidenceResult] = await Promise.all([
        getDispute(disputeId),
        getDisputeEvidence(disputeId)
      ])
      
      if (disputeResult.success) {
        setDispute(disputeResult.dispute)
      }
      if (evidenceResult.success) {
        setEvidence(evidenceResult.evidence)
      }
    } catch (error: any) {
      toast.error("Failed to load dispute details", {
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }
  
  async function handleAppeal() {
    if (!dispute || disputeId === null) return
    
    setAppealing(true)
    try {
      const result = await appealVerdict(disputeId, "Requesting appeal due to new evidence and procedural concerns")
      
      if (result.success) {
        toast.success("Appeal filed successfully", {
          description: "The dispute will be re-evaluated"
        })
        onUpdate?.()
        onClose()
      } else {
        toast.error("Failed to file appeal", {
          description: result.error
        })
      }
    } catch (error: any) {
      toast.error("Appeal failed", {
        description: error.message
      })
    } finally {
      setAppealing(false)
    }
  }
  
  if (disputeId === null) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Dispute #{dispute.dispute_id} Details
          </DialogTitle>
          <DialogDescription>
            Complete dispute information and AI resolution
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Case Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Case Description</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {dispute.case_description}
              </p>
            </div>

            <Separator />

            {/* Parties */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-indigo-600" />
                  <h3 className="font-semibold text-sm">Plaintiff</h3>
                </div>
                <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                  {dispute.plaintiff}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-600" />
                  <h3 className="font-semibold text-sm">Defendant</h3>
                </div>
                <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                  {dispute.defendant}
                </p>
              </div>
            </div>

            <Separator />

            {/* Evidence URLs */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Evidence URLs</h3>
              </div>
              <div className="space-y-2">
                {dispute.evidence_urls.map((url: string, index: number) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-indigo-600 hover:underline font-mono bg-indigo-50 dark:bg-indigo-950/20 p-2 rounded break-all"
                  >
                    {url}
                  </a>
                ))}
              </div>
            </div>

            {dispute.status === "resolved" && (
              <>
                <Separator />

                {/* Verdict */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">AI Verdict</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-xs text-green-900 dark:text-green-100 mb-1">Verdict</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {dispute.verdict.replace("_", " ").toUpperCase()}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/20 dark:to-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-3 w-3 text-indigo-600" />
                        <p className="text-xs text-indigo-900 dark:text-indigo-100">Confidence</p>
                      </div>
                      <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        {dispute.confidence}%
                      </p>
                    </div>
                  </div>

                  {/* Distribution */}
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <p className="text-xs font-semibold">Recommended Distribution</p>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Plaintiff</p>
                        <p className="text-2xl font-bold text-indigo-600">{dispute.plaintiff_distribution}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Defendant</p>
                        <p className="text-2xl font-bold text-purple-600">{dispute.defendant_distribution}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* AI Reasoning */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">AI Reasoning</h3>
                  </div>
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {dispute.reasoning}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    ✓ Validated by multi-LLM consensus with 8-point quality checks
                  </p>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {dispute.status === "resolved" && (
            <Button variant="destructive">
              Appeal Verdict
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
