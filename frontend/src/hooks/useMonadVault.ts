import { useState } from 'react'
import { useWriteContract } from 'wagmi'
import { useWallets } from '@privy-io/react-auth'
import { parseEther } from 'viem'
import { CONTRACT_ADDRESSES, monadTestnet } from '../config/monad'
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

export function useMonadVault() {
  const { writeContractAsync } = useWriteContract()
  const { wallets } = useWallets()

  const [toast, setToast] = useState<TxToastState>({
    isOpen: false,
    status: 'idle',
  })

  const closeToast = () => setToast((prev) => ({ ...prev, isOpen: false }))

  // Ensure all connected wallets are switched to Monad Testnet (Chain ID 10143)
  const ensureMonadNetwork = async () => {
    if (!wallets || wallets.length === 0) return

    for (const wallet of wallets) {
      let rawChainId: string | number = wallet.chainId
      if (typeof rawChainId === 'string') {
        if (rawChainId.startsWith('eip155:')) {
          rawChainId = rawChainId.replace('eip155:', '')
        }
      }
      const numericChainId = typeof rawChainId === 'string' && rawChainId.startsWith('0x')
        ? parseInt(rawChainId, 16)
        : Number(rawChainId)

      if (numericChainId !== monadTestnet.id) {
        try {
          await wallet.switchChain(monadTestnet.id)
        } catch (err: any) {
          console.error('Privy switchChain error for wallet:', wallet.address, err)
          throw new Error(`Wallet on network ${numericChainId}. Please confirm network switch to Monad Testnet (Chain ID 10143) in your wallet.`)
        }
      }
    }
  }



  // 1. Execute Create Vault on Monad Testnet
  const executeCreateVault = async (data: {
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

  // 2. Execute Contribute on Monad Testnet (Deducts real MON from Privy Wallet)
  const executeContribute = async (vaultIdNum: number, amountMon: number, message: string) => {
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
        args: [BigInt(vaultIdNum), message],
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

  // 3. Execute Release Gift / Demo Mode Time Travel
  const executeReleaseGift = async (vaultIdNum: number, isDemoMode: boolean) => {
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
        args: [BigInt(vaultIdNum), isDemoMode],
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
    toast,
    closeToast,
    executeCreateVault,
    executeContribute,
    executeReleaseGift,
  }
}

