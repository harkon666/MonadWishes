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
  vault: '0x9f6c4609f6c4609f6c4609f6c4609f6c4609f6c4', // Will be updated on live deployment
  nft: '0x6263177626317762631776263177626317762631',
}

