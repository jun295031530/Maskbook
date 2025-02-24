import { type Plugin, usePluginWrapper } from '@masknet/plugin-infra/content-script'
import {
    ChainId,
    SchemaType,
    chainResolver,
    networkResolver,
    type NetworkType,
    isNativeTokenAddress,
} from '@masknet/web3-shared-evm'
import { Trans } from 'react-i18next'
import { Icons } from '@masknet/icons'
import { PluginID, NetworkPluginID } from '@masknet/shared-base'
import { ApplicationEntry } from '@masknet/shared'
import { useFungibleToken } from '@masknet/web3-hooks-base'
import { formatBalance } from '@masknet/web3-shared-base'
import { base } from '../base.js'
import { RedPacketMetaKey, RedPacketNftMetaKey } from '../constants.js'
import {
    RedPacketMetadataReader,
    RedPacketNftMetadataReader,
    renderWithRedPacketMetadata,
    renderWithRedPacketNftMetadata,
} from './helpers.js'
import { useI18N } from '../locales/index.js'
import type { RedPacketJSONPayload, RedPacketNftJSONPayload } from '../types.js'
import { RedPacketInjection } from './RedPacketInjection.js'
import RedPacketDialog from './RedPacketDialog.js'
import { RedPacketInPost } from './RedPacketInPost.js'
import { RedPacketNftInPost } from './RedPacketNftInPost.js'
import { openDialog } from './emitter.js'

function Render(
    props: React.PropsWithChildren<{
        name: string
    }>,
) {
    usePluginWrapper(true, { name: props.name })
    return <>{props.children}</>
}
const containerStyle = {
    display: 'flex',
    alignItems: 'center',
}

const sns: Plugin.SNSAdaptor.Definition = {
    ...base,
    init(signal) {},
    DecryptedInspector(props) {
        if (RedPacketMetadataReader(props.message.meta).ok)
            return (
                <Render name="Lucky Drop">
                    {renderWithRedPacketMetadata(props.message.meta, (r) => (
                        <RedPacketInPost payload={r} />
                    ))}
                </Render>
            )

        if (RedPacketNftMetadataReader(props.message.meta).ok)
            return (
                <Render name="NFT Lucky Drop">
                    {renderWithRedPacketNftMetadata(props.message.meta, (r) => (
                        <RedPacketNftInPost payload={r} />
                    ))}
                </Render>
            )
        return null
    },
    CompositionDialogMetadataBadgeRender: new Map([
        [
            RedPacketMetaKey,
            (_payload) => {
                return { text: <ERC20RedpacketBadge payload={_payload as RedPacketJSONPayload} /> }
            },
        ],
        [
            RedPacketNftMetaKey,
            (_payload) => {
                const payload = _payload as RedPacketNftJSONPayload
                return {
                    text: (
                        <div style={containerStyle}>
                            <Icons.NFTRedPacket size={16} />
                            {payload.message ? payload.message : 'An NFT Lucky Drop'}
                        </div>
                    ),
                }
            },
        ],
    ]),
    GlobalInjection: RedPacketInjection,
    CompositionDialogEntry: {
        dialog: RedPacketDialog,
        label: (
            <>
                <Icons.RedPacket size={16} />
                <Trans ns={PluginID.RedPacket} i18nKey="name" />
            </>
        ),
    },
    ApplicationEntries: [
        (() => {
            const icon = <Icons.RedPacket size={36} />
            const name = <Trans ns={PluginID.RedPacket} i18nKey="name" />
            const recommendFeature = {
                description: <Trans ns={PluginID.RedPacket} i18nKey="recommend_feature_description" />,
                backgroundGradient: 'linear-gradient(180.54deg, #FF9A9E 0.71%, #FECFEF 98.79%, #FECFEF 99.78%)',
                isFirst: true,
            }
            return {
                ApplicationEntryID: base.ID,
                RenderEntryComponent(EntryComponentProps) {
                    return (
                        <ApplicationEntry
                            title={name}
                            recommendFeature={recommendFeature}
                            {...EntryComponentProps}
                            icon={icon}
                            onClick={
                                EntryComponentProps.onClick
                                    ? () => EntryComponentProps.onClick?.(openDialog)
                                    : openDialog
                            }
                        />
                    )
                },
                appBoardSortingDefaultPriority: 1,
                marketListSortingPriority: 1,
                icon,
                description: <Trans ns={PluginID.RedPacket} i18nKey="description" />,
                name,
                tutorialLink: 'https://realmasknetwork.notion.site/0a71fd421aae4563bd07caa3e2129e5b',
                category: 'dapp',
                recommendFeature,
            }
        })(),
    ],
    wrapperProps: {
        icon: <Icons.RedPacket size={24} style={{ filter: 'drop-shadow(0px 6px 12px rgba(240, 51, 51, 0.2))' }} />,
        backgroundGradient:
            'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 100%), linear-gradient(90deg, rgba(28, 104, 243, 0.2) 0%, rgba(249, 55, 55, 0.2) 100%), #FFFFFF',
    },
}
interface ERC20RedpacketBadgeProps {
    payload: RedPacketJSONPayload
}

function ERC20RedpacketBadge(props: ERC20RedpacketBadgeProps) {
    const { payload } = props
    const t = useI18N()
    const { value: fetchedToken } = useFungibleToken(
        NetworkPluginID.PLUGIN_EVM,
        payload.token?.address ?? payload.token?.address,
    )
    const chainId = networkResolver.networkChainId((payload.network ?? '') as NetworkType) ?? ChainId.Mainnet
    const nativeCurrency = chainResolver.nativeCurrency(chainId)
    const tokenDetailed = payload.token?.schema === SchemaType.Native ? nativeCurrency : payload.token ?? fetchedToken
    return (
        <div style={containerStyle}>
            <Icons.RedPacket size={16} />
            {t.badge({
                balance: formatBalance(
                    payload.total,
                    tokenDetailed?.decimals ?? 0,
                    isNativeTokenAddress(payload.token?.address) ? 6 : 0,
                ),
                tokenName: tokenDetailed?.symbol ?? tokenDetailed?.name ?? 'Token',
                sender: payload.sender.name,
            })}
        </div>
    )
}

export default sns
