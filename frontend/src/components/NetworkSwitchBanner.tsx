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
    <div className="w-full bg-[#FFD600] border-b-4 border-black px-4 py-3 text-black shadow-[0_4px_0px_0px_#000]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white border-2 border-black rounded-lg text-black shrink-0 shadow-[2px_2px_0px_0px_#000]">
            <AlertTriangle className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <span className="font-black uppercase tracking-wide">Wrong Network Detected: </span>
            <span className="font-bold">
              Your wallet is connected to Chain ID <code className="bg-white border border-black px-1.5 py-0.5 rounded text-black font-mono font-black">{currentChainId || 'Unknown'}</code>.
              MonadWishes requires <span className="underline font-black">Monad Testnet (Chain ID 10143)</span>.
            </span>
            {switchError && (
              <p className="text-xs text-red-600 mt-1 font-black uppercase">{switchError}</p>
            )}
          </div>
        </div>

        <button
          onClick={handleSwitchNetwork}
          disabled={isSwitching}
          className="shrink-0 px-4 py-2 bg-[#CCFF00] text-black font-black uppercase rounded-lg border-3 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none transition-all flex items-center space-x-2"
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
