
import React, { useState } from 'react';
import FacebookLogin from 'react-facebook-login';
import Cookies from 'universal-cookie';

export function FacebookSignIn() {
    const [user, setUser] = useState(false)

    function responseFacebook(payload: any) {
        const cookies = new Cookies();
        let expires = new Date(payload.data_access_expiration_time * 1000)
        cookies.set("token", payload.accessToken, { secure: true, sameSite: "strict", expires: expires })
        setUser(true)
    }

    return <FacebookLogin
        size="small"
        appId="733128067309986"
        autoLoad={false}
        fields="name,email,picture"
        callback={responseFacebook}
    />
}