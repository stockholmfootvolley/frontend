import React, { useEffect, useState } from "react"
import { Container, Typography, Grid, Box, Card, CardActions, CardContent, CardHeader, Fab, Snackbar, } from "@mui/material"
import { Link, useParams, } from "react-router-dom"
import { Template } from "./template"
import { GetSpecificEvent, AddAttendee, RemoveAttendee, GetToken, showDate, showTime } from "./utils"
import { Event, Attendee, PaymentLink } from "./model"
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { Helmet } from "react-helmet";
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function SingleEvent() {
    let params = useParams()
    const [event, setEvent] = useState<Event>({} as Event)
    const [open, setOpen] = React.useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [cookies, setCookie] = React.useState(document.cookie)

    useEffect(() => {
        const updateCookies = () => {
            if (cookies.length !== document.cookie.length) {
                setCookie(document.cookie)
            }
        }
        window.setInterval(updateCookies, 100)

        GetSpecificEvent(params.date as string).then(response => {
            if ((response !== undefined) && (response !== null)) {
                setEvent(response as Event)
            }
        })
    }, [params.date, cookies])

    function handleClose(newEvent?: any, reason?: string) {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    function addAttendee() {
        if (GetToken() === undefined) {
            setErrorMessage("User is not authenticated")
            setOpen(true)
            return
        }

        AddAttendee(params.date as string).then(response => {
            if (Object.hasOwn(response as Object, "payment_link")) {
                const link = response as PaymentLink
                window.location.href = link.payment_link
            } else {
                const event = response as Event
                event.date = new Date(event.date)
                setEvent(event)
                return
            }

        })
            .catch(error => {
                console.log(error)
            })
    }

    function removeAttendee() {
        if (GetToken() === undefined) {
            setErrorMessage("User is not authenticated")
            setOpen(true)
            return
        }
        RemoveAttendee(params.date as string).then(response => {
            setEvent(response as Event)
        })
            .catch(error => {
                console.log(error)
            })
    }

    function getDescriptionMeta(): string {
        if ((event === undefined)) {
            return ""
        }

        let description = ""
        description += `${params.date} - ${event.name}\n`

        event.attendees.forEach((user, index) => {
            description += `${index}. ${user.name}\n`
        })

        return description
    }

    function getEvent() {
        if ((event === undefined) ||
            (event.date === undefined) ||
            (event.local === undefined)) {
            return
        }

        return <Card>
            <Helmet>
                <meta property="og:site_name" content="Stockholm Footvolley SITE" />
                <meta property="og:title" content={`Stockholm Footvolley - ${params.date}`} />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="article" />
                <meta property="og:description" content={getDescriptionMeta()} />
            </Helmet>
            <CardHeader
                title={`${showDate(event?.date)}\n${showTime(event?.date)}`}
                subheader={
                    <Typography align="center" component="h5" variant="caption" color="text.secondary">
                        <Link to={`https://maps.google.com/?q=${event?.local}`}>{event?.local.split(",")[0]}</Link>
                    </Typography>}
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{
                    align: 'center',
                }}
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[200]
                            : theme.palette.grey[700],
                }}
            />
            <CardContent>
                <Box
                    sx={{
                        display: 'inline',
                        justifyContent: 'center',
                        alignItems: 'baseline',
                        mb: 2,
                    }}
                >
                    {getAttendes(event?.attendees)}
                    <Fab onClick={addAttendee} color="primary" aria-label="add" variant="extended">
                        <PersonAddIcon />
                        &nbsp;&nbsp;I'm Coming
                    </Fab>
                    <Fab onClick={removeAttendee} color="primary" aria-label="remove" variant="extended">
                        <PersonRemoveIcon />
                        &nbsp;&nbsp;I will not attend
                    </Fab>
                </Box>
            </CardContent>
            <CardActions>
            </CardActions>
        </Card>
    }

    function getAttendes(attendees: Attendee[]) {
        if ((attendees === undefined)) {
            return
        }

        let normalList = [] as JSX.Element[]
        let normalSlice = attendees.slice(0, event.max_participants)
        normalSlice.forEach(attendee => {
            normalList.push(<Typography key={attendee.name} component="h2" variant="h5" color="text.primary"><li>{attendee.name}</li></Typography>)
        })

        let waitingList = [] as JSX.Element[]
        let waitingListHeader = [] as JSX.Element[]
        const waitingSlice = attendees.slice(event.max_participants, attendees.length)
        if (waitingSlice.length > 0) {
            waitingListHeader.push(<br />)
            waitingListHeader.push(<br />)
            waitingListHeader.push(<Typography key="waiting_list" component="h3" variant="h5" color="text.primary">Waiting List ({waitingSlice.length})</Typography>)
        }
        waitingSlice.forEach(attendee => {
            waitingList.push(<Typography key={attendee.name} component="h2" variant="h5" color="text.primary"><li>{attendee.name}</li></Typography>)
        })

        return <React.Fragment key={Math.random()}>
            <Typography key="list" component="h3" variant="h5" color="text.primary">Participants {`${normalList.length}/${event.max_participants}`}</Typography>
            <ol>
                {normalList}
            </ol>
            {waitingListHeader}
            <ol>
                {waitingList}
            </ol>
        </React.Fragment>
    }

    function getEventName(): string {
        let name = event?.name
        if (event.price > 0) {
            name += ` (${event.price} sek)`
        }

        return name
    }

    return <Template>
        <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
            <Typography
                key={event?.name}
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
            >{getEventName()}
            </Typography>
            {getEvent()}
        </Container>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                {errorMessage}
            </Alert>
        </Snackbar>
        <Container maxWidth="md" component="main">
            <Grid container spacing={5} alignItems="flex-end">
            </Grid>
        </Container>
    </Template>
}
