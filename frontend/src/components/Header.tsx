import React, { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { usePrivy } from '@privy-io/react-auth'
import { Wallet, LogIn, LogOut, Gift, Sparkles } from 'lucide-react'

export default function Header() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-[#200052]/50 bg-[#0A0518]/80 px-4 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto flex flex-wrap items-center justify-between py-3 sm:py-4">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 no-underline group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#836EF9] to-[#00E5FF] shadow-[0_0_20px_rgba(131,110,249,0.4)] group-hover:scale-105 transition-transform">
            <Gift className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-[#E0E0FF] to-[#00E5FF] bg-clip-text text-transparent">
              MonadWishes
            </span>
            <span className="text-[10px] font-medium tracking-widest text-[#00E5FF] uppercase">
              Monad Testnet • 0.3s
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link
            to="/"
            className="hover:text-white transition-colors"
            activeProps={{ className: 'text-[#00E5FF] font-semibold' }}
          >
            Explore Vaults
          </Link>
          <a
            href="https://testnet.monadexplorer.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors hidden sm:block"
          >
            Explorer
          </a>
        </div>

        {/* Social Login / Wallet Auth Button */}
        <div className="flex items-center gap-3">
          {mounted ? <PrivyHeaderControls /> : (
            <div className="h-9 w-32 rounded-full bg-[#200052]/40 animate-pulse" />
          )}
        </div>
      </nav>
    </header>
  )
}

function PrivyHeaderControls() {
  const { login, logout, authenticated, user } = usePrivy()

  const walletAddress = user?.wallet?.address
  const truncatedAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : null

  const userIdentifier = user?.email?.address || user?.twitter?.username || truncatedAddress || 'Connected'

  if (authenticated) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-full border border-[#836EF9]/40 bg-[#200052]/60 px-3.5 py-1.5 text-xs font-semibold text-white shadow-inner">
          <span className="h-2 w-2 rounded-full bg-[#00E5FF] animate-pulse" />
          <Wallet className="h-3.5 w-3.5 text-[#836EF9]" />
          <span>{userIdentifier}</span>
        </div>
        <button
          onClick={logout}
          className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Disconnect"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={login}
      className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#836EF9] to-[#00E5FF] px-5 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(131,110,249,0.5)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] hover:scale-[1.02] transition-all"
    >
      <LogIn className="h-4 w-4" />
      <span>Login with Privy</span>
      <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-spin" style={{ animationDuration: '3s' }} />
    </button>
  )
}
