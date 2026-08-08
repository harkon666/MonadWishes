import React, { useState, useEffect } from 'react'
import { useWallets } from '@privy-io/react-auth'
import { AlertTriangle, RefreshCw, CheckCircle } from 'lucide-react'
import { monadTestnet } from '../config/monad'

export default function NetworkSwitchBanner() {
  const { wallets } = useWallets()
  const [isWrongNetwork, setIsWrongNetwork] = useState(false)
  const [currentChainId, setCurrentChainId] = useState<number | null>(null)
  const [isSwitching, setIsSwitching] = useState(false)
  const [switchError, setSwitchError] = useState<string | null>(null)

  const activeWallet = wallets && wallets.length > 0 ? wallets[0] : null

  useEffect(() => {
    if (!activeWallet) {
      setIsWrongNetwork(false)
      setCurrentChainId(null)
      return
    }

    let rawChainId: string | number = activeWallet.chainId
    if (typeof rawChainId === 'string' && rawChainId.startsWith('eip155:')) {
      rawChainId = rawChainId.replace('eip155:', '')
    }

    const numericChainId = typeof rawChainId === 'string' && rawChainId.startsWith('0x')
      ? parseInt(rawChainId, 16)
      : Number(rawChainId)

    setCurrentChainId(numericChainId)
    setIsWrongNetwork(numericChainId !== monadTestnet.id)
  }, [activeWallet, activeWallet?.chainId])

  const handleSwitchNetwork = async () => {
    if (!activeWallet) return
    setIsSwitching(true)
    setSwitchError(null)

    try {
      await activeWallet.switchChain(monadTestnet.id)
      setIsWrongNetwork(false)
    } catch (err: any) {
      console.error('Failed to switch network:', err)
      setSwitchError(err?.message || 'Please confirm network switch prompt in your wallet.')
    } finally {
      setIsSwitching(false)
    }
  }

  if (!activeWallet || !isWrongNetwork) return null

  return (
    <div className="w-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border-b border-amber-500/30 px-4 py-3 text-amber-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-semibold text-white">Wrong Network Detected: </span>
            <span>
              Your wallet is connected to Chain ID <code className="bg-black/40 px-1.5 py-0.5 rounded text-amber-300 font-mono">{currentChainId || 'Unknown'}</code>.
              MonadWishes transactions require <span className="font-medium text-purple-300">Monad Testnet (Chain ID 10143)</span>.
            </span>
            {switchError && (
              <p className="text-xs text-red-300 mt-1 font-medium">{switchError}</p>
            )}
          </div>
        </div>

        <button
          onClick={handleSwitchNetwork}
          disabled={isSwitching}
          className="shrink-0 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-lg shadow-lg shadow-purple-900/30 flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSwitching ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Switching Network...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Switch to Monad Testnet</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
