"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, FileText, AlertTriangle } from "lucide-react"
import { getAllDisputes, isContractConfigured } from "@/lib/genlayer"
import { toast } from "sonner"

interface DisputesTableProps {
  onViewDetails?: (disputeId: number) => void
  onSubmitEvidence?: (disputeId: number) => void
  onAppeal?: (disputeId: number) => void
}

export function DisputesTable({ onViewDetails, onSubmitEvidence, onAppeal }: DisputesTableProps = {}) {
  const [disputes, setDisputes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadDisputes()
  }, [])
  
  async function loadDisputes() {
    if (!isContractConfigured()) {
      setLoading(false)
      return
    }
    
    try {
      const result = await getAllDisputes()
      if (result.success) {
        setDisputes(result.disputes)
      } else {
        toast.error("Failed to load disputes", {
          description: result.error
        })
      }
    } catch (error: any) {
      toast.error("Error loading disputes", {
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }
  
  if (!isContractConfigured()) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Contract not configured</p>
        <p className="text-sm mt-2">Set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local</p>
      </div>
    )
  }
  
  if (disputes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No disputes filed yet</p>
      </div>
    )
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Plaintiff</TableHead>
            <TableHead>Defendant</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Verdict</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {disputes.map((dispute) => (
            <TableRow key={dispute.dispute_id}>
              <TableCell className="font-medium">#{dispute.dispute_id}</TableCell>
              <TableCell className="font-mono text-xs">{dispute.plaintiff?.substring(0, 10)}...</TableCell>
              <TableCell className="font-mono text-xs">{dispute.defendant?.substring(0, 10)}...</TableCell>
              <TableCell>
                {dispute.status === "resolved" ? (
                  <Badge variant="default">Resolved</Badge>
                ) : dispute.status === "evidence_gathering" ? (
                  <Badge variant="secondary">Evidence Gathering</Badge>
                ) : dispute.status === "appealed" ? (
                  <Badge variant="destructive">Appealed</Badge>
                ) : (
                  <Badge variant="outline">{dispute.status}</Badge>
                )}
              </TableCell>
              <TableCell>
                {dispute.verdict === "plaintiff_wins" ? (
                  <span className="text-sm text-green-600 font-medium">Plaintiff Wins</span>
                ) : dispute.verdict === "defendant_wins" ? (
                  <span className="text-sm text-blue-600 font-medium">Defendant Wins</span>
                ) : dispute.verdict === "split_ruling" ? (
                  <span className="text-sm text-yellow-600 font-medium">Split Ruling</span>
                ) : (
                  <span className="text-sm text-muted-foreground">Pending</span>
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onViewDetails?.(dispute.dispute_id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    {dispute.status === "evidence_gathering" && onSubmitEvidence && (
                      <DropdownMenuItem onClick={() => onSubmitEvidence(dispute.dispute_id)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Submit Evidence
                      </DropdownMenuItem>
                    )}
                    {dispute.status === "resolved" && onAppeal && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => onAppeal(dispute.dispute_id)}>
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Appeal Verdict
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
