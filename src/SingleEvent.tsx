import React, { useEffect, useRef, useState } from "react"
import { Container, Typography, Grid, Box, Card, CardActions, CardContent, CardHeader, Modal, Fab, FormControl, InputAdornment, TextField, IconButton } from "@mui/material"
import { Link, useParams, } from "react-router-dom"
import { Template } from "./template"
import { GetSpecificEvent, AddAttendee } from "./utils"
import { Event, Attendee } from "./model"
import AddIcon from '@mui/icons-material/Add';
import AbcIcon from '@mui/icons-material/Abc';
import PhoneIcon from '@mui/icons-material/Phone';
import SaveIcon from '@mui/icons-material/Save';
import {Helmet} from "react-helmet";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    height: 300,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export function SingleEvent() {
    let params = useParams()
    const [event, setEvent] = useState<Event>({} as Event)
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const nameRef = useRef<HTMLInputElement>()
    const phoneRef = useRef<HTMLInputElement>()

    useEffect(() => {
        GetSpecificEvent(params.date as string).then(response => {
            if ((response !== undefined) && (response !== null)) {
                setEvent(response as Event)
            }
        })
    }, [params.date])

    function addAttendee() {
        let attendee = {
            name: nameRef.current?.value,
            phone: phoneRef.current?.value,
        } as Attendee;

        AddAttendee(params.date as string, attendee).then(response => {
            setOpen(false)
            setEvent(response as Event)
        })
            .catch(error => {
                console.log(error)
            })
    }

    function getDescriptionMeta() :string {
        if ((event === undefined)){
            return ""
        }

        let description = ""
        description += `${params.date} - ${event.name}\n`
        
        event.attendees.forEach((user, index)=>{
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
                <meta property="og:site_name" content="Stockholm Footvolley SITE"/>
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
                    <Fab onClick={handleOpen} color="primary" aria-label="add">
                        <AddIcon />
                    </Fab>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h4" component="h2">
                                I would like to join
                            </Typography>
                            <FormControl variant="standard" focused={true}>
                                <br />
                                <TextField
                                    inputRef={nameRef}
                                    label="Name"
                                    id="name"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AbcIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <br />
                                <TextField
                                    inputRef={phoneRef}
                                    label="Phone"
                                    id="phone"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PhoneIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <IconButton onClick={addAttendee} aria-label="Save" component="span" size="large"><SaveIcon /></IconButton>
                            </FormControl>
                        </Box>
                    </Modal>
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
