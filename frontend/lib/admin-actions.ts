import { getClient, getWalletType } from "./genlayer"

// Helper for admin contract calls
async function adminWriteContract(functionName: string, args: any[]) {
  const walletType = getWalletType()
  const client = getClient()

  if (!client) {
    throw new Error('Wallet not connected')
  }

  if (walletType === 'genlayer') {
    const hash = await client.writeContract({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      functionName,
      args,
      value: 0,
    })

    const receipt = await client.waitForTransactionReceipt({ hash })
    return receipt
  } else {
    // MetaMask flow
    const payload = {
      jsonrpc: '2.0',
      method: 'gl_writeContract',
      params: [{
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        method: functionName,
        args,
        value: 0,
      }],
      id: Date.now(),
    }

    const response = await fetch(process.env.NEXT_PUBLIC_GENLAYER_RPC || '', {
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
}

export async function updateMinStake(newMinStake: number) {
  try {
    await adminWriteContract('update_min_stake', [newMinStake])
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updatePlatformFee(newFee: number) {
  try {
    await adminWriteContract('update_platform_fee', [newFee])
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateTreasury(newTreasury: string) {
  try {
    await adminWriteContract('update_treasury', [newTreasury])
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateEvidencePeriodBlocks(newBlocks: number) {
  try {
    await adminWriteContract('update_evidence_period_blocks', [newBlocks])
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateAppealPeriodBlocks(newBlocks: number) {
  try {
    await adminWriteContract('update_appeal_period_blocks', [newBlocks])
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function withdrawFees(amount: number) {
  try {
    await adminWriteContract('withdraw_fees', [amount])
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
