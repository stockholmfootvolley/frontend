import React, { useEffect, useState } from "react"
import { Link, Container, Typography, Grid, Box, Card, CardActions, CardContent, CardHeader, Fab, Snackbar, CircularProgress, } from "@mui/material"
import { useParams, } from "react-router-dom"
import { Template } from "../template"
import { GetSpecificEvent, AddAttendee, RemoveAttendee, showDateWeekTime, GetSwishQRCode } from "../utils"
import { Event, Attendee } from "../model"
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { blue, grey } from '@mui/material/colors';

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

    const [loadingRemove, setloadingRemove] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

    useEffect(() => {
        const updateCookies = () => {
            if (cookies.length !== document.cookie.length) {
                setCookie(document.cookie)
            }
        }
        window.setInterval(updateCookies, 100)

        GetSpecificEvent(params.date as string).then(response => {
            if ((response !== undefined) && (response !== null)) {
                if (response.price > 0) {
                    GetSwishQRCode(response.price, `${response.name} ${response.date}`)
                        .then(qrCodeResponse => {
                            let imgTag = document.getElementById("qrcode") as HTMLImageElement
                            imgTag.src = qrCodeResponse as string
                        })
                }
                setEvent(response as Event)
            }
        }).catch(e => {
            window.location.hash = "/"
        })
    }, [params.date, cookies])

    function handleClose(newEvent?: any, reason?: string) {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    function addAttendee() {
        if (!loading) {
            setSuccess(false)
            setLoading(true)
        }

        AddAttendee(params.date as string, null).then(response => {
            const event = response as Event
            event.date = new Date(event.date)
            setEvent(event)
            setLoading(false)
            return
        })
            .catch(error => {
                setErrorMessage("You seem to no be authenticated")
                setOpen(true)
            })
    }

    const buttonSx = {
        ...(success && {
            bgcolor: blue[500],
            '&:hover': {
                bgcolor: blue[700],
            },
        }),
    };

    function removeAttendee() {
        if (!loading) {
            setSuccess(false)
            setloadingRemove(true)
        }

        RemoveAttendee(params.date as string).then(response => {
            setEvent(response as Event)
            setloadingRemove(false)
        })
            .catch(error => {
                setErrorMessage("You seem to no be authenticated")
                setOpen(true)
            })
    }

    function getEvent() {
        if ((event === undefined) ||
            (event.date === undefined) ||
            (event.local === undefined)) {
            return
        }

        return <Card>
            <CardHeader
                title={`${showDateWeekTime(event.date)}`}
                subheader={
                    <Typography align="center" component="h5" variant="caption" color="text.secondary">
                        <Link target="_blank" href={`https://maps.google.com/?q=${event?.local}`}>{event?.local.split(",")[0]}</Link>
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
                    '&:hover': {
                        bgcolor: grey[300],
                    },
                }}
            />
            <CardContent>
                <img id="qrcode" alt="" />
                <Box
                    sx={{
                        display: 'inline',
                        justifyContent: 'center',
                        alignItems: 'baseline',
                        mb: 2,
                    }}
                >
                    {getAttendes(event?.attendees)}
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <Fab onClick={addAttendee} sx={buttonSx} color="primary" aria-label="add" variant="extended" disabled={loading}>
                            <PersonAddIcon />
                            &nbsp;&nbsp;I'm Coming
                        </Fab>
                        {loading && (
                            <CircularProgress
                                size={68}
                                sx={{
                                    color: blue[500],
                                    position: 'absolute',
                                    top: -6,
                                    left: -6,
                                    zIndex: 1,
                                }}
                            />
                        )}
                        <Fab onClick={removeAttendee} color="primary" aria-label="remove" variant="extended" disabled={loadingRemove}>
                            <PersonRemoveIcon />
                            &nbsp;&nbsp;I will not attend
                        </Fab>
                        {loadingRemove && (
                            <CircularProgress
                                size={68}
                                hidden={!loadingRemove}
                                sx={{
                                    color: blue[500],
                                    position: 'absolute',
                                    top: -6,
                                    left: -6,
                                    zIndex: 1,
                                }}
                            />
                        )}
                    </Box>
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

    return <Template>
        <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }} key={"singleeventcontainer"}>
            <Typography
                key={event?.name}
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
            >{event?.name}
            </Typography>
            <Typography
                hidden={event.price === 0}
                key={`${event?.name}sek`}
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
            >{`${event.price} sek`}
            </Typography>
            {getEvent()}
        </Container>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} key="snackbar">
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }} key="alert">
                {errorMessage}
            </Alert>
        </Snackbar>
        <Container maxWidth="md" component="main" key="singleeventcontainer2">
            <Grid container spacing={5} alignItems="flex-end" key="singleeventgrid">
            </Grid>
        </Container>
    </Template>
}
