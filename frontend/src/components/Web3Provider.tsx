import React from 'react'
import { PrivyProvider } from '@privy-io/react-auth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createConfig, WagmiProvider, http } from 'wagmi'
import { monadTestnet } from '../config/monad'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 1000, // 1s polling interval for sub-second Monad block updates
    },
  },
})

export const wagmiConfig = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http('https://testnet-rpc.monad.xyz'),
  },
})

interface Web3ProviderProps {
  children: React.ReactNode
}

export default function Web3Provider({ children }: Web3ProviderProps) {
  const privyAppId = import.meta.env.VITE_PRIVY_APP_ID || 'clx_monad_wishes_demo_id'

  return (
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
          createOnLogin: 'users-without-wallets',
        },
        defaultChain: monadTestnet,
        supportedChains: [monadTestnet],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}
