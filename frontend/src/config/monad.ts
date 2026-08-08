import { defineChain } from 'viem'

export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    name: 'Monad',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
    public: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Explorer',
      url: 'https://testnet.monadexplorer.com',
    },
  },
  contracts: {
    stakingPrecompile: {
      address: '0x0000000000000000000000000000000000001000',
    },
  },
})

// Deployed Smart Contract Addresses on Monad Testnet
export const CONTRACT_ADDRESSES = {
  vault: (import.meta.env.VITE_VAULT_ADDRESS || '0x5f2394E6Bc3Dd842831C66253d4433f4F72B4E7B') as `0x${string}`,
  nft: (import.meta.env.VITE_NFT_ADDRESS || '0xa74f97D26a3783C94c8a925C3c2598cA80C8C579') as `0x${string}`,
}


