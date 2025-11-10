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
import { FileText, User, Scale, Brain, TrendingUp, ExternalLink, AlertTriangle, CheckCircle2, Clock, Loader2 } from "lucide-react"
import { getDispute, getDisputeEvidence, appealVerdict, resolveDispute, finalizeVerdict } from "@/lib/genlayer"
import { toast } from "sonner"
import { SubmitEvidenceForm } from "./submit-evidence-form"
import { Textarea } from "@/components/ui/textarea"
import { ConfirmationDialog } from "./confirmation-dialog"

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
  const [showAppealForm, setShowAppealForm] = useState(false)
  const [appealReason, setAppealReason] = useState("")
  const [resolving, setResolving] = useState(false)
  const [finalizing, setFinalizing] = useState(false)
  const [showResolveConfirm, setShowResolveConfirm] = useState(false)
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false)
  
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
  
  async function handleResolve() {
    if (!dispute || disputeId === null) return
    
    setShowResolveConfirm(false)
    setResolving(true)
    toast.loading("Resolving dispute with AI analysis...", { id: "resolve" })
    try {
      const result = await resolveDispute(disputeId)
      
      if (result.success) {
        toast.success("Dispute resolved by AI", {
          id: "resolve",
          description: "Appeal window is now open"
        })
        await loadDisputeDetails()
        onUpdate?.()
      } else {
        toast.error("Failed to resolve dispute", {
          id: "resolve",
          description: result.error
        })
      }
    } catch (error: any) {
      toast.error("Resolution failed", {
        id: "resolve",
        description: error.message
      })
    } finally {
      setResolving(false)
    }
  }
  
  async function handleFinalize() {
    if (!dispute || disputeId === null) return
    
    setFinalizing(true)
    toast.loading("Finalizing verdict and distributing funds...", { id: "finalize" })
    try {
      const result = await finalizeVerdict(disputeId)
      
      if (result.success) {
        toast.success("Verdict finalized", {
          id: "finalize",
          description: "Funds have been distributed"
        })
        await loadDisputeDetails()
        onUpdate?.()
      } else {
        toast.error("Failed to finalize", {
          id: "finalize",
          description: result.error
        })
      }
    } catch (error: any) {
      toast.error("Finalization failed", {
        id: "finalize",
        description: error.message
      })
    } finally {
      setFinalizing(false)
    }
  }
  
  async function handleAppeal() {
    if (!dispute || disputeId === null || !appealReason || appealReason.length < 100) {
      toast.error("Appeal reason must be at least 100 characters")
      return
    }
    
    setAppealing(true)
    toast.loading("Filing appeal...", { id: "appeal" })
    try {
      const result = await appealVerdict(disputeId, appealReason)
      
      if (result.success) {
        toast.success("Appeal filed successfully", {
          id: "appeal",
          description: "The dispute will be re-evaluated"
        })
        setShowAppealForm(false)
        setAppealReason("")
        await loadDisputeDetails()
        onUpdate?.()
      } else {
        toast.error("Failed to file appeal", {
          id: "appeal",
          description: result.error
        })
      }
    } catch (error: any) {
      toast.error("Appeal failed", {
        id: "appeal",
        description: error.message
      })
    } finally {
      setAppealing(false)
    }
  }
  
  function getStatusBadge(status: string) {
    switch (status) {
      case "evidence_gathering":
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />Evidence Gathering</Badge>
      case "resolved_pending_appeal":
        return <Badge variant="outline" className="gap-1 border-amber-500 text-amber-700"><AlertTriangle className="h-3 w-3" />Pending Appeal</Badge>
      case "resolved":
        return <Badge variant="default" className="gap-1 bg-green-600"><CheckCircle2 className="h-3 w-3" />Resolved</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }
  
  if (disputeId === null) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Dispute #{disputeId}
            </DialogTitle>
            {dispute && getStatusBadge(dispute.status)}
          </div>
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

            {/* Status & Actions Info */}
            <div className="bg-muted/50 border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                {dispute && getStatusBadge(dispute.status)}
              </div>
              {dispute?.status === "evidence_gathering" && (
                <p className="text-xs text-muted-foreground">
                  Both parties can submit evidence. Anyone can trigger AI resolution after evidence period.
                </p>
              )}
              {dispute?.status === "resolved_pending_appeal" && (
                <p className="text-xs text-muted-foreground">
                  Verdict reached. Appeal window open. After deadline, anyone can finalize to distribute funds.
                </p>
              )}
              {dispute?.status === "resolved" && (
                <p className="text-xs text-green-600">
                  ✓ Dispute finalized. Funds distributed according to verdict.
                </p>
              )}
            </div>

            {(dispute.status === "resolved" || dispute.status === "resolved_pending_appeal") && (
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

        {showAppealForm && dispute?.status === "resolved_pending_appeal" && (
          <div className="space-y-2 p-4 border-t">
            <label className="text-sm font-medium">Appeal Reason (min 100 characters)</label>
            <Textarea
              placeholder="Explain why you believe the verdict should be reconsidered. Include specific concerns about the AI's analysis or new evidence..."
              value={appealReason}
              onChange={(e) => setAppealReason(e.target.value)}
              rows={4}
              disabled={appealing}
            />
            <div className="flex justify-between items-center">
              <span className={`text-xs ${appealReason.length < 100 ? 'text-red-500' : 'text-green-600'}`}>
                {appealReason.length} / 100
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setShowAppealForm(false)
                    setAppealReason("")
                  }}
                  disabled={appealing}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleAppeal}
                  disabled={appealing || appealReason.length < 100}
                >
                  {appealing && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                  Submit Appeal
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex gap-2">
            {dispute?.status === "evidence_gathering" && (
              <Button 
                onClick={() => setShowResolveConfirm(true)}
                disabled={resolving}
                className="bg-primary"
              >
                {resolving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Brain className="h-4 w-4 mr-2" />
                Resolve with AI
              </Button>
            )}
            {dispute?.status === "resolved_pending_appeal" && (
              <>
                <Button 
                  onClick={() => setShowFinalizeConfirm(true)}
                  disabled={finalizing}
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                >
                  {finalizing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Finalize & Distribute
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => setShowAppealForm(true)}
                  disabled={appealing}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Appeal Verdict
                </Button>
              </>
            )}
          </div>
        </div>

        <ConfirmationDialog
          open={showResolveConfirm}
          onOpenChange={setShowResolveConfirm}
          title="Resolve Dispute with AI?"
          description="This will trigger multi-LLM consensus to analyze all evidence and issue a verdict. The process may take a few minutes."
          onConfirm={handleResolve}
          confirmText="Resolve Now"
        />

        <ConfirmationDialog
          open={showFinalizeConfirm}
          onOpenChange={setShowFinalizeConfirm}
          title="Finalize Verdict?"
          description="This will distribute funds according to the AI verdict. This action is irreversible."
          onConfirm={handleFinalize}
          confirmText="Finalize & Distribute"
          variant="default"
        />
      </DialogContent>
    </Dialog>
  )
}
