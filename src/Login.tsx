import React, { useEffect, useState } from "react"
import { Template } from "./template"
import { GetUser, NotAMember, TokenNotFound } from "./utils"
import { Typography, Container, Alert, Snackbar, Box, Card, CardActions, CardContent } from "@mui/material"
import GoogleSignin from "./GoogleSignin"

export function Login() {
    const [cookies, setCookie] = React.useState(document.cookie)
    const [open, setOpen] = React.useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [allowLogin, setAllowLogin] = useState(false)

    useEffect(() => {
        const updateCookies = () => {
            if (cookies.length !== document.cookie.length) {
                setCookie(document.cookie)
                setOpen(false)
            }
        }
        window.setInterval(updateCookies, 100)

        GetUser().then(response => {
            if ((response !== undefined) && (response !== null)) {
                window.location.hash = "/events"
            }
        }).catch(e => {
            switch (e) {
                case TokenNotFound: {
                    setAllowLogin(true)
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
        if (!allowLogin){
            return
        }

        return <GoogleSignin />
    }

    return <Template google={<GoogleSignin />}>
        <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
            <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
            >
                Login
            </Typography>
        </Container>
        {/* End hero unit */}
        <Container maxWidth="md" component="main">
            <Card>
                <CardContent>
                    <Box
                        sx={{
                            display: 'center',
                            justifyContent: 'center',
                            alignItems: 'baseline',
                            mb: 2,
                        }}
                    >
                        {GetLoginButtons()}
                    </Box>
                </CardContent>
                <CardActions>
                </CardActions>
            </Card>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Container>
    </Template>
}

