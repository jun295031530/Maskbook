import { useAsyncFn } from 'react-use'
import { NetworkPluginID, type BindingProof, type ECKeyIdentifier } from '@masknet/shared-base'
import type { TwitterBaseAPI } from '@masknet/web3-providers/types'
import { ChainId, SchemaType } from '@masknet/web3-shared-evm'
import type { AllChainsNonFungibleToken, NextIDAvatarMeta } from '../../types.js'
import { useSaveToNextID } from './useSaveToNextID.js'
import { useSaveStringStorage } from '../index.js'

export type AvatarInfo = TwitterBaseAPI.AvatarInfo & {
    avatarId: string
}

export function useSave(pluginID: NetworkPluginID) {
    const saveToNextID = useSaveToNextID()
    const saveToStringStorage = useSaveStringStorage(pluginID)

    return useAsyncFn(
        async (
            account: string,
            isBindAccount: boolean,
            token: AllChainsNonFungibleToken,
            data: AvatarInfo,
            persona: ECKeyIdentifier,
            proof: BindingProof,
        ) => {
            if (!token.contract?.address) return
            const info: NextIDAvatarMeta = {
                pluginId: pluginID,
                nickname: data.nickname,
                userId: data.userId,
                imageUrl: data.imageUrl,
                avatarId: data.avatarId,
                address: token.contract?.address ?? '',
                ownerAddress: account,
                tokenId: token.tokenId || token.id,
                chainId: (token.contract?.chainId ?? ChainId.Mainnet) as ChainId,
                schema: (token.contract?.schema ?? SchemaType.ERC721) as SchemaType,
            }

            if (isBindAccount && NetworkPluginID.PLUGIN_EVM) {
                return saveToNextID(info, account, persona, proof)
            }

            return saveToStringStorage(data.userId, account, info)
        },
        [saveToNextID, saveToStringStorage, pluginID],
    )
}
