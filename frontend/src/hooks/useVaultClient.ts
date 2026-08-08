import { useState, useEffect, useCallback } from 'react'
import { useWriteContract } from 'wagmi'
import { useWallets } from '@privy-io/react-auth'
import { parseEther } from 'viem'
import { CONTRACT_ADDRESSES, monadTestnet } from '../config/monad'
import { fetchLiveVaults } from '../services/indexer'
import type { VaultData } from '../components/VaultDetailsModal'
import type { TxToastState } from '../components/TransactionToast'

export const VAULT_ABI = [
  {
    type: 'function',
    name: 'createVault',
    inputs: [
      { name: '_recipient', type: 'address' },
      { name: '_recipientName', type: 'string' },
      { name: '_durationInDays', type: 'uint256' },
      { name: '_targetAmount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'contribute',
    inputs: [
      { name: '_vaultId', type: 'uint256' },
      { name: '_message', type: 'string' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'releaseBirthdayGift',
    inputs: [
      { name: '_vaultId', type: 'uint256' },
      { name: '_isDemoMode', type: 'bool' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

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

export function useVaultClient() {
  const { writeContractAsync } = useWriteContract()
  const { wallets } = useWallets()

  const [vaults, setVaults] = useState<VaultData[]>(INITIAL_VAULTS)
  const [isLoading, setIsLoading] = useState(false)
  const [dataSource, setDataSource] = useState<'indexer' | 'rpc' | 'initial'>('initial')

  const [toast, setToast] = useState<TxToastState>({
    isOpen: false,
    status: 'idle',
  })

  const closeToast = () => setToast((prev) => ({ ...prev, isOpen: false }))

  // Ensure wallet is switched to Monad Testnet
  const ensureMonadNetwork = async () => {
    if (!wallets || wallets.length === 0) return

    for (const wallet of wallets) {
      let rawChainId: string | number = wallet.chainId
      if (typeof rawChainId === 'string' && rawChainId.startsWith('eip155:')) {
        rawChainId = rawChainId.replace('eip155:', '')
      }
      const numericChainId = typeof rawChainId === 'string' && rawChainId.startsWith('0x')
        ? parseInt(rawChainId, 16)
        : Number(rawChainId)

      if (numericChainId !== monadTestnet.id) {
        try {
          await wallet.switchChain(monadTestnet.id)
        } catch (err: any) {
          console.error('Network switch error:', err)
          throw new Error(`Please confirm network switch to Monad Testnet (Chain ID 10143) in your wallet.`)
        }
      }
    }
  }

  // Refetch live vaults from Envio Indexer or RPC Fallback
  const refetch = useCallback(async () => {
    setIsLoading(true)
    try {
      const { vaults: liveVaults, source } = await fetchLiveVaults()
      if (liveVaults.length > 0) {
        setVaults(liveVaults)
        setDataSource(source)
      }
    } catch (err) {
      console.warn('Failed to refetch live vaults:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  // 1. Create Vault
  const createVault = async (data: {
    recipientAddress: string
    recipientName: string
    durationDays: number
    targetAmountMon: number
  }) => {
    try {
      await ensureMonadNetwork()

      setToast({
        isOpen: true,
        status: 'submitting',
        message: `Creating Birthday Vault for ${data.recipientName} on Monad Testnet...`,
      })

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.vault,
        abi: VAULT_ABI,
        functionName: 'createVault',
        args: [
          data.recipientAddress as `0x${string}`,
          data.recipientName,
          BigInt(data.durationDays),
          parseEther(data.targetAmountMon.toString()),
        ],
        chainId: monadTestnet.id,
        gas: 850_000n,
      })

      setToast({
        isOpen: true,
        status: 'mining',
        txHash: hash,
        message: 'Mining transaction on Monad (0.3s Block Time)...',
      })

      setTimeout(() => {
        setToast({
          isOpen: true,
          status: 'success',
          txHash: hash,
          message: `Birthday Vault for ${data.recipientName} created live on Monad Blockchain!`,
        })
        refetch()
      }, 1500)

      return hash
    } catch (err: any) {
      console.error('Create Vault error:', err)
      setToast({
        isOpen: true,
        status: 'error',
        errorMessage: err?.shortMessage || err?.message || 'Transaction rejected or failed.',
      })
      throw err
    }
  }

  // 2. Contribute
  const contribute = async (vaultId: string, amountMon: number, message: string) => {
    const targetVault = vaults.find((v) => v.id === vaultId)
    const numericId = targetVault?.numericId || parseInt(vaultId) || 1

    try {
      await ensureMonadNetwork()

      setToast({
        isOpen: true,
        status: 'submitting',
        message: `Sending ${amountMon} MON contribution & wish on Monad Testnet...`,
      })

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.vault,
        abi: VAULT_ABI,
        functionName: 'contribute',
        args: [BigInt(numericId), message],
        value: parseEther(amountMon.toString()),
        chainId: monadTestnet.id,
        gas: 850_000n,
      })

      setToast({
        isOpen: true,
        status: 'mining',
        txHash: hash,
        message: `Transferring ${amountMon} MON to Vault contract...`,
      })

      setTimeout(() => {
        setToast({
          isOpen: true,
          status: 'success',
          txHash: hash,
          message: `Successfully contributed ${amountMon} MON + wish to Vault!`,
        })
        refetch()
      }, 1500)

      return hash
    } catch (err: any) {
      console.error('Contribute error:', err)
      setToast({
        isOpen: true,
        status: 'error',
        errorMessage: err?.shortMessage || err?.message || 'Contribution failed.',
      })
      throw err
    }
  }

  // 3. Release Birthday Gift
  const releaseGift = async (vaultId: string, isDemoMode: boolean) => {
    const targetVault = vaults.find((v) => v.id === vaultId)
    const numericId = targetVault?.numericId || parseInt(vaultId) || 1

    try {
      await ensureMonadNetwork()

      setToast({
        isOpen: true,
        status: 'submitting',
        message: isDemoMode
          ? 'Executing Instant Demo Time Travel Release on Monad Testnet...'
          : 'Releasing Birthday Gift Pool & Yield to Recipient...',
      })

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.vault,
        abi: VAULT_ABI,
        functionName: 'releaseBirthdayGift',
        args: [BigInt(numericId), isDemoMode],
        chainId: monadTestnet.id,
        gas: 1_200_000n,
      })

      setToast({
        isOpen: true,
        status: 'mining',
        txHash: hash,
        message: 'Minting On-Chain SVG NFT Booklet & Transferring MON + Yield...',
      })

      setTimeout(() => {
        setToast({
          isOpen: true,
          status: 'success',
          txHash: hash,
          message: 'Gift Pool + Yield released & Dynamic SVG NFT Booklet minted!',
        })
        refetch()
      }, 1500)

      return hash
    } catch (err: any) {
      console.error('Release Gift error:', err)
      setToast({
        isOpen: true,
        status: 'error',
        errorMessage: err?.shortMessage || err?.message || 'Release gift failed.',
      })
      throw err
    }
  }

  return {
    vaults,
    isLoading,
    dataSource,
    toast,
    closeToast,
    createVault,
    contribute,
    releaseGift,
    refetch,
  }
}
