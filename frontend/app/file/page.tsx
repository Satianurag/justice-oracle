"use client"

import { useRouter } from "next/navigation"
import { FileDisputeForm } from "@/components/file-dispute-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function FilePage() {
  const router = useRouter()
  
  function handleDisputeFiled(disputeId: number) {
    // Redirect to disputes page after filing
    setTimeout(() => {
      router.push('/disputes')
    }, 2000)
  }
  
  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">File New Dispute</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Submit your case for AI-powered arbitration
        </p>
      </div>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Required stake: Only 10 tokens! Super affordable. The AI will analyze all evidence and issue a fair verdict.
        </AlertDescription>
      </Alert>
      
      <FileDisputeForm onDisputeFiled={handleDisputeFiled} />
      
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">What happens next?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p><strong>1. Evidence Gathering:</strong> Both parties can submit additional evidence</p>
          <p><strong>2. AI Analysis:</strong> Multi-LLM consensus evaluates all evidence with credibility scoring</p>
          <p><strong>3. Resolution:</strong> Fair verdict issued with transparent reasoning</p>
          <p><strong>4. Distribution:</strong> Funds distributed based on the verdict</p>
        </CardContent>
      </Card>
    </div>
  )
}
