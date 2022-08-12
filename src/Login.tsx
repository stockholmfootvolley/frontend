import React, { useEffect, useState } from "react"
import { Template } from "./template"
import { GetUser, NotAMember, TokenNotFound } from "./utils"
import { Typography, Container, Alert, Snackbar, Box, Card, CardContent, LinearProgress } from "@mui/material"
import GoogleSignin from "./GoogleSignin"
import { FacebookSignIn } from "./FacebookSignin"

export function Login() {
    const [cookies, setCookie] = React.useState(document.cookie)
    const [open, setOpen] = React.useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [allowLogin, setAllowLogin] = useState(false)
    const [inProgress, setInProgress] = useState(true)

    useEffect(() => {
        const updateCookies = () => {
            if (cookies.length !== document.cookie.length) {
                setCookie(document.cookie)
                setOpen(false)
            }
        }
        window.setInterval(updateCookies, 100)

        GetUser().then(response => {
            setInProgress(false)
            if ((response !== undefined) && (response !== null)) {
                window.location.hash = "/events"
            }
        }).catch(e => {
            switch (e) {
                case TokenNotFound: {
                    setAllowLogin(true)
                    setInProgress(false)
                    setErrorMessage("Login with Google before continue")
                    break
                }
                case NotAMember: {
                    setErrorMessage("You are not a member. Contact us on instagram?")
                    break
                }
                default: {
                    setErrorMessage("Could not connect to server")
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

    function GetLoginButtons() {
        if (!allowLogin) {
            return
        }
        return <React.Fragment>
            <GoogleSignin />
            <br/>
            <FacebookSignIn />
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

