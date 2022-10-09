import React, { useEffect, useState } from "react"
import { Template } from "../template"
import { GetToken, GetUser, NotAMember, SaveUserToken } from "../utils"
import { Typography, Container, Alert, Snackbar, Box, Card, CardContent, LinearProgress } from "@mui/material"
import GoogleSignin from "../components/GoogleSignin"
import { FacebookSignIn } from "../components/FacebookSignin"
import { useParams } from "react-router-dom"

export function Login() {
    const [open, setOpen] = React.useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [allowLogin, setAllowLogin] = useState(false)
    const [inProgress, setInProgress] = useState(true)
    let params = useParams()

    useEffect(() => {
        let token = GetToken()

        if (token === undefined) {
            setAllowLogin(true)
            setInProgress(false)
            return
        }

        GetUser()
            .then(response => {
                if ((response === undefined) || (response === null)) {
                    return
                }

                SaveUserToken(response)
                setInProgress(false)
                let redirectTo = "/"
                redirectTo += params.redirect as string
                window.location.hash = redirectTo
            }).catch(e => {
                switch (e) {
                    case NotAMember: {
                        setErrorMessage("You are not a member. Contact us on Instagram")
                        break
                    }
                    default: {
                        setErrorMessage("Could not connect to server")
                        break
                    }
                }
                setOpen(true)
            })

    }, [params.redirect, allowLogin])


    function onLogin() {
        setAllowLogin(false)
    }

    function handleClose(newEvent?: any, reason?: string) {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    function GetLoginButtons() {
        if (!allowLogin) {
            return
        }
        return <React.Fragment>
            <GoogleSignin onLogin={onLogin} />
            <br />
            <FacebookSignIn onLogin={onLogin} />
        </React.Fragment>
    }

    return <Template>
        <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
            {inProgress && <LinearProgress />}
            <Typography
                hidden={inProgress}
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
            >
                Login
            </Typography>

        </Container>
        <Container hidden={inProgress} maxWidth="lg" component="main">
            <Card hidden={inProgress}>
                <CardContent hidden={inProgress}>
                    <Box
                        hidden={inProgress}
                        sx={{
                            display: 'center',
                            justifyContent: 'center',
                            mb: 2,
                        }}
                    >
                        {GetLoginButtons()}
                    </Box>
                </CardContent>
            </Card>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Container>
    </Template>
}

