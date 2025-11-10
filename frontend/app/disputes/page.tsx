"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DisputesTablePaginated } from "@/components/disputes-table-paginated"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DisputeDetailsDialog } from "@/components/dispute-details-dialog"
import { EmptyState } from "@/components/empty-state"
import { isContractConfigured } from "@/lib/genlayer"

export default function DisputesPage() {
  const router = useRouter()
  const [selectedDispute, setSelectedDispute] = useState<number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  
  function handleViewDetails(disputeId: number) {
    setSelectedDispute(disputeId)
    setDialogOpen(true)
  }
  
  function handleSubmitEvidence(disputeId: number) {
    setSelectedDispute(disputeId)
    setDialogOpen(true)
  }
  
  function handleAppeal(disputeId: number) {
    setSelectedDispute(disputeId)
    setDialogOpen(true)
  }
  
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Disputes</h2>
          <p className="text-sm text-muted-foreground">
            Manage and resolve disputes with AI-powered arbitration
          </p>
        </div>
        <Button onClick={() => router.push('/file')}>
          <Plus className="h-4 w-4 mr-2" />
          File Dispute
        </Button>
      </div>
      
      
      <Card>
        <CardHeader>
          <CardTitle>Active Disputes</CardTitle>
          <CardDescription>
            Click on actions menu to view details, submit evidence, or appeal
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isContractConfigured() ? (
            <EmptyState type="no-config" />
          ) : (
            <DisputesTablePaginated 
              onViewDetails={handleViewDetails}
              onSubmitEvidence={handleSubmitEvidence}
              onAppeal={handleAppeal}
            />
          )}
        </CardContent>
      </Card>
      
      <DisputeDetailsDialog
        disputeId={selectedDispute}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onUpdate={() => {
          // Refresh disputes table
          window.location.reload()
        }}
      />
    </div>
  )
}
