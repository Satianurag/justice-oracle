"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient, createAccount } from 'genlayer-js'
import { setClient as setGenlayerClient, setWalletType as setLibWalletType } from '@/lib/genlayer'

interface WalletContextType {
  account: any | null
  client: any | null
  address: string | null
  balance: number
  isConnected: boolean
  isLoading: boolean
  walletType: 'metamask' | 'genlayer' | null
  hasMetaMask: boolean
  connect: () => Promise<void>
  connectMetaMask: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<any | null>(null)
  const [client, setClient] = useState<any | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [walletType, setWalletType] = useState<'metamask' | 'genlayer' | null>(null)
  const [hasMetaMask, setHasMetaMask] = useState(false)

  const RPC_URL = process.env.NEXT_PUBLIC_GENLAYER_RPC || 'http://localhost:8545'

  useEffect(() => {
    // Check for MetaMask
    if (typeof window !== 'undefined' && window.ethereum) {
      setHasMetaMask(true)
    }

    // Try to restore session from localStorage
    const savedWalletType = localStorage.getItem('wallet_type')
    const savedPrivateKey = localStorage.getItem('genlayer_wallet_key')
    const savedMetaMaskAddress = localStorage.getItem('metamask_address')
    
    if (savedWalletType === 'metamask' && savedMetaMaskAddress) {
      reconnectMetaMask(savedMetaMaskAddress)
    } else if (savedWalletType === 'genlayer' && savedPrivateKey) {
      reconnect(savedPrivateKey)
    }
  }, [])

  const reconnect = async (accountData: string) => {
    try {
      setIsLoading(true)
      const parsedAccount = JSON.parse(accountData)
      const newClient = createClient({
        chain: {
          id: 1,
          name: 'GenLayer Simulator',
          rpcUrls: {
            default: { http: [RPC_URL] },
          },
          nativeCurrency: {
            name: 'GenLayer',
            symbol: 'GEN',
            decimals: 18,
          },
        },
        account: parsedAccount,
      })

      setAccount(parsedAccount)
      setClient(newClient)
      setAddress(parsedAccount.address)
      
      // Set client in genlayer SDK
      setGenlayerClient(newClient)
      
      // Fetch balance
      await fetchBalance(newClient, parsedAccount.address)
    } catch (error) {
      console.error('Failed to reconnect wallet:', error)
      disconnect()
    } finally {
      setIsLoading(false)
    }
  }

  const connect = async () => {
    try {
      setIsLoading(true)
      
      // Create new account
      const newAccount = createAccount()
      
      // Create client
      const newClient = createClient({
        chain: {
          id: 1,
          name: 'GenLayer Simulator',
          rpcUrls: {
            default: { http: [RPC_URL] },
          },
          nativeCurrency: {
            name: 'GenLayer',
            symbol: 'GEN',
            decimals: 18,
          },
        },
        account: newAccount,
      })

      setAccount(newAccount)
      setClient(newClient)
      setAddress(newAccount.address)

      // Set client in genlayer SDK
      setGenlayerClient(newClient)

      // Save account to localStorage for session persistence
      localStorage.setItem('genlayer_wallet_key', JSON.stringify(newAccount))
      localStorage.setItem('wallet_type', 'genlayer')
      setWalletType('genlayer')
      setLibWalletType('genlayer') // Sync with genlayer lib

      // Fetch balance
      await fetchBalance(newClient, newAccount.address)
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed')
    }

    try {
      setIsLoading(true)
      
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const metamaskAddress = accounts[0]
      setAddress(metamaskAddress)
      setWalletType('metamask')
      setLibWalletType('metamask') // Sync with genlayer lib
      
      // Save to localStorage
      localStorage.setItem('wallet_type', 'metamask')
      localStorage.setItem('metamask_address', metamaskAddress)

      // Fetch balance
      await fetchBalance(null, metamaskAddress)

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect()
        } else {
          setAddress(accounts[0])
          localStorage.setItem('metamask_address', accounts[0])
          fetchBalance(null, accounts[0])
        }
      })
    } catch (error) {
      console.error('Failed to connect MetaMask:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const reconnectMetaMask = async (savedAddress: string) => {
    if (!window.ethereum) {
      disconnect()
      return
    }

    try {
      setIsLoading(true)
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      
      if (accounts && accounts.length > 0 && accounts[0].toLowerCase() === savedAddress.toLowerCase()) {
        setAddress(accounts[0])
        setWalletType('metamask')
        setLibWalletType('metamask') // Sync with genlayer lib
        await fetchBalance(null, accounts[0])
      } else {
        disconnect()
      }
    } catch (error) {
      console.error('Failed to reconnect MetaMask:', error)
      disconnect()
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = () => {
    setAccount(null)
    setClient(null)
    setAddress(null)
    setBalance(0)
    setWalletType(null)
    setLibWalletType(null) // Sync with genlayer lib
    setGenlayerClient(null)
    localStorage.removeItem('genlayer_wallet_key')
    localStorage.removeItem('wallet_type')
    localStorage.removeItem('metamask_address')
  }

  const fetchBalance = async (clientInstance: any, addr: string) => {
    try {
      // Fetch balance using RPC call
      const response = await fetch(RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBalance',
          params: [addr, 'latest'],
          id: Date.now(),
        }),
      })

      const data = await response.json()
      if (data.result) {
        // Convert from hex to decimal, then from wei to tokens
        const balanceWei = parseInt(data.result, 16)
        const balanceTokens = balanceWei / 1e18
        setBalance(balanceTokens)
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error)
      setBalance(0)
    }
  }

  const value: WalletContextType = {
    account,
    client,
    address,
    balance,
    isConnected: !!address && (!!account || walletType === 'metamask'),
    isLoading,
    walletType,
    hasMetaMask,
    connect,
    connectMetaMask,
    disconnect,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet(): WalletContextType {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
