import { useState, useMemo } from 'react'
import { useAsync } from 'react-use'
import type { User } from '../types.js'
import { useCurrentVisitingIdentity, useLastRecognizedIdentity } from '../../../components/DataSource/useActivatedUI.js'
import { PetsPluginID } from '../constants.js'
import { useChainContext, useWeb3State } from '@masknet/web3-hooks-base'
import type { NetworkPluginID } from '@masknet/shared-base'

export function useUser() {
    const { account } = useChainContext<NetworkPluginID.PLUGIN_EVM>()
    const whoAmI = useLastRecognizedIdentity()

    return useMemo(() => {
        if (!account || !whoAmI || !whoAmI.identifier || whoAmI.identifier?.userId === '$unknown') return
        return {
            userId: whoAmI.identifier.userId,
            address: account,
        }
    }, [account, whoAmI])
}

export function useCurrentVisitingUser(flag?: number) {
    const [user, setUser] = useState<User>({ userId: '', address: '' })
    const identity = useCurrentVisitingIdentity()
    const { Storage } = useWeb3State()
    useAsync(async () => {
        const userId = location.href?.endsWith(identity.identifier?.userId ?? '')
            ? identity.identifier?.userId ?? ''
            : ''
        try {
            if (!Storage || !userId || userId === '$unknown') {
                setUser({
                    userId: '',
                    address: '',
                })
                return
            }
            const storage = Storage.createKVStorage(PetsPluginID)
            const address = (await storage.get<string>(userId)) ?? ''
            setUser({
                userId,
                address,
            })
        } catch {
            setUser({
                userId,
                address: '',
            })
        }
    }, [identity, flag, location.href, Storage])
    return user
}
