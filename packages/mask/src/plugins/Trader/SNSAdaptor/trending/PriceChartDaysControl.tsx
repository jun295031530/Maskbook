import { Link, Stack, Typography } from '@mui/material'
import { makeStyles } from '@masknet/theme'
import { TrendingAPI } from '@masknet/web3-providers/types'
import { resolveDaysName } from '../../pipes.js'

const useStyles = makeStyles()((theme) => ({
    root: {
        background: theme.palette.background.input,
        borderRadius: 28,
        padding: theme.spacing(0.5),
    },
    active: {
        boxShadow: '0px 2px 5px 1px rgba(0, 0, 0, 0.05)',
        background: theme.palette.background.paper,
        fontWeight: 700,
    },
    link: {
        padding: theme.spacing(1),
        width: '25%',
        cursor: 'pointer',
        borderRadius: 18,
        textAlign: 'center',
        color: theme.palette.text.primary,
        textDecoration: 'none !important',
    },
}))

const Days = TrendingAPI.Days

export const DEFAULT_RANGE_OPTIONS = [Days.ONE_DAY, Days.ONE_WEEK, Days.ONE_MONTH, Days.ONE_YEAR, Days.MAX]

export interface PriceChartDaysControlProps {
    days: number
    rangeOptions?: TrendingAPI.Days[]
    onDaysChange?: (days: number) => void
}

export function PriceChartDaysControl({
    rangeOptions = DEFAULT_RANGE_OPTIONS,
    days,
    onDaysChange,
}: PriceChartDaysControlProps) {
    const { classes, cx } = useStyles()
    return (
        <Stack className={classes.root} direction="row" gap={2}>
            {rangeOptions.map((daysOption) => (
                <Link
                    className={cx(classes.link, days === daysOption ? classes.active : '')}
                    key={daysOption}
                    onClick={() => onDaysChange?.(daysOption)}>
                    <Typography sx={{ ':hover': { fontWeight: 700 } }} component="span">
                        {resolveDaysName(daysOption)}
                    </Typography>
                </Link>
            ))}
        </Stack>
    )
}
