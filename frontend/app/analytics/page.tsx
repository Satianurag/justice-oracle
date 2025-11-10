"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Activity, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { getAllDisputes, getStats, isContractConfigured } from "@/lib/genlayer"

export default function AnalyticsPage() {
  const [disputes, setDisputes] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadData()
  }, [])
  
  async function loadData() {
    if (!isContractConfigured()) {
      setLoading(false)
      return
    }
    
    try {
      const [disputesResult, statsResult] = await Promise.all([
        getAllDisputes(),
        getStats()
      ])
      
      if (disputesResult.success) {
        setDisputes(disputesResult.disputes)
      }
      if (statsResult.success) {
        setStats(statsResult.stats)
      }
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const resolvedCount = disputes.filter(d => d.status === "resolved").length
  const pendingCount = disputes.filter(d => d.status === "evidence_gathering").length
  const appealedCount = disputes.filter(d => d.status === "resolved_pending_appeal").length
  
  const plaintiffWins = disputes.filter(d => d.verdict === "plaintiff_wins").length
  const defendantWins = disputes.filter(d => d.verdict === "defendant_wins").length
  const splitRulings = disputes.filter(d => d.verdict === "split_ruling").length
  
  const resolutionRate = disputes.length > 0 ? (resolvedCount / disputes.length) * 100 : 0
  
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">
          Platform metrics and dispute resolution insights
        </p>
      </div>
      
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            {resolutionRate >= 50 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{resolutionRate.toFixed(1)}%</div>
                <Progress value={resolutionRate} className="mt-2 h-1" />
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Disputes</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{pendingCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Gathering evidence</p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{resolvedCount}</div>
                <p className="text-xs text-muted-foreground mt-1">AI verdicts issued</p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Appeal</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-amber-600">{appealedCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Appeal window open</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Verdict Distribution */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Verdict Distribution</CardTitle>
            <CardDescription>
              Breakdown of AI resolution outcomes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="default">Plaintiff Wins</Badge>
                  <span className="text-sm text-muted-foreground">{plaintiffWins} cases</span>
                </div>
                <span className="text-sm font-medium">
                  {disputes.length > 0 ? ((plaintiffWins / disputes.length) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <Progress 
                value={disputes.length > 0 ? (plaintiffWins / disputes.length) * 100 : 0} 
                className="h-2"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Defendant Wins</Badge>
                  <span className="text-sm text-muted-foreground">{defendantWins} cases</span>
                </div>
                <span className="text-sm font-medium">
                  {disputes.length > 0 ? ((defendantWins / disputes.length) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <Progress 
                value={disputes.length > 0 ? (defendantWins / disputes.length) * 100 : 0} 
                className="h-2"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Split Rulings</Badge>
                  <span className="text-sm text-muted-foreground">{splitRulings} cases</span>
                </div>
                <span className="text-sm font-medium">
                  {disputes.length > 0 ? ((splitRulings / disputes.length) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <Progress 
                value={disputes.length > 0 ? (splitRulings / disputes.length) * 100 : 0} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Platform Stats</CardTitle>
            <CardDescription>
              Key metrics and configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Evidence</span>
              <span className="text-lg font-semibold">{stats?.total_evidence_submitted || 0}</span>
            </div>
            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Min Stake</span>
              <span className="text-lg font-semibold">{stats?.min_stake || 100} tokens</span>
            </div>
            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Platform Fee</span>
              <span className="text-lg font-semibold">{stats?.platform_fee_percent || 2}%</span>
            </div>
            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Disputes</span>
              <span className="text-lg font-semibold">{stats?.total_disputes || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {!isContractConfigured() && (
        <Card className="border-dashed">
          <CardContent className="flex items-center justify-center py-10">
            <div className="text-center">
              <XCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Contract Not Configured</h3>
              <p className="text-sm text-muted-foreground">
                Set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local to view analytics
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

