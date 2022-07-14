import React, { useEffect, useState } from "react"
import { Container, Typography, Grid, Box, Card, CardActions, CardContent, CardHeader, Fab, } from "@mui/material"
import { Link, useParams, } from "react-router-dom"
import { Template } from "./template"
import { GetSpecificEvent, AddAttendee, RemoveAttendee } from "./utils"
import { Event, Attendee} from "./model"
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Helmet } from "react-helmet";


export function SingleEvent() {
    let params = useParams()
    const [event, setEvent] = useState<Event>({} as Event)

    useEffect(() => {
        GetSpecificEvent(params.date as string).then(response => {
            if ((response !== undefined) && (response !== null)) {
                setEvent(response as Event)
            }
        })
    }, [params.date])

    function addAttendee() {
        AddAttendee(params.date as string).then(response => {
            setEvent(response as Event)
        })
            .catch(error => {
                console.log(error)
            })
    }

    function removeAttendee() {
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
                title={event.name}
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
                    <Fab onClick={addAttendee} color="primary" aria-label="add">
                        <AddIcon />
                    </Fab>
                    <Fab onClick={removeAttendee} color="primary" aria-label="add">
                        <RemoveIcon />
                    </Fab>
                    <Typography align="center" component="h5" variant="caption" color="text.secondary">
                        <Link to={`https://maps.google.com/?q=${event?.local}`}>{event?.local.split(",")[0]}</Link>
                    </Typography>
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

        return <ol>
            {attendees.map((attendee) => (
                <React.Fragment key={Math.random()}>
                    <Typography key={attendee.name} component="h2" variant="h5" color="text.primary"><li>{attendee.name}</li></Typography>
                </React.Fragment>
            ))}
        </ol>
    }

    return <Template>
        <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
            <Typography
                key={params.date}
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
            >{params.date}</Typography>
            {getEvent()}
        </Container>
        <Container maxWidth="md" component="main">
            <Grid container spacing={5} alignItems="flex-end">
            </Grid>
        </Container>
    </Template>
}
