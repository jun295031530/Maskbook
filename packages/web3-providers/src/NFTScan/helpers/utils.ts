import { createLookupTableResolver, NetworkPluginID } from '@masknet/shared-base'
import { ChainId } from '@masknet/web3-shared-evm'
import type { Web3Helper } from '@masknet/web3-helpers'
import { TrendingAPI } from '../../entry-types.js'
import type { EVM } from '../types/index.js'

export function resolveNFTScanHostName(pluginId: NetworkPluginID, chainId: Web3Helper.ChainIdAll) {
    if (pluginId === NetworkPluginID.PLUGIN_SOLANA) return 'https://solana.nftscan.com'

    switch (chainId) {
        case ChainId.Mainnet:
            return 'https://www.nftscan.com'
        case ChainId.Matic:
            return 'https://polygon.nftscan.com'
        case ChainId.BSC:
            return 'https://bnb.nftscan.com'
        case ChainId.Arbitrum:
            return 'https://arbitrum.nftscan.com'
        case ChainId.Avalanche:
            return 'https://avax.nftscan.com'
        case ChainId.Optimism:
            return 'https://optimism.nftscan.com'
        case ChainId.xDai:
            return 'https://gnosis.nftscan.com'
        case ChainId.Moonbeam:
            return 'https://moonbeam.nftscan.com'
        default:
            return ''
    }
}

export const resolveNFTScanRange = createLookupTableResolver<TrendingAPI.Days, EVM.CollectionTrendingRange>(
    {
        [TrendingAPI.Days.MAX]: 'all',
        [TrendingAPI.Days.ONE_DAY]: '1d',
        [TrendingAPI.Days.ONE_WEEK]: '7d',
        [TrendingAPI.Days.ONE_MONTH]: '30d',
        [TrendingAPI.Days.THREE_MONTHS]: '90d',
        [TrendingAPI.Days.ONE_YEAR]: '1y',
    },
    // NFTScan will discard range unrecognized range
    () => '1d',
)

export enum NonFungibleMarketplace {
    OpenSea = 'OpenSea',
    LooksRare = 'LooksRare',
}
