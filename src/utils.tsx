import { Event, UserInfo } from "./model";
import Cookies from 'universal-cookie';
import * as jose from 'jose'
import { Level } from './model'
const API = "https://booking.ramonmedeiros.dev"

export const TokenNotFound = "token not found"
export const NotAMember = "not a member"

export function GetEvents(): Promise<void | Event[] | null | undefined> {
    const url = new URL("/events", API)

    return fetch(url, {
        method: "GET",
    })
        .then(response => {
            if (response.status === 401) {
                return Promise.reject(NotAMember)
            }

            return response.json().then(data => {
                const events = [] as Event[]
                let a = data as any[]
                a.forEach(event => {
                    event.level = stringToLevel(event.level)
                    event.date = new Date(event.date)
                    events.push(event as Event)
                });
                return events
            })
        })
        .catch(error => {
            return Promise.reject(error)
        })
}

export function GetSpecificEvent(date: string): Promise<void | Event | null | undefined> {
    const url = new URL(`/event/${date}`, API)
    return fetch(url, {
        method: "GET",
    })
        .then(response => response.json())
        .then(data => {
            const event = data as Event
            event.date = new Date(event.date)
            event.level = stringToLevel(data.level)
            return event
        })
        .catch(error => {
            console.error(error)
        })
}

export function GetUser(): Promise<void | UserInfo | null | undefined> {
    let token = GetToken()
    if (token === undefined) {
        return Promise.reject(TokenNotFound)
    }

    const url = new URL(`/user`, API)
    return fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
        .then(response => response.json())
        .then(data => {
            const user = data as UserInfo
            return user
        })
        .catch(error => {
            console.error(error)
        })
}

export function AddAttendee(date: string): Promise<void | Event | null | undefined> {
    const url = new URL(`/event/${date}`, API)

    let token = GetToken()
    if (!token) {
        redirectLogin(date)
    }

    return fetch(url, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        method: "POST",
    })
        .then(response => {
            const data = response.json()
            const event = data as unknown as Event
            event.date = new Date(event.date)
            return event
        })
        .catch(error => {
            console.error(error)
        })
}

export function RemoveAttendee(date: string): Promise<void | Event | null | undefined> {
    const url = new URL(`/event/${date}`, API)
    let token = GetToken()
    if (!token) {
        redirectLogin(date)
    }

    return fetch(url, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        method: "DELETE",
    })
        .then(response => response.json())
        .then(data => {
            const event = data as Event
            event.date = new Date(event.date)
            return event
        })
        .catch(error => {
            console.error(error)
        })
}

export function GetToken(): string | undefined {
    const cookies = new Cookies()
    return cookies.get("token")
}

export function GetUserToken(): UserInfo | undefined {
    const cookies = new Cookies()
    let userInfo = cookies.get("user")

    if (userInfo !== undefined) {
        let user = JSON.parse(atob(userInfo)) as UserInfo
        return user
    }

    return userInfo
}

export function SaveUserToken(user: UserInfo) {
    const cookies = new Cookies()
    var today = new Date();
    today.setHours(today.getHours() + 4);
    cookies.set("user", btoa(JSON.stringify(user)), { secure: true, expires: today })
}


export function ParseJWTToken(token: string): any {
    return jose.decodeJwt(token) as any
}

export function showDateAndTime(date: Date): string {
    if (date === undefined)
        return ""
    return `${showDate(date)} ${showTime(date)}`
}

export function showDate(date: Date): string {
    if (date === undefined)
        return ""
    return `${date.getFullYear()}-${getZeroInFront(date.getMonth() + 1)}-${getZeroInFront(date.getUTCDate())}`
}

export function showDateWeekTime(date: Date): string {
    if (date === undefined)
        return ""

    return date.toLocaleTimeString('en-us', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
}

export function showTime(date: Date): string {
    if (date === undefined)
        return ""
    return `${getZeroInFront(date.getHours())}:${getZeroInFront(date.getMinutes())}`
}

function getZeroInFront(n: number): string {
    if (n < 10) {
        return `0${n}`
    }
    return `${n}`
}

export function UpdatePayment(date: string): Promise<void | Event | null | undefined> {
    const url = new URL(`/event/${date}`, API)

    let token = GetToken()
    if (!token) {
        redirectLogin(date)
    }

    return fetch(url, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        method: "PUT",
    })
        .then(response => response.json())
        .then(data => {
            const event = data as Event
            event.date = new Date(event.date)
            return event
        })
        .catch(error => {
            console.error(error)
        })
}

export function redirectLogin(date: string) {
    let url = new URL(window.location.origin)
    url.pathname = window.location.pathname
    url.hash = "/login/" + date as string
    window.location.href = url.toString()
}

export function stringToLevel(s: string): number {
    switch (s) {
        case "ADVANCED": {
            return Level.Advanced
        }
        case "MEDIUM": {
            return Level.Medium
        }
        default: {
            return Level.Basic
        }
    }
}
