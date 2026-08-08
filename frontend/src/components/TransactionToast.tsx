import React from 'react'
import { ExternalLink, CheckCircle2, Loader2, AlertCircle, X } from 'lucide-react'

export interface TxToastState {
  isOpen: boolean
  status: 'idle' | 'submitting' | 'mining' | 'success' | 'error'
  txHash?: string
  message?: string
  errorMessage?: string
}

interface TransactionToastProps {
  toast: TxToastState
  onClose: () => void
}

export default function TransactionToast({ toast, onClose }: TransactionToastProps) {
  if (!toast.isOpen || toast.status === 'idle') return null

  const explorerUrl = toast.txHash ? `https://testnet.monadexplorer.com/tx/${toast.txHash}` : null
  const truncatedHash = toast.txHash ? `${toast.txHash.slice(0, 10)}...${toast.txHash.slice(-8)}` : null

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-bounce-short">
      <div className="relative overflow-hidden rounded-2xl border border-[#836EF9]/50 bg-[#0E0720]/95 p-4 shadow-[0_0_40px_rgba(131,110,249,0.4)] backdrop-blur-xl text-white">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 rounded-full p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Submitting / Mining */}
        {(toast.status === 'submitting' || toast.status === 'mining') && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF]">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#00E5FF]">
                {toast.status === 'submitting' ? 'Confirm in Wallet...' : 'Mining on Monad (0.3s)...'}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                {toast.message || 'Executing smart contract transaction on Monad Testnet.'}
              </p>
              {explorerUrl && (
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#00E5FF] hover:underline"
                >
                  <span>Tx: {truncatedHash}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Success */}
        {toast.status === 'success' && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-400">
                Transaction Confirmed! 🎉
              </h4>
              <p className="text-xs text-slate-200 mt-0.5">
                {toast.message || 'Smart contract state updated live on Monad Blockchain.'}
              </p>
              {explorerUrl && (
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all"
                >
                  <span>View on Monad Explorer ({truncatedHash})</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Error */}
        {toast.status === 'error' && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-400">Transaction Failed</h4>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">
                {toast.errorMessage || 'Transaction was rejected or failed on Monad Testnet.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
