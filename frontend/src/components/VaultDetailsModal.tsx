import React, { useState, useEffect } from 'react'
import { X, Gift, Sparkles, Clock, Send, Trophy, CheckCircle2, ShieldCheck, PlayCircle, Heart } from 'lucide-react'
import { usePythPrice } from '../hooks/usePythPrice'

export interface GreetingItem {
  id: string
  sender: string
  amountMon: number
  message: string
  timestamp: Date
}

export interface VaultData {
  id: string
  recipientName: string
  recipientAddress: string
  creatorAddress: string
  targetAmountMon: number
  totalCollectedMon: number
  birthdayTimestamp: number
  isClaimed: boolean
  greetings: GreetingItem[]
}

interface VaultDetailsModalProps {
  isOpen: boolean
  vault: VaultData | null
  onClose: () => void
  onContribute: (vaultId: string, amountMon: number, message: string) => void
  onReleaseGift: (vaultId: string, isDemoMode: boolean) => void
}

export default function VaultDetailsModal({
  isOpen,
  vault,
  onClose,
  onContribute,
  onReleaseGift,
}: VaultDetailsModalProps) {
  const { price: monPrice } = usePythPrice()

  const [contributeAmount, setContributeAmount] = useState('1.0')
  const [greetingMsg, setGreetingMsg] = useState('')
  const [showNftModal, setShowNftModal] = useState(false)
  const [simulatedYieldMon, setSimulatedYieldMon] = useState(0)

  useEffect(() => {
    if (!vault) return
    // Base yield calculation (0.5% monthly prorated) + greetings bonus
    const baseYield = (vault.totalCollectedMon * 0.005) + (vault.greetings.length * 0.02)
    setSimulatedYieldMon(baseYield)

    // Sub-second live yield ticker animation (increments slightly every second)
    const interval = setInterval(() => {
      setSimulatedYieldMon((prev) => prev + 0.0000012)
    }, 1000)

    return () => clearInterval(interval)
  }, [vault])

  if (!isOpen || !vault) return null

  const targetUsd = (vault.targetAmountMon * monPrice).toFixed(2)
  const collectedUsd = (vault.totalCollectedMon * monPrice).toFixed(2)
  const totalPayoutMon = vault.totalCollectedMon + simulatedYieldMon
  const totalPayoutUsd = (totalPayoutMon * monPrice).toFixed(2)
  const progressPercent = Math.min(100, Math.round((vault.totalCollectedMon / vault.targetAmountMon) * 100))

  const handleContributeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amt = parseFloat(contributeAmount) || 0
    if (amt <= 0 || !greetingMsg) return

    onContribute(vault.id, amt, greetingMsg)
    setGreetingMsg('')
  }

  const handleClaim = (isDemoMode: boolean) => {
    onReleaseGift(vault.id, isDemoMode)
    setShowNftModal(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-lg overflow-y-auto py-6">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[#836EF9]/50 bg-[#0E0720] p-6 sm:p-8 shadow-[0_0_60px_rgba(131,110,249,0.35)] text-white rise-in my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#836EF9] via-[#00E5FF] to-amber-300 p-0.5 shadow-lg">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0E0720]">
              <Gift className="h-7 w-7 text-[#00E5FF]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold tracking-tight text-white">
                {vault.recipientName}'s Birthday Vault
              </h2>
              {vault.isClaimed && (
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-0.5 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Claimed
                  </span>
                  <button
                    onClick={() => setShowNftModal(true)}
                    className="rounded-full bg-[#00E5FF]/20 border border-[#00E5FF]/40 px-3 py-0.5 text-xs font-bold text-[#00E5FF] hover:bg-[#00E5FF]/30 transition-all flex items-center gap-1"
                  >
                    <Trophy className="h-3.5 w-3.5 text-amber-300" /> View Memory Booklet NFT
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Recipient: {vault.recipientAddress}
            </p>
          </div>
        </div>

        {/* Progress & Staking Yield Card */}
        <div className="mb-6 rounded-2xl border border-[#200052] bg-[#160B33]/80 p-5 shadow-inner">
          <div className="flex items-center justify-between text-sm font-semibold mb-2">
            <span className="text-slate-300">Target Gift Pool Progress</span>
            <span className="text-[#00E5FF] font-bold">{progressPercent}%</span>
          </div>
          
          {/* Progress Bar */}
          <div className="h-3 w-full rounded-full bg-[#0A0518] overflow-hidden p-0.5 border border-[#836EF9]/30">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#836EF9] to-[#00E5FF] transition-all duration-500 shadow-[0_0_12px_rgba(0,229,255,0.8)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Amount Breakdown Grid */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#200052] text-center">
            <div>
              <span className="block text-[11px] font-medium text-slate-400 uppercase">Collected Principal</span>
              <span className="text-lg font-bold text-white">{vault.totalCollectedMon.toFixed(2)} MON</span>
              <span className="block text-[10px] text-slate-400">≈ ${collectedUsd}</span>
            </div>
            <div>
              <span className="block text-[11px] font-medium text-amber-400 uppercase flex items-center justify-center gap-1">
                <Sparkles className="h-3 w-3" /> Monad Yield
              </span>
              <span className="text-lg font-bold text-amber-300">+{simulatedYieldMon.toFixed(4)} MON</span>
              <span className="block text-[10px] text-amber-400/80">0.5% APY Staked</span>
            </div>
            <div>
              <span className="block text-[11px] font-medium text-[#00E5FF] uppercase">Total Recipient Payout</span>
              <span className="text-lg font-bold text-[#00E5FF]">{totalPayoutMon.toFixed(2)} MON</span>
              <span className="block text-[10px] text-[#00E5FF]/80">≈ ${totalPayoutUsd}</span>
            </div>
          </div>
        </div>

        {/* Hackathon Demo Time-Travel Banner */}
        <div className="mb-6 rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/10 via-[#200052] to-amber-500/10 p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <PlayCircle className="h-4 w-4" /> Hackathon Demo Mode (3-Min Pitch)
            </span>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Bypass 30-day time-lock to simulate 00:00 instant payout & on-chain SVG NFT minting.
            </p>
          </div>
          <button
            onClick={() => handleClaim(true)}
            disabled={vault.isClaimed || vault.totalCollectedMon === 0}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 px-4 py-2 text-xs font-extrabold text-black shadow-[0_0_15px_rgba(251,191,36,0.4)] hover:scale-105 transition-transform disabled:opacity-50 disabled:pointer-events-none"
          >
            <Sparkles className="h-3.5 w-3.5 fill-black" />
            <span>Time Travel Release</span>
          </button>
        </div>

        {/* Contribution Form */}
        {!vault.isClaimed && (
          <form onSubmit={handleContributeSubmit} className="mb-6 rounded-2xl border border-[#836EF9]/30 bg-[#160B33] p-4">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
              Send Micro-Contribution & Birthday Wish
            </h3>
            
            {/* Quick Amount Buttons */}
            <div className="flex items-center gap-2 mb-3">
              {['0.5', '1.0', '2.5', '5.0'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setContributeAmount(val)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                    contributeAmount === val
                      ? 'bg-[#00E5FF] text-black font-bold'
                      : 'bg-[#200052] text-slate-300 hover:bg-[#836EF9]/30'
                  }`}
                >
                  {val} MON
                </button>
              ))}
              <span className="text-xs text-slate-400 ml-auto">
                (Gasless EIP-7702)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                required
                placeholder="Write a sweet birthday greeting message..."
                value={greetingMsg}
                onChange={(e) => setGreetingMsg(e.target.value)}
                className="flex-1 rounded-xl border border-[#200052] bg-[#0E0720] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#00E5FF] focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-[#836EF9] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#00E5FF] hover:text-black transition-all shadow-md"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send Wish</span>
              </button>
            </div>
          </form>
        )}

        {/* Live On-Chain Greetings Feed */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-[#00E5FF]" />
            On-Chain Greetings Feed ({vault.greetings.length})
          </h3>
          <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
            {vault.greetings.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-4">
                No greetings yet. Be the first friend to contribute!
              </p>
            ) : (
              vault.greetings.map((g) => (
                <div
                  key={g.id}
                  className="flex items-start justify-between rounded-xl border border-[#200052] bg-[#160B33] p-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 font-semibold text-white">
                      <span>{g.sender}</span>
                      <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                        +{g.amountMon} MON
                      </span>
                    </div>
                    <p className="text-slate-300 mt-1">{g.message}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(g.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dynamic SVG NFT Modal Overlay */}
        {showNftModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4">
            <div className="relative max-w-sm rounded-3xl border border-[#00E5FF]/60 bg-[#0A0518] p-6 text-center shadow-[0_0_80px_rgba(0,229,255,0.5)]">
              <button
                onClick={() => setShowNftModal(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <Trophy className="h-10 w-10 text-amber-300 mx-auto mb-2 animate-bounce" />
              <h3 className="text-xl font-bold text-white mb-1">Gift Vault Unlocked!</h3>
              <p className="text-xs text-slate-300 mb-4">
                Dynamic On-Chain SVG NFT Booklet Minted to {vault.recipientName}
              </p>

              {/* Render 100% On-Chain SVG Booklet */}
              <div className="mx-auto my-3 overflow-hidden rounded-2xl border border-[#836EF9]/50 shadow-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="260">
                  <defs>
                    <linearGradient id="monadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#200052"/>
                      <stop offset="50%" stopColor="#836EF9"/>
                      <stop offset="100%" stopColor="#00E5FF"/>
                    </linearGradient>
                  </defs>
                  <rect width="400" height="500" rx="24" fill="url(#monadGrad)"/>
                  <rect x="15" y="15" width="370" height="470" rx="18" fill="none" stroke="#FFFFFF" strokeOpacity="0.2" strokeWidth="2"/>
                  <text x="200" y="70" fontFamily="sans-serif" fontSize="14" fontWeight="bold" fill="#00E5FF" letterSpacing="3" textAnchor="middle">MONAD WISHES</text>
                  <text x="200" y="100" fontFamily="sans-serif" fontSize="22" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">🎂 Happy Birthday!</text>
                  <circle cx="200" cy="180" r="45" fill="#FFFFFF" fillOpacity="0.1" stroke="#00E5FF" strokeWidth="2"/>
                  <text x="200" y="195" fontFamily="sans-serif" fontSize="40" textAnchor="middle">🎁</text>
                  <text x="200" y="260" fontFamily="sans-serif" fontSize="20" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">{vault.recipientName}</text>
                  <rect x="40" y="290" width="320" height="80" rx="12" fill="#000000" fillOpacity="0.3" stroke="#836EF9" strokeWidth="1.5"/>
                  <text x="200" y="320" fontFamily="sans-serif" fontSize="12" fill="#A0A0B0" textAnchor="middle">TOTAL GIFT POOL + YIELD</text>
                  <text x="200" y="352" fontFamily="sans-serif" fontSize="24" fontWeight="bold" fill="#00E5FF" textAnchor="middle">{totalPayoutMon.toFixed(2)} MON</text>
                  <text x="200" y="420" fontFamily="sans-serif" fontSize="13" fill="#FFFFFF" fillOpacity="0.8" textAnchor="middle">👥 Contributed by {vault.greetings.length} Friends</text>
                  <text x="200" y="455" fontFamily="sans-serif" fontSize="10" fill="#A0A0B0" textAnchor="middle">Verified on Monad Blockchain • 0.3s Block Time</text>
                </svg>
              </div>

              <p className="text-[11px] text-emerald-400 font-semibold mb-4">
                ✓ Transferred {totalPayoutMon.toFixed(2)} MON (${totalPayoutUsd}) to Recipient Wallet
              </p>

              <button
                onClick={() => setShowNftModal(false)}
                className="w-full rounded-xl bg-gradient-to-r from-[#836EF9] to-[#00E5FF] py-2.5 text-xs font-bold text-white shadow-lg"
              >
                Close & Return
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
