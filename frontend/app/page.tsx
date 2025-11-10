"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DisputesTablePaginated } from "@/components/disputes-table-paginated"
import { Scale, TrendingUp, Users, CheckCircle2, Gavel, Clock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { getStats, isContractConfigured, getAllDisputes } from "@/lib/genlayer"
import { useRouter } from "next/navigation"
import { EmptyState } from "@/components/empty-state"

export default function Home() {
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [disputes, setDisputes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDispute, setSelectedDispute] = useState<number | null>(null)
  
  useEffect(() => {
    loadData()
  }, [])
  
  async function loadData() {
    if (!isContractConfigured()) {
      setLoading(false)
      return
    }
    
    try {
      const [statsResult, disputesResult] = await Promise.all([
        getStats(),
        getAllDisputes()
      ])
      
      if (statsResult.success) {
        setStats(statsResult.stats)
      }
      if (disputesResult.success) {
        setDisputes(disputesResult.disputes)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const activeDisputes = disputes.filter(d => d.status === "evidence_gathering").length
  const resolvedCount = disputes.filter(d => d.status === "resolved" || d.status === "resolved_pending_appeal").length
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Gavel className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight">Justice Oracle</h1>
          </div>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl">
            AI-powered decentralized arbitration • Fair • Transparent • On-chain
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-4 md:mt-6">
            <div className="bg-card rounded-lg px-4 py-2 border">
              <p className="text-xs md:text-sm text-muted-foreground">Active Disputes</p>
              <p className="text-xl md:text-2xl font-bold text-primary">{activeDisputes}</p>
            </div>
            <div className="bg-card rounded-lg px-4 py-2 border">
              <p className="text-xs md:text-sm text-muted-foreground">Total Resolved</p>
              <p className="text-xl md:text-2xl font-bold text-green-600">{resolvedCount}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Platform Metrics</h2>
      
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Disputes</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.total_disputes || 0}</div>
                <p className="text-xs text-muted-foreground">Filed on platform</p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evidence Submitted</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.total_evidence_submitted || 0}</div>
                <p className="text-xs text-muted-foreground">Total evidence items</p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Min Stake</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.min_stake || 100} tokens</div>
                <p className="text-xs text-muted-foreground">Required to file</p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Fee</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.platform_fee_percent || 2}%</div>
                <p className="text-xs text-muted-foreground">Of stake amount</p>
              </>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Disputes</CardTitle>
              <CardDescription>
                Latest disputes filed on the platform
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {!isContractConfigured() ? (
            <EmptyState type="no-config" />
          ) : disputes.length === 0 ? (
            <EmptyState type="no-disputes" />
          ) : (
            <DisputesTablePaginated 
              onViewDetails={(id) => router.push(`/disputes?id=${id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
