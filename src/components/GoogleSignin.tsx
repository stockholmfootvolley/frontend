import { Button } from "@mui/material"
import React, { useEffect, useState } from "react"
import Cookies from 'universal-cookie';
import { ParseJWTToken } from "../utils";

export default function GoogleSignin(props: { onLogin: Function }) {
    const [user, setUser] = useState(false)

    const handleGoogleSignIn = React.useCallback((res: CredentialResponse) => {
        if (!res.clientId || !res.credential) return
        const cookies = new Cookies();

        let payload = ParseJWTToken(res.credential)
        let expires = new Date(payload.exp * 1000)

        cookies.set("token", res.credential, { secure: true, sameSite: "strict", expires: expires })

        props.onLogin()
        setUser(true)
    }, [props])

    const initializeGsi = React.useCallback(() => {
        //@ts-ignore it.
        window.google.accounts.id.initialize({
            client_id: "547985747308-vosl44r2iclfhvnvb0jkkkr5b3amv6jg.apps.googleusercontent.com",
            callback: handleGoogleSignIn,
            auto_select: true
        })

        //@ts-ignore it.
        window.google.accounts.id.renderButton(
            document.getElementById("g_id_signin"),
            {
                theme: "filled_black",
                shape: "rectangular",
                size: "large"
            }
        )

    }, [handleGoogleSignIn]);

    useEffect(() => {
        const script = document.createElement("script")
        script.src = "https://accounts.google.com/gsi/client"
        script.async = true
        script.onload = initializeGsi
        document.querySelector("body")?.appendChild(script)
    }, [handleGoogleSignIn, initializeGsi, user])

    return (<Button id="g_id_signin" />)
}

interface CredentialResponse {
    credential?: string
    select_by?:
    | "auto"
    | "user"
    | "user_1tap"
    | "user_2tap"
    | "btn"
    | "btn_confirm"
    | "brn_add_session"
    | "btn_confirm_add_session"
    clientId?: string
}