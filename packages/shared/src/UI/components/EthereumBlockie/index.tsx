import { useBlockie } from '@masknet/web3-hooks-base'
import { Avatar, type AvatarProps } from '@mui/material'
import { makeStyles } from '@masknet/theme'

const useStyles = makeStyles()((theme) => ({
    icon: {
        width: 16,
        height: 16,
        backgroundColor: theme.palette.common.white,
        margin: 0,
    },
}))

export interface EthereumBlockieProps {
    name?: string
    address: string
    AvatarProps?: Partial<AvatarProps>
}

export function EthereumBlockie(props: EthereumBlockieProps) {
    const { address, name } = props
    const { classes } = useStyles()
    const blockie = useBlockie(address)

    return (
        <Avatar className={classes.icon} src={blockie}>
            {name?.slice(0, 1).toUpperCase()}
        </Avatar>
    )
}
