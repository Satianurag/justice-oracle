"use client"

import { useState } from 'react'
import { useWallet } from '@/contexts/wallet-context'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Wallet, Copy, LogOut, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function ConnectWalletButton() {
  const { address, balance, isConnected, isLoading, walletType, hasMetaMask, connect, connectMetaMask, disconnect } = useWallet()
  const [showWalletModal, setShowWalletModal] = useState(false)

  const handleConnectGenLayer = async () => {
    try {
      await connect()
      setShowWalletModal(false)
      toast.success('GenLayer wallet connected!')
    } catch (error: any) {
      toast.error('Failed to connect wallet', {
        description: error.message || 'Please try again',
      })
    }
  }

  const handleConnectMetaMask = async () => {
    try {
      await connectMetaMask()
      setShowWalletModal(false)
      toast.success('MetaMask connected successfully!')
    } catch (error: any) {
      toast.error('Failed to connect MetaMask', {
        description: error.message || 'Please install MetaMask extension',
      })
    }
  }

  const handleDisconnect = () => {
    disconnect()
    toast.info('Wallet disconnected')
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success('Address copied to clipboard!')
    }
  }

  if (isLoading) {
    return (
      <Button disabled variant="outline" size="default">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    )
  }

  if (!isConnected) {
    return (
      <>
        <Button onClick={() => setShowWalletModal(true)} variant="default" size="default">
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>

        <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect Wallet</DialogTitle>
              <DialogDescription>
                Choose how you want to connect to Justice Oracle
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 pt-4">
              {hasMetaMask && (
                <Button
                  onClick={handleConnectMetaMask}
                  variant="outline"
                  className="w-full justify-start h-auto py-4 px-4 hover:bg-orange-50 hover:border-orange-500"
                  disabled={isLoading}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.05 12.614c-.64-3.556-3.292-6.146-6.743-6.607L12 10.306l-3.307-4.3c-3.45.461-6.103 3.05-6.743 6.607l4.3 3.307v6.08h6.5v-6.08l4.3-3.307z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">MetaMask</div>
                      <div className="text-xs text-muted-foreground">Connect with MetaMask extension</div>
                    </div>
                  </div>
                </Button>
              )}
              <Button
                onClick={handleConnectGenLayer}
                variant="outline"
                className="w-full justify-start h-auto py-4 px-4 hover:bg-indigo-50 hover:border-indigo-500"
                disabled={isLoading}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">GenLayer Wallet</div>
                    <div className="text-xs text-muted-foreground">Create new wallet (stored locally)</div>
                  </div>
                </div>
              </Button>
              {!hasMetaMask && (
                <p className="text-xs text-center text-muted-foreground pt-2">
                  Don't have MetaMask? <a href="https://metamask.io/download" target="_blank" className="text-indigo-600 hover:underline">Install it here</a>
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="default">
          <Wallet className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline-block">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
          <span className="sm:hidden">
            {address?.slice(0, 4)}...
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          {walletType === 'metamask' ? (
            <>
              <div className="w-4 h-4 rounded-full bg-orange-500" />
              MetaMask
            </>
          ) : (
            <>
              <div className="w-4 h-4 rounded-full bg-indigo-500" />
              GenLayer
            </>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-sm text-muted-foreground">
          <div className="font-medium text-foreground mb-1">Balance</div>
          <div className="font-mono">{balance.toFixed(2)} GEN</div>
        </div>
        <div className="px-2 py-1.5 text-sm text-muted-foreground">
          <div className="font-medium text-foreground mb-1">Address</div>
          <div className="font-mono text-xs break-all">{address}</div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyAddress}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDisconnect} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
