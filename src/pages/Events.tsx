import React, { useEffect, useState } from "react"
import { Template } from "../template"
import { GetEvents, NotAMember, showDateWeekTime, TokenNotFound } from "../utils"
import { Event } from "../model"
import { Grid, Card, CardHeader, CardContent, Box, Typography, CardActions, Container, Alert, Snackbar, Link } from "@mui/material"
import { Link as LinkRouter } from "react-router-dom";
import { grey, blue, blueGrey } from '@mui/material/colors';

export function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [cookies, setCookie] = React.useState(document.cookie)
  const [open, setOpen] = React.useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const updateCookies = () => {
      if (cookies.length !== document.cookie.length) {
        setCookie(document.cookie)
        setOpen(false)
      }
    }
    window.setInterval(updateCookies, 100)

    GetEvents().then(response => {
      if ((response !== undefined) && (response !== null)) {
        setEvents(response as Event[])
      }
    }).catch(e => {
      switch (e) {
        case TokenNotFound: {
          window.location.hash = "/"
          break
        }
        case NotAMember: {
          setErrorMessage("You are not a member. Wanna join us?")
          break
        }
        default: {
          setErrorMessage("Could not fetch events")
          break
        }
      }

      setOpen(true)
    })

  }, [cookies])

  function handleClose(newEvent?: any, reason?: string) {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  function getEvents(): JSX.Element {
    return <React.Fragment>
      {events.map((event) => (
        <Grid
          item
          key={event.date.toDateString()}
          xs={12}
          sm={6}
          md={4}
        >
          <Card sx={{ boxShadow: '1px 2px 3px' }}>
            <LinkRouter
              to={event.date.toISOString().split('T')[0]}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <CardHeader
                title={showDateWeekTime(event.date)}
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{
                  align: 'center',
                }}
                sx={{
                  boxShadow: '1px 2px 3px',
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? blue[600]
                      : blue[600],
                  '&:hover': {
                    bgcolor: blue[700],
                    color: blueGrey[50] ,
                  },
                }
                }
              />
            </LinkRouter>

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
                <Typography component="h2" variant="h5" color="text.primary">
                  Participants {`${event.attendees.length}/${event.max_participants}`}
                </Typography>
                <Typography component="h5" variant="caption" color="text.secondary">
                  <Link target="_blank" href={`https://maps.google.com/?q=${event.local}`}>{event.local.split(",")[0]}</Link>
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

  return <Template>
    <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="text.primary"
        gutterBottom
      >
        Upcoming training
      </Typography>
    </Container>
    {/* End hero unit */}
    <Container maxWidth="md" component="main">
      <Grid container spacing={5} alignItems="flex-end">
        {getEvents()}
      </Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  </Template>
}

