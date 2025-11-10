"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Settings, DollarSign, Clock, Wallet, AlertTriangle, Loader2 } from "lucide-react"
import { getStats } from "@/lib/genlayer"
import { updateMinStake, updatePlatformFee, updateTreasury, updateEvidencePeriodBlocks, updateAppealPeriodBlocks, withdrawFees } from "@/lib/admin-actions"
import { toast } from "sonner"

export default function AdminPage() {
  const { address, isConnected } = useWallet()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Form states
  const [minStake, setMinStake] = useState("")
  const [platformFee, setPlatformFee] = useState("")
  const [treasury, setTreasury] = useState("")
  const [evidencePeriod, setEvidencePeriod] = useState("")
  const [appealPeriod, setAppealPeriod] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    setLoading(true)
    try {
      const result = await getStats()
      if (result.success) {
        setStats(result.stats)
        setMinStake(result.stats.min_stake.toString())
        setPlatformFee(result.stats.platform_fee_percent.toString())
        setTreasury(result.stats.treasury)
        setEvidencePeriod(result.stats.evidence_period_blocks.toString())
        setAppealPeriod(result.stats.appeal_period_blocks.toString())
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateMinStake() {
    setUpdating(true)
    toast.loading("Updating minimum stake...", { id: "update" })
    
    const result = await updateMinStake(parseInt(minStake))
    if (result.success) {
      toast.success("Minimum stake updated", { id: "update" })
      await loadStats()
    } else {
      toast.error("Failed to update", { id: "update", description: result.error })
    }
    setUpdating(false)
  }

  async function handleUpdateFee() {
    setUpdating(true)
    toast.loading("Updating platform fee...", { id: "update" })
    
    const result = await updatePlatformFee(parseInt(platformFee))
    if (result.success) {
      toast.success("Platform fee updated", { id: "update" })
      await loadStats()
    } else {
      toast.error("Failed to update", { id: "update", description: result.error })
    }
    setUpdating(false)
  }

  async function handleUpdateTreasury() {
    if (treasury.length !== 42 || !treasury.startsWith("0x")) {
      toast.error("Invalid address format")
      return
    }
    
    setUpdating(true)
    toast.loading("Updating treasury address...", { id: "update" })
    
    const result = await updateTreasury(treasury)
    if (result.success) {
      toast.success("Treasury address updated", { id: "update" })
      await loadStats()
    } else {
      toast.error("Failed to update", { id: "update", description: result.error })
    }
    setUpdating(false)
  }

  async function handleUpdateEvidencePeriod() {
    setUpdating(true)
    toast.loading("Updating evidence period...", { id: "update" })
    
    const result = await updateEvidencePeriodBlocks(parseInt(evidencePeriod))
    if (result.success) {
      toast.success("Evidence period updated", { id: "update" })
      await loadStats()
    } else {
      toast.error("Failed to update", { id: "update", description: result.error })
    }
    setUpdating(false)
  }

  async function handleUpdateAppealPeriod() {
    setUpdating(true)
    toast.loading("Updating appeal period...", { id: "update" })
    
    const result = await updateAppealPeriodBlocks(parseInt(appealPeriod))
    if (result.success) {
      toast.success("Appeal period updated", { id: "update" })
      await loadStats()
    } else {
      toast.error("Failed to update", { id: "update", description: result.error })
    }
    setUpdating(false)
  }

  async function handleWithdrawFees() {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error("Enter valid withdrawal amount")
      return
    }
    
    setUpdating(true)
    toast.loading("Withdrawing fees...", { id: "withdraw" })
    
    const result = await withdrawFees(parseFloat(withdrawAmount))
    if (result.success) {
      toast.success(`${withdrawAmount} tokens withdrawn to treasury`, { id: "withdraw" })
      setWithdrawAmount("")
    } else {
      toast.error("Failed to withdraw", { id: "withdraw", description: result.error })
    }
    setUpdating(false)
  }

  if (!isConnected) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Access Required
            </CardTitle>
            <CardDescription>
              Connect your wallet to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Only the contract admin can access this page
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Admin Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage platform settings and treasury
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Wallet className="h-3 w-3" />
          Admin
        </Badge>
      </div>

      {/* Current Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Current Platform Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Minimum Stake</Label>
              <p className="text-2xl font-bold">{stats?.min_stake || 0} tokens</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Platform Fee</Label>
              <p className="text-2xl font-bold">{stats?.platform_fee_percent || 0}%</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Total Disputes</Label>
              <p className="text-2xl font-bold">{stats?.total_disputes || 0}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Evidence Period</Label>
              <p className="text-2xl font-bold">{stats?.evidence_period_blocks || 0} blocks</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Appeal Period</Label>
              <p className="text-2xl font-bold">{stats?.appeal_period_blocks || 0} blocks</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Treasury Address</Label>
              <p className="text-sm font-mono">{stats?.treasury ? `${stats.treasury.slice(0, 6)}...${stats.treasury.slice(-4)}` : 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Update Min Stake */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Update Minimum Stake</CardTitle>
            <CardDescription>Set the minimum stake required to file a dispute (1-1000 tokens)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="minStake">Minimum Stake (tokens)</Label>
              <Input
                id="minStake"
                type="number"
                value={minStake}
                onChange={(e) => setMinStake(e.target.value)}
                placeholder="10"
                disabled={updating}
                min="1"
                max="1000"
              />
            </div>
            <Button 
              onClick={handleUpdateMinStake} 
              disabled={updating || !minStake}
              className="w-full"
            >
              {updating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Minimum Stake
            </Button>
          </CardContent>
        </Card>

        {/* Update Platform Fee */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Update Platform Fee</CardTitle>
            <CardDescription>Set the platform fee percentage (0-10%)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platformFee">Platform Fee (%)</Label>
              <Input
                id="platformFee"
                type="number"
                value={platformFee}
                onChange={(e) => setPlatformFee(e.target.value)}
                placeholder="1"
                disabled={updating}
                min="0"
                max="10"
              />
            </div>
            <Button 
              onClick={handleUpdateFee} 
              disabled={updating || !platformFee}
              className="w-full"
            >
              {updating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Platform Fee
            </Button>
          </CardContent>
        </Card>

        {/* Update Evidence Period */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Update Evidence Period
            </CardTitle>
            <CardDescription>Set evidence gathering period in blocks (1-10,000,000)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="evidencePeriod">Evidence Period (blocks)</Label>
              <Input
                id="evidencePeriod"
                type="number"
                value={evidencePeriod}
                onChange={(e) => setEvidencePeriod(e.target.value)}
                placeholder="50400"
                disabled={updating}
                min="1"
                max="10000000"
              />
              <p className="text-xs text-muted-foreground">
                ~{Math.round(parseInt(evidencePeriod || "0") * 12 / 86400)} days at 12s/block
              </p>
            </div>
            <Button 
              onClick={handleUpdateEvidencePeriod} 
              disabled={updating || !evidencePeriod}
              className="w-full"
            >
              {updating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Evidence Period
            </Button>
          </CardContent>
        </Card>

        {/* Update Appeal Period */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Update Appeal Period
            </CardTitle>
            <CardDescription>Set appeal window period in blocks (1-10,000,000)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="appealPeriod">Appeal Period (blocks)</Label>
              <Input
                id="appealPeriod"
                type="number"
                value={appealPeriod}
                onChange={(e) => setAppealPeriod(e.target.value)}
                placeholder="21600"
                disabled={updating}
                min="1"
                max="10000000"
              />
              <p className="text-xs text-muted-foreground">
                ~{Math.round(parseInt(appealPeriod || "0") * 12 / 86400)} days at 12s/block
              </p>
            </div>
            <Button 
              onClick={handleUpdateAppealPeriod} 
              disabled={updating || !appealPeriod}
              className="w-full"
            >
              {updating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Appeal Period
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Treasury Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Treasury Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Update Treasury Address */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="treasury">Treasury Address</Label>
                <Input
                  id="treasury"
                  value={treasury}
                  onChange={(e) => setTreasury(e.target.value)}
                  placeholder="0x..."
                  disabled={updating}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Address where platform fees are sent
                </p>
              </div>
              <Button 
                onClick={handleUpdateTreasury} 
                disabled={updating || !treasury}
                className="w-full"
              >
                {updating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Update Treasury Address
              </Button>
            </div>

            {/* Withdraw Fees */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdrawAmount">Withdraw Amount (tokens)</Label>
                <Input
                  id="withdrawAmount"
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="100"
                  disabled={updating}
                  min="0"
                />
                <p className="text-xs text-muted-foreground">
                  Withdraw accumulated platform fees
                </p>
              </div>
              <Button 
                onClick={handleWithdrawFees} 
                disabled={updating || !withdrawAmount}
                className="w-full"
                variant="default"
              >
                {updating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Withdraw to Treasury
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Admin Functions:</strong> These actions are restricted to the contract admin address. 
          Changes take effect immediately and are permanent on-chain.
        </AlertDescription>
      </Alert>
    </div>
  )
}
