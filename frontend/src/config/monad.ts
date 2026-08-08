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
  vault: (import.meta.env.VITE_VAULT_ADDRESS || '0xd3146Aabe8a4f50426d0d12A67ecca0ebEB06764') as `0x${string}`,
  nft: (import.meta.env.VITE_NFT_ADDRESS || '0x80994d808075041964605fCA72E7858b861c2c01') as `0x${string}`,
}


