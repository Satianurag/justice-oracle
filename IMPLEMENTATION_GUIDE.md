# Justice Oracle - Remaining Implementation Guide

## ✅ Completed

### Contract Enhancements
- ✅ Treasury management with fee routing
- ✅ Timestamps (created_at, resolved_at, evidence_deadline, appeal_deadline)
- ✅ Admin controls (set_min_stake, set_platform_fee, set_treasury, transfer_admin)
- ✅ Pagination endpoint (get_disputes_paginated)
- ✅ Lifecycle enforcement (evidence deadline checks)

### Frontend Base
- ✅ SDK wrapper updates (pagination, health check)
- ✅ NetworkStatus component with real-time monitoring
- ✅ Enhanced sidebar with health indicator

---

## 🔨 Remaining Implementation

### 1. Enhanced File Dispute Form with Validation

**File:** `frontend/components/file-dispute-form-enhanced.tsx`

```typescript
"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { fileDispute, getStats } from "@/lib/genlayer"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, Loader2 } from "lucide-react"
import { toast } from "sonner"

// Validation schema
const formSchema = z.object({
  defendantAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format")
    .min(42, "Address must be 42 characters")
    .max(42, "Address must be 42 characters"),
  caseDescription: z
    .string()
    .min(50, "Case description must be at least 50 characters")
    .max(5000, "Case description too long (max 5000 characters)"),
  evidenceUrls: z
    .string()
    .refine((val) => {
      const urls = val.split("\n").filter((u) => u.trim())
      return urls.length <= 5
    }, "Maximum 5 evidence URLs allowed")
    .refine((val) => {
      const urls = val.split("\n").filter((u) => u.trim())
      return urls.every((url) => {
        try {
          const u = new URL(url)
          return u.protocol === "https:" || u.protocol === "http:"
        } catch {
          return false
        }
      })
    }, "All URLs must be valid HTTP/HTTPS URLs"),
  stakeAmount: z.number().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface FileDisputeFormProps {
  onDisputeFiled: (disputeId: number) => void
}

export function FileDisputeFormEnhanced({ onDisputeFiled }: FileDisputeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [minStake, setMinStake] = useState(10)
  const [platformFee, setPlatformFee] = useState(1)
  const [loadingStats, setLoadingStats] = useState(true)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      defendantAddress: "",
      caseDescription: "",
      evidenceUrls: "",
      stakeAmount: undefined,
    },
  })

  // Load dynamic min stake and fee from contract
  useEffect(() => {
    async function loadStats() {
      const result = await getStats()
      if (result.success && result.stats) {
        setMinStake(result.stats.min_stake)
        setPlatformFee(result.stats.platform_fee_percent)
        form.setValue("stakeAmount", result.stats.min_stake)
      }
      setLoadingStats(false)
    }
    loadStats()
  }, [form])

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)

    try {
      const urls = values.evidenceUrls
        .split("\n")
        .map((u) => u.trim())
        .filter((u) => u)

      toast.loading("Filing dispute on-chain...", { id: "file-dispute" })

      const result = await fileDispute(
        values.defendantAddress,
        values.caseDescription,
        urls,
        values.stakeAmount || minStake
      )

      if (result.success) {
        toast.success("Dispute filed successfully!", {
          id: "file-dispute",
          description: `Dispute #${result.disputeId} created. Evidence period started.`,
        })

        onDisputeFiled(result.disputeId)
        form.reset()
      } else {
        toast.error("Failed to file dispute", {
          id: "file-dispute",
          description: result.error,
        })
      }
    } catch (error: any) {
      toast.error("Unexpected error", {
        id: "file-dispute",
        description: error.message || "Please try again",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loadingStats) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    )
  }

  const totalCost = (values: FormValues) => {
    const stake = values.stakeAmount || minStake
    const fee = (stake * platformFee) / 100
    return stake + fee
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Required Stake:</strong> {minStake} tokens + {platformFee}% fee = {totalCost(form.watch())} tokens total
            </AlertDescription>
          </Alert>

          <FormField
            control={form.control}
            name="defendantAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Defendant Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="0x..."
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  Ethereum address of the party you're filing against
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="caseDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Case Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the dispute in detail (min 50 chars)..."
                    className="min-h-[150px]"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  {field.value.length}/5000 characters (min: 50)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="evidenceUrls"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Evidence URLs</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="https://example.com/evidence1&#10;https://example.com/evidence2"
                    className="min-h-[100px]"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  One URL per line (max 5 URLs). Must be HTTP/HTTPS.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stakeAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stake Amount (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={`${minStake}`}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={isSubmitting}
                    min={minStake}
                  />
                </FormControl>
                <FormDescription>
                  Minimum: {minStake} tokens. Higher stake shows commitment.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Filing Dispute...
              </>
            ) : (
              `File Dispute (${totalCost(form.watch())} tokens)`
            )}
          </Button>
        </Card>

        <Card className="border-dashed p-4">
          <div className="text-sm space-y-2">
            <p className="font-medium">Pre-submission Checklist</p>
            <ul className="text-muted-foreground space-y-1">
              <li>✓ Case description is clear and detailed</li>
              <li>✓ All evidence URLs are accessible</li>
              <li>✓ Defendant address is correct</li>
              <li>✓ You have sufficient tokens for stake + fee</li>
            </ul>
          </div>
        </Card>
      </form>
    </Form>
  )
}
```

### 2. Paginated Disputes Table

**File:** `frontend/components/disputes-table-paginated.tsx`

```typescript
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
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="appealed">Appealed</SelectItem>
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
                    <Badge variant={dispute.status === "resolved" ? "default" : "secondary"}>
                      {dispute.status}
                    </Badge>
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
                    {dispute.status === "resolved" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAppeal?.(dispute.dispute_id)}
                      >
                        Appeal
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
```

### 3. Enhanced Analytics Dashboard

**File:** `frontend/app/analytics/page.tsx` (Update existing)

Add these new features:
- Trend charts (disputes over time)
- Average resolution time
- Appeal rate percentage
- Confidence distribution chart
- Export to CSV functionality

### 4. Update Existing Components

**Replace in:** `frontend/app/file/page.tsx`
- Import and use `FileDisputeFormEnhanced` instead of `FileDisputeForm`

**Replace in:** `frontend/app/disputes/page.tsx`
- Import and use `DisputesTablePaginated` instead of `DisputesTable`

---

## 📝 Installation Commands

```bash
cd frontend

# Already installed:
# - zod
# - react-hook-form
# - @hookform/resolvers

# Add form component from shadcn:
npx shadcn@latest add form

# Add missing UI components if needed:
npx shadcn@latest add input textarea
```

---

## 🎯 Testing Checklist

After implementing:

1. **Form Validation**
   - [ ] Try invalid address format
   - [ ] Try < 50 char description
   - [ ] Try > 5 URLs
   - [ ] Try invalid URL format
   - [ ] Verify dynamic min stake loads

2. **Pagination**
   - [ ] Navigate through pages
   - [ ] Change page size
   - [ ] Filter by status
   - [ ] Search by address/ID

3. **Health Monitoring**
   - [ ] Check indicator shows correct status
   - [ ] Verify latency is displayed
   - [ ] Test auto-refresh (wait 30s)

4. **End-to-End**
   - [ ] File dispute with valid data
   - [ ] See it in paginated table
   - [ ] Submit evidence
   - [ ] Resolve dispute
   - [ ] Check analytics

---

## 🚀 Deploy Updated Contract

**Note:** Contract signature changed (`__init__` now requires `treasury_address`)

```python
# In GenLayer Studio, deploy with:
contract = JusticeOracle("0xYourTreasuryAddress")
```

Then update `.env.local` with new contract address.

---

## 📊 Summary of Improvements

| Category | Before | After |
|----------|--------|-------|
| **Contract** | Basic | Treasury, timestamps, pagination, admin controls |
| **Validation** | None | Full zod validation on all inputs |
| **UX** | Hardcoded values | Dynamic from contract stats |
| **Health** | Simple badge | Real-time monitoring with latency |
| **Pagination** | Load all disputes | Efficient paginated queries |
| **Filters** | Status only | Status + search + date |
| **Admin** | None | Full parameter management |

---

**Status:** Contract fully enhanced ✅ | Frontend 40% complete 🔨

**Next:** Implement the 3 components above, test thoroughly, redeploy contract with treasury address.
