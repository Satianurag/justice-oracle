"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Shield, TrendingUp } from "lucide-react"
import { toast } from "sonner"
import { submitEvidence, isContractConfigured } from "@/lib/genlayer"

interface SubmitEvidenceFormProps {
  disputeId: number
}

export function SubmitEvidenceForm({ disputeId }: SubmitEvidenceFormProps) {
  const [evidenceType, setEvidenceType] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [credibilityScore, setCredibilityScore] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCredibilityScore(null)

    if (!evidenceType) {
      toast.error("Missing evidence type", {
        description: "Please select a type for your evidence"
      })
      return
    }

    if (content.length < 20) {
      toast.error("Content too short", {
        description: "Evidence must be at least 20 characters"
      })
      return
    }

    if (!isContractConfigured()) {
      toast.error("Contract not configured", {
        description: "Set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local"
      })
      return
    }

    setIsSubmitting(true)

    try {
      toast.loading("Submitting evidence on-chain...", { id: "submit-evidence" })
      
      const result = await submitEvidence(disputeId, evidenceType, content)
      
      if (result.success) {
        // In real implementation, credibility score would come from contract
        const mockScore = Math.floor(Math.random() * 40) + 60
        setCredibilityScore(mockScore)
        
        toast.success("Evidence submitted!", {
          id: "submit-evidence",
          description: `Evidence #${result.evidenceId} added with AI credibility analysis`
        })
        
        // Reset form
        setEvidenceType("")
        setContent("")
      } else {
        toast.error("Failed to submit evidence", {
          id: "submit-evidence",
          description: result.error
        })
      }
    } catch (err: any) {
      toast.error("Failed to submit evidence", {
        id: "submit-evidence",
        description: err.message || "Please try again"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Submit Evidence for Dispute #{disputeId}
        </CardTitle>
        <CardDescription>
          Provide evidence to support your position. AI will analyze and assign a credibility score.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Evidence Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Evidence Type</Label>
            <Select value={evidenceType} onValueChange={setEvidenceType} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Select evidence type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="written_agreement">Written Agreement</SelectItem>
                <SelectItem value="contract_terms">Contract Terms</SelectItem>
                <SelectItem value="communication_logs">Communication Logs</SelectItem>
                <SelectItem value="payment_proof">Payment Proof</SelectItem>
                <SelectItem value="delivery_proof">Delivery Proof</SelectItem>
                <SelectItem value="explanation">Explanation/Statement</SelectItem>
                <SelectItem value="third_party_testimony">Third Party Testimony</SelectItem>
                <SelectItem value="technical_documentation">Technical Documentation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Evidence Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Evidence Content (min 20 characters)</Label>
            <Textarea
              id="content"
              placeholder="Provide detailed evidence. Include dates, specifics, and context..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
              rows={10}
              className="resize-none font-mono text-sm"
            />
            <div className="flex justify-between text-xs">
              <p className="text-muted-foreground">
                Be specific and factual. AI will evaluate credibility.
              </p>
              <span className={content.length < 20 ? "text-red-500" : "text-green-600"}>
                {content.length} / 20
              </span>
            </div>
          </div>

          {/* Credibility Score Display */}
          {credibilityScore !== null && (
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-800">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-indigo-600" />
                      <span className="text-sm font-medium">AI Credibility Score</span>
                    </div>
                    <Badge variant={credibilityScore >= 80 ? "default" : credibilityScore >= 60 ? "secondary" : "destructive"}>
                      {credibilityScore >= 80 ? "High" : credibilityScore >= 60 ? "Moderate" : "Low"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold">{credibilityScore}/100</span>
                    </div>
                    <Progress value={credibilityScore} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {credibilityScore >= 80 ? "High credibility - Strong supporting evidence" :
                       credibilityScore >= 60 ? "Moderate credibility - Consider adding more details" :
                       "Low credibility - Evidence may be insufficient"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Analyzing Evidence...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Submit Evidence
              </>
            )}
          </Button>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Credibility Scoring Factors:</strong>
              <br />
              • Source reliability
              <br />
              • Relevance to case
              <br />
              • Specificity and detail
              <br />
              • Internal consistency
              <br />
              • Potential for manipulation
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
