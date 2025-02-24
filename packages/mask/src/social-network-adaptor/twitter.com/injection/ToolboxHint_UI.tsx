import { ToolboxHintUnstyled } from '../../../components/InjectedComponents/ToolboxUnstyled.js'
import { useSideBarNativeItemStyleVariants } from './ToolboxHint.js'
import { styled, ListItemButton, Typography, ListItemIcon, Box } from '@mui/material'
import GuideStep from '../../../components/GuideStep/index.js'
import { useI18N } from '../../../utils/index.js'
import { useThemeSettings } from '../../../components/DataSource/useActivatedUI.js'
import { ButtonStyle } from '../constant.js'
import { useEffect, useMemo, useState } from 'react'
import { MutationObserverWatcher } from '@dimensiondev/holoflows-kit'
import { searchHomeLinkName } from '../utils/selector.js'

const Container = styled('div')`
    cursor: pointer;
    padding: 4px 0;
`
const ListItem = styled(ListItemButton)`
    border-radius: 9999px;
    display: inline-flex;
    &:hover {
        background: rgba(15, 20, 25, 0.1);
        ${({ theme }) => (theme.palette.mode === 'dark' ? 'background: rgba(217, 217, 217, 0.1);' : '')}
    }
`
const Text = styled(Typography)`
    margin-right: 16px;
    font-family: inherit;
    font-weight: 400;
    white-space: nowrap;
    color: ${({ theme }) => (theme.palette.mode === 'light' ? 'rgb(15, 20, 25)' : 'rgb(216, 216, 216)')};
`
const Icon = styled(ListItemIcon)`
    color: ${({ theme }) => (theme.palette.mode === 'light' ? 'rgb(15, 20, 25)' : 'rgb(216, 216, 216)')};
    min-width: 0;
`

export function ToolboxHintAtTwitter(props: { category: 'wallet' | 'application' }) {
    const { textMarginLeft, itemPadding, iconSize } = useSideBarNativeItemStyleVariants()
    const themeSettings = useThemeSettings()
    const buttonStyle = ButtonStyle[themeSettings.size]
    const Typography = useMemo(() => {
        return ({ children }: React.PropsWithChildren<{}>) => (
            <Text fontSize={buttonStyle.iconSize} marginLeft={textMarginLeft ?? '20px'}>
                {children}
            </Text>
        )
    }, [buttonStyle.iconSize, textMarginLeft])

    const [mini, setMini] = useState(false)

    useEffect(() => {
        const abortController = new AbortController()
        const watch = new MutationObserverWatcher(searchHomeLinkName()).startWatch(
            { childList: true, subtree: true },
            abortController.signal,
        )
        watch.addListener('onAdd', () => setMini(false), { signal: abortController.signal })
        watch.addListener('onRemove', () => setMini(true), { signal: abortController.signal })

        return () => abortController.abort()
    })

    const ListItemButton = useMemo(() => {
        return (
            props: React.PropsWithChildren<{
                onClick?: React.MouseEventHandler<HTMLDivElement>
            }>,
        ) => (
            <ListItem style={{ padding: `6px ${itemPadding ?? '11px'}` }} onClick={props.onClick}>
                {props.children}
            </ListItem>
        )
    }, [itemPadding])
    return (
        <ToolboxHintUnstyled
            iconSize={Number(iconSize.replace('px', '')) - 1}
            mini={mini}
            ListItemIcon={Icon}
            Typography={Typography}
            ListItemButton={ListItemButton}
            Container={Container}
            category={props.category}
        />
    )
}

export function ProfileLinkAtTwitter() {
    const { t } = useI18N()

    return (
        <>
            <GuideStep step={3} total={4} tip={t('user_guide_tip_3')}>
                <Box sx={{ position: 'absolute', left: 0, right: 0, width: '100%', height: '100%' }} />
            </GuideStep>
        </>
    )
}
