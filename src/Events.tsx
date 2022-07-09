import React, { useEffect, useState } from "react"
import { Template } from "./template"
import { GetEvents } from "./utils";
import {Event} from "./model"
import { Grid, Card, CardHeader, CardContent, Box, Typography, CardActions, Button } from "@mui/material";


export function Events() {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        GetEvents().then(response => {
            if ((response !== undefined) && (response !== null)) {
                setEvents(response as Event[])
            }
        })

    }, [])


    function getEvents() : JSX.Element {
       return  <React.Fragment>
        {events.map((event) => (
            // Enterprise card is full width at sm breakpoint
            <Grid
              item
              key={event.name}
              xs={12}
              sm={event.name === 'Enterprise' ? 12 : 6}
              md={4}
            >
              <Card>
                <CardHeader
                  title={event.date.toDateString()}
                  //subheader={event.subheader}
                  titleTypographyProps={{ align: 'center' }}
                  //action={event.name === 'Pro' ? <StarIcon /> : null}
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
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'baseline',
                      mb: 2,
                    }}
                  >
                    <Typography component="h2" variant="h5" color="text.primary">
                      {event.name}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">

                    </Typography>
                  </Box>
                  <ul>
                    {event.attendees.map((attendee) => (
                      <Typography
                        component="li"
                        variant="subtitle1"
                        align="center"
                        key={attendee.name}
                      >
                        {attendee.phone}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                  >
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
          </React.Fragment>
    }

    return <Template events={getEvents()} />
}