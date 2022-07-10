import React, { useEffect, useState } from "react"
import { Container, Typography, Grid, Box, Card, CardActions, CardContent, CardHeader } from "@mui/material"
import { Link, useParams, } from "react-router-dom"
import { Template } from "./template"
import { GetSpecificEvent } from "./utils"
import { Event } from "./model"

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

    function getEvent() {
        if ((event === undefined) ||
            (event.date === undefined) ||
            (event.local === undefined)) {
            return
        }

        return <Card>
            <CardHeader
                title={params.date}
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
                    <Typography align="center" component="h2" variant="h5" color="text.primary">
                        {event?.name}
                    </Typography>
                    <Typography align="center" component="h5" variant="caption" color="text.secondary">
                        <Link to={`https://maps.google.com/?q=${event?.local}`}>{event?.local.split(",")[0]}</Link>
                    </Typography>
                </Box>
            </CardContent>
            <CardActions>
            </CardActions>
        </Card>
    }

    return <Template>
        <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
            <Typography
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
