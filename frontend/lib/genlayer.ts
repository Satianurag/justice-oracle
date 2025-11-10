// Configuration
const RPC_URL = process.env.NEXT_PUBLIC_GENLAYER_RPC || 'http://localhost:8545'
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ''
const NETWORK = process.env.NEXT_PUBLIC_NETWORK || 'testnet'

// Simple fetch-based client for GenLayer contract calls
async function callContract(method: string, args: any[], options: { value?: number; write?: boolean } = {}) {
  const payload = {
    jsonrpc: '2.0',
    method: options.write ? 'gl_writeContract' : 'gl_readContract',
    params: [{
      address: CONTRACT_ADDRESS,
      method,
      args,
      ...(options.value ? { value: options.value } : {}),
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

// Contract interaction functions
export async function fileDispute(
  defendantAddress: string,
  caseDescription: string,
  evidenceUrls: string[],
  stakeAmount: number
) {
  try {
    const result = await callContract(
      'file_dispute',
      [defendantAddress, caseDescription, evidenceUrls],
      { value: stakeAmount, write: true }
    )
    
    return {
      success: true,
      disputeId: result,
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
    const result = await callContract(
      'submit_evidence',
      [disputeId, evidenceType, content],
      { write: true }
    )
    
    return {
      success: true,
      evidenceId: result,
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
    const result = await callContract(
      'resolve_dispute',
      [disputeId],
      { write: true }
    )
    
    return {
      success: true,
      verdict: result,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to resolve dispute',
    }
  }
}

export async function appealVerdict(disputeId: number, appealReason: string) {
  try {
    await callContract(
      'appeal_verdict',
      [disputeId, appealReason],
      { write: true }
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
    const result = await callContract('get_dispute', [disputeId])
    
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
    const result = await callContract('get_all_disputes', [])
    
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
    const result = await callContract('get_dispute_evidence', [disputeId])
    
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
    const result = await callContract('get_stats', [])
    
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

// Helper to check if contract is configured
export function isContractConfigured(): boolean {
  return CONTRACT_ADDRESS !== '' && CONTRACT_ADDRESS !== undefined
}

// Export config for debugging
export const config = {
  rpcUrl: RPC_URL,
  contractAddress: CONTRACT_ADDRESS,
  network: NETWORK,
}
