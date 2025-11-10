"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { FileText, Plus, X } from "lucide-react"
import { toast } from "sonner"
import { fileDispute, isContractConfigured } from "@/lib/genlayer"

interface FileDisputeFormProps {
  onDisputeFiled: (disputeId: number) => void
}

export function FileDisputeForm({ onDisputeFiled }: FileDisputeFormProps) {
  const [defendant, setDefendant] = useState("")
  const [caseDescription, setCaseDescription] = useState("")
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([""])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addEvidenceUrl = () => {
    setEvidenceUrls([...evidenceUrls, ""])
  }

  const removeEvidenceUrl = (index: number) => {
    setEvidenceUrls(evidenceUrls.filter((_, i) => i !== index))
  }

  const updateEvidenceUrl = (index: number, value: string) => {
    const newUrls = [...evidenceUrls]
    newUrls[index] = value
    setEvidenceUrls(newUrls)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!defendant || defendant.length < 10) {
      toast.error("Invalid defendant address", {
        description: "Please enter a valid GenLayer address"
      })
      return
    }

    if (caseDescription.length < 50) {
      toast.error("Description too short", {
        description: "Case description must be at least 50 characters"
      })
      return
    }

    const validUrls = evidenceUrls.filter(url => url.trim() !== "")
    if (validUrls.length === 0) {
      toast.error("Missing evidence", {
        description: "Please provide at least one evidence URL"
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
      toast.loading("Filing dispute on-chain...", { id: "file-dispute" })
      
      const result = await fileDispute(
        defendant,
        caseDescription,
        validUrls,
        10 // Min stake - super affordable!
      )
      
      if (result.success) {
        toast.success("Dispute filed successfully!", {
          id: "file-dispute",
          description: `Dispute #${result.disputeId} created. Status: Evidence Gathering`
        })
        
        onDisputeFiled(result.disputeId)
        
        // Reset form
        setDefendant("")
        setCaseDescription("")
        setEvidenceUrls([""])
      } else {
        toast.error("Failed to file dispute", {
          id: "file-dispute",
          description: result.error
        })
      }
    } catch (err: any) {
      toast.error("Failed to file dispute", {
        id: "file-dispute",
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
          <FileText className="h-5 w-5" />
          File New Dispute
        </CardTitle>
        <CardDescription>
          Submit a dispute for AI-powered resolution. Provide detailed case description and evidence URLs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Defendant Address */}
          <div className="space-y-2">
            <Label htmlFor="defendant">Defendant Address</Label>
            <Input
              id="defendant"
              placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
              value={defendant}
              onChange={(e) => setDefendant(e.target.value)}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              GenLayer address of the other party in the dispute
            </p>
          </div>

          {/* Case Description */}
          <div className="space-y-2">
            <Label htmlFor="case">Case Description (min 50 characters)</Label>
            <Textarea
              id="case"
              placeholder="Describe the dispute in detail. Include: what was agreed, what went wrong, timeline of events, and what resolution you're seeking..."
              value={caseDescription}
              onChange={(e) => setCaseDescription(e.target.value)}
              disabled={isSubmitting}
              rows={8}
              className="resize-none"
            />
            <div className="flex justify-between text-xs">
              <p className="text-muted-foreground">
                Be specific and include all relevant details
              </p>
              <span className={caseDescription.length < 50 ? "text-red-500" : "text-green-600"}>
                {caseDescription.length} / 50
              </span>
            </div>
          </div>

          {/* Evidence URLs */}
          <div className="space-y-2">
            <Label>Evidence URLs</Label>
            <div className="space-y-3">
              {evidenceUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="https://github.com/project/issues"
                    value={url}
                    onChange={(e) => updateEvidenceUrl(index, e.target.value)}
                    disabled={isSubmitting}
                    className="flex-1"
                  />
                  {evidenceUrls.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeEvidenceUrl(index)}
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEvidenceUrl}
                disabled={isSubmitting}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Evidence URL
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              URLs will be scraped by the AI to gather evidence (GitHub, chat logs, documents, etc.)
            </p>
          </div>

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
                Filing Dispute...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                File Dispute
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Stake: 100 tokens • Platform fee: 2% on resolution
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
