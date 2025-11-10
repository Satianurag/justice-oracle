"use client"

import { useState, useEffect } from "react"
import { getDisputesPaginated } from "@/lib/genlayer"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"

interface DisputesTablePaginatedProps {
  onViewDetails?: (disputeId: number) => void
  onSubmitEvidence?: (disputeId: number) => void
  onAppeal?: (disputeId: number) => void
}

export function DisputesTablePaginated({
  onViewDetails,
  onSubmitEvidence,
  onAppeal,
}: DisputesTablePaginatedProps) {
  const [disputes, setDisputes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadDisputes()
  }, [page, pageSize])

  async function loadDisputes() {
    setLoading(true)
    try {
      const result = await getDisputesPaginated(page * pageSize, pageSize)
      if (result.success && result.data) {
        setDisputes(result.data.disputes)
        setTotal(result.data.total)
      }
    } catch (error) {
      console.error("Failed to load disputes:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDisputes = disputes.filter((dispute) => {
    const matchesStatus = statusFilter === "all" || dispute.status === statusFilter
    const matchesSearch =
      !searchQuery ||
      dispute.dispute_id.toString().includes(searchQuery) ||
      dispute.plaintiff.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.defendant.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const totalPages = Math.ceil(total / pageSize)

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by ID or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="evidence_gathering">Evidence Gathering</SelectItem>
            <SelectItem value="resolved_pending_appeal">Pending Appeal</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Plaintiff</TableHead>
              <TableHead>Defendant</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDisputes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No disputes found
                </TableCell>
              </TableRow>
            ) : (
              filteredDisputes.map((dispute) => (
                <TableRow key={dispute.dispute_id}>
                  <TableCell className="font-mono">{dispute.dispute_id}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {dispute.plaintiff.slice(0, 6)}...{dispute.plaintiff.slice(-4)}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {dispute.defendant.slice(0, 6)}...{dispute.defendant.slice(-4)}
                  </TableCell>
                  <TableCell>
                    {dispute.status === "evidence_gathering" ? (
                      <Badge variant="secondary">Evidence Gathering</Badge>
                    ) : dispute.status === "resolved_pending_appeal" ? (
                      <Badge variant="outline" className="border-amber-500 text-amber-700">Pending Appeal</Badge>
                    ) : dispute.status === "resolved" ? (
                      <Badge variant="default" className="bg-green-600">Resolved</Badge>
                    ) : (
                      <Badge variant="outline">{dispute.status}</Badge>
                    )}
                  </TableCell>
                  <TableCell>{new Date(dispute.created_at * 1000).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails?.(dispute.dispute_id)}
                    >
                      View
                    </Button>
                    {dispute.status === "evidence_gathering" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSubmitEvidence?.(dispute.dispute_id)}
                      >
                        Evidence
                      </Button>
                    )}
                    {dispute.status === "resolved_pending_appeal" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAppeal?.(dispute.dispute_id)}
                        className="border-amber-500 text-amber-700"
                      >
                        Actions
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, total)} of {total}
        </div>
        <div className="flex items-center gap-2">
          <Select value={pageSize.toString()} onValueChange={(v) => setPageSize(Number(v))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 / page</SelectItem>
              <SelectItem value="20">20 / page</SelectItem>
              <SelectItem value="50">50 / page</SelectItem>
              <SelectItem value="100">100 / page</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">
            Page {page + 1} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={page >= totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
