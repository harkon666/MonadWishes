import { createPublicClient, http, formatEther } from 'viem'
import { monadTestnet, CONTRACT_ADDRESSES } from '../config/monad'
import type { VaultData, GreetingItem } from '../components/VaultDetailsModal'

const INDEXER_GRAPHQL_URL = import.meta.env.VITE_INDEXER_GRAPHQL_URL || 'http://localhost:8080/v1/graphql'

const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(),
})

const READ_VAULT_ABI = [
  {
    type: 'function',
    name: 'vaultCounter',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'vaults',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [
      { name: 'id', type: 'uint256' },
      { name: 'creator', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'recipientName', type: 'string' },
      { name: 'targetAmount', type: 'uint256' },
      { name: 'birthdayTimestamp', type: 'uint256' },
      { name: 'totalCollected', type: 'uint256' },
      { name: 'isClaimed', type: 'bool' },
      { name: 'isYieldActive', type: 'bool' },
      { name: 'nftTokenId', type: 'uint256' },
      { name: 'createdAt', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getGreetings',
    inputs: [{ name: '_vaultId', type: 'uint256' }],
    outputs: [
      {
        type: 'tuple[]',
        components: [
          { name: 'sender', type: 'address' },
          { name: 'amount', type: 'uint256' },
          { name: 'message', type: 'string' },
          { name: 'timestamp', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
] as const

const VAULT_GRAPHQL_QUERY = `
  query GetVaults {
    VaultEntity(order_by: { vaultId: desc }) {
      id
      vaultId
      creator
      recipient
      recipientName
      targetAmount
      birthdayTimestamp
      totalCollected
      isClaimed
    }
    ContributionEntity(order_by: { id: desc }) {
      id
      vaultId
      contributor
      amount
      message
      txHash
    }
    GiftClaimEntity {
      id
      vaultId
      nftTokenId
    }
  }
`

/**
 * Primary: Fetch Vaults & Greetings from Envio HyperIndex GraphQL
 */
export async function fetchVaultsFromIndexer(): Promise<VaultData[]> {
  const response = await fetch(INDEXER_GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: VAULT_GRAPHQL_QUERY }),
  })

  if (!response.ok) {
    throw new Error(`Indexer responded with status ${response.status}`)
  }

  const result = await response.json()
  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors[0].message)
  }

  const { VaultEntity = [], ContributionEntity = [], GiftClaimEntity = [] } = result.data || {}

  return VaultEntity.map((v: any) => {
    const numericId = Number(v.vaultId || v.id)
    const vaultContributions = ContributionEntity.filter((c: any) => Number(c.vaultId) === numericId)
    const claim = GiftClaimEntity.find((gc: any) => Number(gc.vaultId) === numericId)

    const greetings: GreetingItem[] = vaultContributions.map((c: any, index: number) => ({
      id: c.id || `g-${index}`,
      sender: `${c.contributor.slice(0, 6)}...${c.contributor.slice(-4)}`,
      amountMon: Number(formatEther(BigInt(c.amount || '0'))),
      message: c.message || '',
      timestamp: new Date(),
    }))

    return {
      id: String(numericId),
      numericId,
      recipientName: v.recipientName,
      recipientAddress: v.recipient,
      creatorAddress: v.creator,
      targetAmountMon: Number(formatEther(BigInt(v.targetAmount || '0'))),
      totalCollectedMon: Number(formatEther(BigInt(v.totalCollected || '0'))),
      birthdayTimestamp: Number(v.birthdayTimestamp) * 1000,
      isClaimed: Boolean(v.isClaimed),
      nftTokenId: claim ? Number(claim.nftTokenId) : 0,
      greetings,
    }
  })
}

/**
 * Fallback Engine: Read Vaults & Greetings directly from Monad Testnet RPC node
 */
export async function fetchVaultsFromRPC(): Promise<VaultData[]> {
  const countBigInt = (await publicClient.readContract({
    address: CONTRACT_ADDRESSES.vault,
    abi: READ_VAULT_ABI,
    functionName: 'vaultCounter',
  })) as bigint

  const count = Number(countBigInt)
  if (count === 0) return []

  const vaults: VaultData[] = []

  for (let i = count; i >= 1; i--) {
    try {
      const v = (await publicClient.readContract({
        address: CONTRACT_ADDRESSES.vault,
        abi: READ_VAULT_ABI,
        functionName: 'vaults',
        args: [BigInt(i)],
      })) as any

      const rawGreetings = (await publicClient.readContract({
        address: CONTRACT_ADDRESSES.vault,
        abi: READ_VAULT_ABI,
        functionName: 'getGreetings',
        args: [BigInt(i)],
      })) as any[]

      const greetings: GreetingItem[] = (rawGreetings || []).map((g: any, index: number) => ({
        id: `g-rpc-${i}-${index}`,
        sender: `${g.sender.slice(0, 6)}...${g.sender.slice(-4)}`,
        amountMon: Number(formatEther(g.amount)),
        message: g.message,
        timestamp: new Date(Number(g.timestamp) * 1000),
      }))

      vaults.push({
        id: String(i),
        numericId: i,
        recipientName: v.recipientName || v[3],
        recipientAddress: v.recipient || v[2],
        creatorAddress: v.creator || v[1],
        targetAmountMon: Number(formatEther(v.targetAmount || v[4])),
        totalCollectedMon: Number(formatEther(v.totalCollected || v[6])),
        birthdayTimestamp: Number(v.birthdayTimestamp || v[5]) * 1000,
        isClaimed: Boolean(v.isClaimed || v[7]),
        nftTokenId: Number(v.nftTokenId || v[9] || 0),
        greetings,
      })
    } catch (err) {
      console.warn(`Error reading vault #${i} from RPC:`, err)
    }
  }

  return vaults
}

/**
 * Unified Live Data Fetcher with Indexer Primary & RPC Fallback
 */
export async function fetchLiveVaults(): Promise<{ vaults: VaultData[]; source: 'indexer' | 'rpc' }> {
  try {
    const vaults = await fetchVaultsFromIndexer()
    return { vaults, source: 'indexer' }
  } catch (err) {
    console.warn('Envio HyperIndex GraphQL offline/unreachable, falling back to Monad Testnet RPC:', err)
    const vaults = await fetchVaultsFromRPC()
    return { vaults, source: 'rpc' }
  }
}
