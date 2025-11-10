// Configuration
const RPC_URL = process.env.NEXT_PUBLIC_GENLAYER_RPC || 'http://localhost:8545'
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ''

// Store the client instance (set by WalletProvider)
let clientInstance: any | null = null
let walletType: 'metamask' | 'genlayer' | null = null

export function setClient(client: any) {
  clientInstance = client
}

export function getClient() {
  return clientInstance
}

export function setWalletType(type: 'metamask' | 'genlayer' | null) {
  walletType = type
}

export function getWalletType() {
  return walletType
}

// Helper for read-only contract calls (no wallet needed)
async function readContract(method: string, args: any[] = []) {
  const payload = {
    jsonrpc: '2.0',
    method: 'gl_readContract',
    params: [{
      address: CONTRACT_ADDRESS,
      method,
      args,
    }],
    id: Date.now(),
  }
  
  const response = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  
  if (!response.ok) {
    throw new Error(`RPC error: ${response.statusText}`)
  }
  
  const result = await response.json()
  
  if (result.error) {
    throw new Error(result.error.message || 'Contract call failed')
  }
  
  return result.result
}

// Helper for write contract calls (requires wallet)
async function writeContract(functionName: string, args: any[], value: number = 0) {
  // Check wallet type from localStorage if not set
  const currentWalletType = walletType || localStorage.getItem('wallet_type')
  
  if (currentWalletType === 'metamask') {
    return await writeContractMetaMask(functionName, args, value)
  } else if (currentWalletType === 'genlayer') {
    return await writeContractGenLayer(functionName, args, value)
  } else {
    throw new Error('Wallet not connected. Please connect your wallet first.')
  }
}

// GenLayer wallet write
async function writeContractGenLayer(functionName: string, args: any[], value: number = 0) {
  if (!clientInstance) {
    throw new Error('GenLayer wallet not connected.')
  }
  
  const hash = await clientInstance.writeContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    functionName,
    args,
    value,
  })
  
  // Wait for transaction to be finalized
  const receipt = await clientInstance.waitForTransactionReceipt({
    hash,
  })
  
  return receipt
}

// MetaMask wallet write using JSON-RPC
async function writeContractMetaMask(functionName: string, args: any[], value: number = 0) {
  if (!window.ethereum) {
    throw new Error('MetaMask not available')
  }

  const accounts = await window.ethereum.request({ method: 'eth_accounts' })
  if (!accounts || accounts.length === 0) {
    throw new Error('No MetaMask account connected')
  }

  // Use GenLayer's JSON-RPC for contract writes
  const payload = {
    jsonrpc: '2.0',
    method: 'gl_writeContract',
    params: [{
      from: accounts[0],
      address: CONTRACT_ADDRESS,
      method: functionName,
      args,
      value,
    }],
    id: Date.now(),
  }

  const response = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`RPC error: ${response.statusText}`)
  }

  const result = await response.json()

  if (result.error) {
    throw new Error(result.error.message || 'Contract write failed')
  }

  return result
}

// Contract interaction functions
export async function fileDispute(
  defendantAddress: string,
  caseDescription: string,
  evidenceUrls: string[],
  stakeAmount: number
) {
  try {
    const receipt = await writeContract(
      'file_dispute',
      [defendantAddress, caseDescription, evidenceUrls],
      stakeAmount
    )
    
    return {
      success: true,
      disputeId: receipt.result || 0,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to file dispute',
    }
  }
}

export async function submitEvidence(
  disputeId: number,
  evidenceType: string,
  content: string
) {
  try {
    const receipt = await writeContract(
      'submit_evidence',
      [disputeId, evidenceType, content]
    )
    
    return {
      success: true,
      evidenceId: receipt.result || 0,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to submit evidence',
    }
  }
}

export async function resolveDispute(disputeId: number) {
  try {
    const receipt = await writeContract(
      'resolve_dispute',
      [disputeId]
    )
    
    return {
      success: true,
      verdict: receipt.result,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to resolve dispute',
    }
  }
}

export async function finalizeVerdict(disputeId: number) {
  try {
    await writeContract(
      'finalize_verdict',
      [disputeId]
    )
    
    return {
      success: true,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to finalize verdict',
    }
  }
}

export async function appealVerdict(disputeId: number, appealReason: string) {
  try {
    await writeContract(
      'appeal_verdict',
      [disputeId, appealReason]
    )
    
    return {
      success: true,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to appeal verdict',
    }
  }
}

export async function getDispute(disputeId: number) {
  try {
    const result = await readContract('get_dispute', [disputeId])
    
    return {
      success: true,
      dispute: result,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to get dispute',
    }
  }
}

export async function getAllDisputes() {
  try {
    const result = await readContract('get_all_disputes', [])
    
    return {
      success: true,
      disputes: result || [],
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to get disputes',
      disputes: [],
    }
  }
}

export async function getDisputeEvidence(disputeId: number) {
  try {
    const result = await readContract('get_dispute_evidence', [disputeId])
    
    return {
      success: true,
      evidence: result || [],
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to get evidence',
      evidence: [],
    }
  }
}

export async function getStats() {
  try {
    const result = await readContract('get_stats', [])
    
    return {
      success: true,
      stats: result,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to get stats',
    }
  }
}

export async function getDisputesPaginated(offset: number, limit: number) {
  try {
    const result = await readContract('get_disputes_paginated', [offset, limit])
    
    return {
      success: true,
      data: result,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to get paginated disputes',
    }
  }
}

export async function checkHealth() {
  try {
    const startTime = Date.now()
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'net_version',
        params: [],
        id: Date.now(),
      }),
    })
    const latency = Date.now() - startTime
    
    if (!response.ok) {
      return {
        success: false,
        status: 'down',
        latency: 0,
      }
    }
    
    // Try to fetch stats as additional health check
    const stats = await getStats()
    
    return {
      success: true,
      status: latency < 1000 ? 'healthy' : 'degraded',
      latency,
      contractConfigured: stats.success && CONTRACT_ADDRESS !== '',
    }
  } catch (error) {
    return {
      success: false,
      status: 'down',
      latency: 0,
    }
  }
}

// Helper to check if contract is configured
export function isContractConfigured(): boolean {
  return CONTRACT_ADDRESS !== '' && CONTRACT_ADDRESS !== undefined
}

// Export config for debugging
export const config = {
  rpcUrl: RPC_URL,
  contractAddress: CONTRACT_ADDRESS,
}
