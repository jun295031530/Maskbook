import { MaskColorVar, makeStyles } from '@masknet/theme'
import { Typography } from '@mui/material'
import { useDashboardI18N } from '../../../locales/index.js'
import formatDateTime from 'date-fns/format'
import type { BackupPreview } from '@masknet/backup-format'

const useStyles = makeStyles()(() => ({
    root: {
        padding: '19px 24px 9px',
        minHeight: 205,
        borderRadius: 8,
        background: MaskColorVar.infoBackground,
        width: '100%',
    },
    item: {
        paddingBottom: 10,
        display: 'flex',
        justifyContent: 'space-between',
    },
    sub: {
        paddingLeft: 30,
    },
}))

export interface Props {
    json: BackupPreview
}

export default function BackupPreviewCard({ json }: Props) {
    const t = useDashboardI18N()
    const { classes, cx } = useStyles()

    const records = [
        {
            name: t.settings_backup_preview_personas(),
            value: json.personas,
        },
        {
            name: t.settings_backup_preview_associated_account(),
            value: json.accounts,
            sub: true,
        },
        {
            name: t.settings_backup_preview_posts(),
            value: json.posts,
            sub: true,
        },
        {
            name: t.settings_backup_preview_contacts(),
            value: json.contacts,
            sub: true,
        },
        {
            name: t.settings_backup_preview_file(),
            value: json.files,
            sub: true,
        },
        {
            name: t.settings_backup_preview_wallets(),
            value: json.wallets,
        },
        {
            name: t.settings_backup_preview_created_at(),
            value: json.createdAt ? formatDateTime(json.createdAt, 'MM-dd-yyyy HH:mm:ss') : '',
        },
    ]

    return (
        <div className={classes.root}>
            {records.map((record, idx) => (
                <div className={cx(classes.item, record.sub ? classes.sub : '')} key={idx}>
                    <Typography variant="body2">{record.name}</Typography>
                    <Typography variant="body2">{record.value}</Typography>
                </div>
            ))}
        </div>
    )
}
