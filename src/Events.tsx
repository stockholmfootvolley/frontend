import React, { useEffect, useState } from "react"
import { Template } from "./template"
import { GetEvents } from "./utils";
import { Event } from "./model"
import { Grid, Card, CardHeader, CardContent, Box, Typography, CardActions, Button, Link } from "@mui/material";


export function Events() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    GetEvents().then(response => {
      if ((response !== undefined) && (response !== null)) {
        setEvents(response as Event[])
      }
    })

  }, [])


  function getEvents(): JSX.Element {
    return <React.Fragment>
      {events.map((event) => (
        <Grid
          item
          key={event.date.toDateString()}
          xs={12}
          sm={event.name === 'Enterprise' ? 12 : 6}
          md={4}
        >
          <Card>
            <CardHeader
              title={event.date.toDateString()}
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
                <Typography component="h2" variant="h5" color="text.primary">
                  {event.name}
                </Typography>
                <Typography component="h5" variant="caption" color="text.secondary">
                  <Link href={`https://maps.google.com/?q=${event.local}`}>{event.local.split(",")[0]}</Link>
                </Typography>
              </Box>
            </CardContent>
            <CardActions>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </React.Fragment>
  }

  return <Template events={getEvents()} />
}