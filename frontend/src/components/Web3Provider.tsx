import React, { useState, useEffect } from 'react'
import { PrivyProvider } from '@privy-io/react-auth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createConfig, WagmiProvider, http } from 'wagmi'
import { monadTestnet } from '../config/monad'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 1000,
    },
  },
})

export const wagmiConfig = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http('https://testnet-rpc.monad.xyz'),
  },
  ssr: true,
})

interface Web3ProviderProps {
  children: React.ReactNode
}

export default function Web3Provider({ children }: Web3ProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const privyAppId = import.meta.env.VITE_PRIVY_APP_ID || 'cmsjz9g5v007a0el4gkpcvptt'

  // During SSR or initial hydration, render query client wrapper to prevent window/IndexedDB 500 errors
  if (!mounted) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={privyAppId}
        config={{
          loginMethods: ['google', 'twitter', 'email', 'wallet'],
          appearance: {
            theme: 'dark',
            accentColor: '#836EF9',
            logo: 'https://monad.xyz/favicon.ico',
          },
          embeddedWallets: {
            ethereum: {
              createOnLogin: 'users-without-wallets',
            },
          },
          defaultChain: monadTestnet,
          supportedChains: [monadTestnet],
        }}
      >
        <WagmiProvider config={wagmiConfig}>
          {children}
        </WagmiProvider>
      </PrivyProvider>
    </QueryClientProvider>
  )
}
