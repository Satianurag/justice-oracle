"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DisputesTable } from "@/components/disputes-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Plus, Filter } from "lucide-react"
import { DisputeDetailsDialog } from "@/components/dispute-details-dialog"

export default function DisputesPage() {
  const router = useRouter()
  const [selectedDispute, setSelectedDispute] = useState<number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  
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
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by ID or address..." className="pl-8" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="evidence_gathering">Evidence Gathering</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="appealed">Appealed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Disputes</CardTitle>
          <CardDescription>
            Click on actions menu to view details, submit evidence, or appeal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DisputesTable 
            onViewDetails={handleViewDetails}
            onSubmitEvidence={handleSubmitEvidence}
            onAppeal={handleAppeal}
          />
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
