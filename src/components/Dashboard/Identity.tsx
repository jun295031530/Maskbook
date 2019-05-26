import * as React from 'react'
import { FixedWidthFonts } from '../../utils/theme'
import classNames from 'classnames'
import { Avatar } from '../../utils/components/Avatar'
import { Person } from '../../extension/background-script/PeopleService'
import { makeStyles, Typography, Card, CardHeader } from '@material-ui/core'
import { styled } from '@material-ui/styles'

interface Props {
    person: Person
    onClick?(): void
}
const FixedWidth = styled('div')({ fontFamily: FixedWidthFonts })
const useStyles = makeStyles(theme => ({
    card: {
        display: 'inline-block',
        marginBottom: theme.spacing(3),
        textAlign: 'start',
        cursor: 'pointer',
        transition: '0.4s',
        '&:hover': {
            boxShadow: theme.shadows[6],
        },
        width: '27.5em',
    },
    text: {
        fontWeight: 'bold',
        marginRight: theme.spacing(1),
    },
    avatarDisabled: {
        marginRight: 0,
    },
    emptyAvatar: {
        width: 0,
        height: 0,
    },
}))
export default function Identity({ person, onClick }: Props) {
    const { avatar, fingerprint, nickname, username } = person
    const classes = useStyles()
    return (
        <Card onClick={onClick} className={classes.card}>
            <CardHeader
                classes={{ avatar: classNames({ [classes.avatarDisabled]: !avatar }) }}
                avatar={<Avatar className={classNames({ [classes.emptyAvatar]: !avatar })} person={person} />}
                title={
                    <>
                        <Typography display="inline" className={classes.text}>
                            {nickname}
                        </Typography>
                        <Typography display="inline">{username}</Typography>
                    </>
                }
                subheader={<FixedWidth>{fingerprint}</FixedWidth>}
            />
        </Card>
    )
}
