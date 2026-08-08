import React, { useState } from 'react'
import { X, Gift, Sparkles, Calendar, DollarSign, User, ShieldCheck } from 'lucide-react'
import { usePythPrice } from '../hooks/usePythPrice'

interface CreateVaultModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (vault: {
    recipientName: string
    recipientAddress: string
    targetAmountMon: number
    durationDays: number
  }) => void
}

export default function CreateVaultModal({ isOpen, onClose, onCreate }: CreateVaultModalProps) {
  const { price: monPrice, formatted: monPriceFormatted } = usePythPrice()

  const [recipientName, setRecipientName] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [targetAmountMon, setTargetAmountMon] = useState('10')
  const [durationDays, setDurationDays] = useState('30')

  if (!isOpen) return null

  const monNum = parseFloat(targetAmountMon) || 0
  const usdValue = (monNum * monPrice).toFixed(2)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipientName || !recipientAddress || monNum <= 0) return

    onCreate({
      recipientName,
      recipientAddress,
      targetAmountMon: monNum,
      durationDays: parseInt(durationDays) || 30,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#836EF9]/40 bg-[#0E0720] p-6 sm:p-8 shadow-[0_0_50px_rgba(131,110,249,0.3)] text-white rise-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#200052] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#836EF9] to-[#00E5FF]">
              <Gift className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-[#00E5FF] bg-clip-text text-transparent">
                Create Birthday Vault
              </h2>
              <p className="text-xs text-slate-400">Time-Locked Gift Pool & Yield Staker</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Pyth Ticker Badge */}
        <div className="mb-6 flex items-center justify-between rounded-xl border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-4 py-2.5 text-xs text-[#00E5FF]">
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-4 w-4 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Pyth Oracle Live Pricing</span>
          </div>
          <span className="font-bold text-white">1 MON = {monPriceFormatted}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recipient Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-[#836EF9]" />
              Recipient Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Alice Smith"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full rounded-xl border border-[#200052] bg-[#160B33] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#00E5FF] focus:outline-none focus:ring-1 focus:ring-[#00E5FF]"
            />
          </div>

          {/* Recipient Wallet Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#00E5FF]" />
              Recipient Wallet or Monad Address
            </label>
            <input
              type="text"
              required
              placeholder="0x..."
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="w-full rounded-xl border border-[#200052] bg-[#160B33] px-4 py-3 text-sm text-white font-mono placeholder-slate-500 focus:border-[#00E5FF] focus:outline-none focus:ring-1 focus:ring-[#00E5FF]"
            />
          </div>

          {/* Goal Amount MON */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                Target Pool (MON)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={targetAmountMon}
                onChange={(e) => setTargetAmountMon(e.target.value)}
                className="w-full rounded-xl border border-[#200052] bg-[#160B33] px-4 py-3 text-sm text-white focus:border-[#00E5FF] focus:outline-none focus:ring-1 focus:ring-[#00E5FF]"
              />
              <span className="mt-1 block text-[11px] text-slate-400">
                ≈ ${usdValue} USD (Pyth)
              </span>
            </div>

            {/* Duration Days */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-amber-400" />
                Lock Duration (Days)
              </label>
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                className="w-full rounded-xl border border-[#200052] bg-[#160B33] px-4 py-3 text-sm text-white focus:border-[#00E5FF] focus:outline-none focus:ring-1 focus:ring-[#00E5FF]"
              >
                <option value="7">7 Days</option>
                <option value="14">14 Days</option>
                <option value="30">30 Days (Recommended)</option>
                <option value="60">60 Days</option>
              </select>
              <span className="mt-1 block text-[11px] text-slate-400">
                Auto-unlock at 00:00 UTC
              </span>
            </div>
          </div>

          {/* Staking Yield Info Banner */}
          <div className="rounded-xl bg-[#200052]/40 p-3 text-xs text-slate-300 border border-[#836EF9]/20">
            <p className="font-semibold text-[#00E5FF]">✨ Monad Social Yield Active</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Contributions are delegated to Monad Native Staking precompile (<code>0x1000</code>) earning 0.5%/month prorated yield.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#836EF9] to-[#00E5FF] px-6 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(131,110,249,0.5)] hover:scale-[1.02] transition-all"
            >
              <Gift className="h-4 w-4" />
              <span>Create Vault</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
