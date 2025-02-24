import { useEffect } from 'react'
import { RedPacketRPC } from '../messages.js'
import type { RedPacketNftJSONPayload } from '../types.js'
import { RedPacketNft } from './RedPacketNft.js'
import { TransactionConfirmDialogProvider } from './context/TokenTransactionConfirmDialogContext.js'

export interface RedPacketNftInPostProps {
    payload: RedPacketNftJSONPayload
}

export function RedPacketNftInPost({ payload }: RedPacketNftInPostProps) {
    useEffect(() => {
        RedPacketRPC.updateRedPacketNft({
            id: payload.txid,
            type: 'red-packet-nft',
            password: payload.privateKey,
            contract_version: payload.contractVersion,
        })
    }, [payload])
    return (
        <TransactionConfirmDialogProvider>
            <RedPacketNft payload={payload} />
        </TransactionConfirmDialogProvider>
    )
}
