"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { fileDispute, getStats } from "@/lib/genlayer"
import { useWallet } from "@/contexts/wallet-context"
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
  const { isConnected, address } = useWallet()
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

  if (!isConnected) {
    return (
      <Card className="p-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Wallet Required:</strong> Please connect your wallet to file a dispute.
          </AlertDescription>
        </Alert>
      </Card>
    )
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

          <Button type="submit" className="w-full" disabled={isSubmitting || !isConnected}>
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
