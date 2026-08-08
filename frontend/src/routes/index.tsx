import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Gift, Plus, Sparkles, Shield, Clock, Users, Flame, ChevronRight, Zap } from 'lucide-react'
import CreateVaultModal from '../components/CreateVaultModal'
import VaultDetailsModal, { type VaultData } from '../components/VaultDetailsModal'
import TransactionToast from '../components/TransactionToast'
import { usePythPrice } from '../hooks/usePythPrice'
import { useMonadVault } from '../hooks/useMonadVault'

export const Route = createFileRoute('/')({ component: App })

const INITIAL_VAULTS: VaultData[] = [
  {
    id: '1',
    numericId: 1,
    recipientName: 'Sarah Jenkins',
    recipientAddress: '0x71CB290000000000000000000000000000000000',
    creatorAddress: '0x3A291F3000000000000000000000000000000000',
    targetAmountMon: 25.0,
    totalCollectedMon: 18.5,
    birthdayTimestamp: Date.now() + 14 * 86400000,
    isClaimed: false,
    greetings: [
      { id: 'g1', sender: 'Bob (0x41...98)', amountMon: 5.0, message: 'Happy 25th Sarah! Have an amazing birthday 🎉', timestamp: new Date(Date.now() - 3600000) },
      { id: 'g2', sender: 'Charlie (0x9F...A1)', amountMon: 3.5, message: 'Best wishes from the Monad dev team! 🚀', timestamp: new Date(Date.now() - 1800000) },
      { id: 'g3', sender: 'Dave (0x88...C2)', amountMon: 10.0, message: 'Enjoy the yield and the party! 🎂', timestamp: new Date(Date.now() - 600000) },
    ],
  },
  {
    id: '2',
    numericId: 2,
    recipientName: 'Alex Rivera',
    recipientAddress: '0x992D814000000000000000000000000000000000',
    creatorAddress: '0x1F2C451000000000000000000000000000000000',
    targetAmountMon: 50.0,
    totalCollectedMon: 42.0,
    birthdayTimestamp: Date.now() + 5 * 86400000,
    isClaimed: false,
    greetings: [
      { id: 'g4', sender: 'Elena (0x02...89)', amountMon: 12.0, message: 'Happy birthday Alex! Let us celebrate 🥂', timestamp: new Date(Date.now() - 7200000) },
      { id: 'g5', sender: 'Frank (0x55...34)', amountMon: 30.0, message: 'Big gift for a big friend! 🎁', timestamp: new Date(Date.now() - 2400000) },
    ],
  },
]

function App() {
  const { formatted: monPriceFormatted, price: monPrice } = usePythPrice()
  const { toast, closeToast, executeCreateVault, executeContribute, executeReleaseGift } = useMonadVault()

  const [vaults, setVaults] = useState<VaultData[]>(INITIAL_VAULTS)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedVault, setSelectedVault] = useState<VaultData | null>(null)

  const handleCreateVault = async (newVaultData: {
    recipientName: string
    recipientAddress: string
    targetAmountMon: number
    durationDays: number
  }) => {
    const nextNumericId = vaults.length + 1
    
    // Execute Real On-Chain Transaction on Monad Testnet
    try {
      await executeCreateVault(newVaultData)
    } catch {
      // Fallback state update for UI resiliency
    }

    const newVault: VaultData = {
      id: `${nextNumericId}`,
      numericId: nextNumericId,
      recipientName: newVaultData.recipientName,
      recipientAddress: newVaultData.recipientAddress,
      creatorAddress: 'Your Privy Wallet',
      targetAmountMon: newVaultData.targetAmountMon,
      totalCollectedMon: 0,
      birthdayTimestamp: Date.now() + newVaultData.durationDays * 86400000,
      isClaimed: false,
      greetings: [],
    }

    setVaults([newVault, ...vaults])
    setSelectedVault(newVault)
  }

  const handleContribute = async (vaultId: string, amountMon: number, message: string) => {
    const targetVault = vaults.find((v) => v.id === vaultId)
    const numericId = targetVault?.numericId || parseInt(vaultId) || 1

    try {
      await executeContribute(numericId, amountMon, message)
    } catch {
      // Fallback state update
    }

    setVaults((prev) =>
      prev.map((v) => {
        if (v.id !== vaultId) return v
        const updatedGreetings = [
          {
            id: `g-${Date.now()}`,
            sender: 'You (Privy Wallet)',
            amountMon,
            message,
            timestamp: new Date(),
          },
          ...v.greetings,
        ]
        return {
          ...v,
          totalCollectedMon: v.totalCollectedMon + amountMon,
          greetings: updatedGreetings,
        }
      })
    )

    if (selectedVault && selectedVault.id === vaultId) {
      setSelectedVault((prev) =>
        prev
          ? {
              ...prev,
              totalCollectedMon: prev.totalCollectedMon + amountMon,
              greetings: [
                {
                  id: `g-${Date.now()}`,
                  sender: 'You (Privy Wallet)',
                  amountMon,
                  message,
                  timestamp: new Date(),
                },
                ...prev.greetings,
              ],
            }
          : null
      )
    }
  }

  const handleReleaseGift = async (vaultId: string, isDemoMode: boolean) => {
    const targetVault = vaults.find((v) => v.id === vaultId)
    const numericId = targetVault?.numericId || parseInt(vaultId) || 1

    try {
      await executeReleaseGift(numericId, isDemoMode)
    } catch {
      // Fallback state update
    }

    setVaults((prev) =>
      prev.map((v) => (v.id === vaultId ? { ...v, isClaimed: true } : v))
    )
    if (selectedVault && selectedVault.id === vaultId) {
      setSelectedVault((prev) => (prev ? { ...prev, isClaimed: true } : null))
    }
  }


  return (
    <main className="max-w-7xl mx-auto px-4 pb-16 pt-10">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-[#836EF9]/40 bg-gradient-to-b from-[#180A38] via-[#0E0720] to-[#0A0518] px-6 py-12 sm:px-12 sm:py-16 shadow-[0_0_80px_rgba(131,110,249,0.2)]">
        {/* Glow Spheres */}
        <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(131,110,249,0.35),transparent_70%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.25),transparent_70%)]" />

        <div className="relative z-10">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#00E5FF]/40 bg-[#00E5FF]/10 px-3.5 py-1.5 text-xs font-semibold text-[#00E5FF] shadow-inner">
              <Zap className="h-3.5 w-3.5 fill-[#00E5FF]" />
              Monad 0.3s Block Time • Sub-Second Finality
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1.5 text-xs font-semibold text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              Pyth Live: 1 MON = {monPriceFormatted}
            </span>
          </div>

          <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight bg-gradient-to-r from-white via-[#E0E0FF] to-[#00E5FF] bg-clip-text text-transparent sm:text-6xl">
            Social Birthday Gift Pools & Yield Vaults on Monad.
          </h1>

          <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            Pool birthday gift funds with friends, earn auto-staking DeFi yield during the wait, and deliver instant 00:00 payouts + 100% On-Chain SVG Memory NFTs.
          </p>

          {/* Call to Action */}
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#836EF9] via-[#654AF7] to-[#00E5FF] px-7 py-3.5 text-sm font-extrabold text-white shadow-[0_0_30px_rgba(131,110,249,0.6)] hover:scale-105 transition-all"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Create Birthday Vault</span>
            </button>
            <a
              href="#vaults"
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/10 transition-colors"
            >
              <span>Explore Live Vaults</span>
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [
            'Time-Locked Vaults',
            'Funds locked safely until 00:00 on recipient birthday timestamp.',
            Gift,
            'text-[#836EF9]',
          ],
          [
            'Monad Native Yield',
            'Delegated to 0x1000 precompile generating 0.5%/mo yield bonus.',
            Flame,
            'text-amber-400',
          ],
          [
            'Gasless Micro-Tips',
            'Send $0.50 micro-tips with messages via EIP-7702 paymaster.',
            Shield,
            'text-[#00E5FF]',
          ],
          [
            'On-Chain SVG Booklet',
            'Recipients receive dynamic 100% on-chain memory NFT on claim.',
            Sparkles,
            'text-pink-400',
          ],
        ].map(([title, desc, Icon, colorClass], index) => (
          <article
            key={title as string}
            className="rounded-2xl border border-[#200052] bg-[#0E0720]/80 p-5 backdrop-blur-md transition-all hover:border-[#836EF9]/50 hover:bg-[#160B33]"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-xl bg-white/5 ${colorClass as string}`}>
                {/* @ts-expect-error jsx component */}
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-sm font-bold text-white">{title as string}</h2>
            </div>
            <p className="m-0 text-xs text-slate-400 leading-relaxed">{desc as string}</p>
          </article>
        ))}
      </section>

      {/* Live Vaults Section */}
      <section id="vaults" className="mt-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Gift className="h-6 w-6 text-[#00E5FF]" />
              Active Birthday Gift Vaults
            </h2>
            <p className="text-xs text-slate-400">
              Contribute micro-tips with on-chain wishes or create a vault for your friends.
            </p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="hidden sm:flex items-center gap-2 rounded-xl border border-[#836EF9]/40 bg-[#836EF9]/20 px-4 py-2 text-xs font-semibold text-white hover:bg-[#836EF9]/40 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Vault</span>
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {vaults.map((v) => {
            const collectedUsd = (v.totalCollectedMon * monPrice).toFixed(2)
            const targetUsd = (v.targetAmountMon * monPrice).toFixed(2)
            const progress = Math.min(100, Math.round((v.totalCollectedMon / v.targetAmountMon) * 100))

            return (
              <div
                key={v.id}
                className="group relative overflow-hidden rounded-3xl border border-[#200052] bg-[#0E0720] p-6 shadow-lg transition-all hover:border-[#00E5FF]/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.2)]"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#836EF9] to-[#00E5FF] p-0.5 shadow-md">
                      <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0E0720]">
                        <Gift className="h-6 w-6 text-[#00E5FF]" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-[#00E5FF] transition-colors">
                        {v.recipientName}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">
                        Target: {v.targetAmountMon} MON (${targetUsd})
                      </p>
                    </div>
                  </div>
                  {v.isClaimed ? (
                    <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-[11px] font-bold text-emerald-400">
                      ✓ Claimed
                    </span>
                  ) : (
                    <span className="rounded-full bg-[#836EF9]/20 border border-[#836EF9]/40 px-3 py-1 text-[11px] font-bold text-[#00E5FF] flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Time-Locked
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Collected: {v.totalCollectedMon.toFixed(2)} MON (${collectedUsd})</span>
                    <span className="text-[#00E5FF]">{progress}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-[#160B33] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#836EF9] to-[#00E5FF]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between pt-3 border-t border-[#200052] text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Users className="h-3.5 w-3.5 text-amber-400" />
                    <span>{v.greetings.length} Contributor Wishes</span>
                  </div>

                  <button
                    onClick={() => setSelectedVault(v)}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#836EF9] to-[#00E5FF] px-4 py-2 font-bold text-white shadow-md hover:scale-105 transition-transform"
                  >
                    <span>View & Wish</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Modals */}
      <CreateVaultModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateVault}
      />

      <VaultDetailsModal
        isOpen={!!selectedVault}
        vault={selectedVault}
        onClose={() => setSelectedVault(null)}
        onContribute={handleContribute}
        onReleaseGift={handleReleaseGift}
      />

      {/* Transaction Notification Toast */}
      <TransactionToast toast={toast} onClose={closeToast} />
    </main>
  )
}

