import { Event } from "./model";
import Cookies from 'universal-cookie';

const API = "https://booking.ramonmedeiros.dev"

export function GetEvents(): Promise<void | Event[] | null | undefined> {
    const url = new URL("/events", API)
    let token = undefined
    try {
        token = GetToken()
    } catch {
        return Promise.reject("token not found")
    }

    return fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
        .then(response => response.json())
        .then(data => {
            const events = data as Event[]
            events.forEach(event => {
                event.date = new Date(event.date)
            });
            return events
        });
}

export function GetSpecificEvent(date: string): Promise<void | Event | null | undefined> {
    let token = undefined
    try {
        token = GetToken()
    } catch {
        return Promise.reject("token not found")
    }

    const url = new URL(`/event/${date}`, API)
    return fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
        .then(response => response.json())
        .then(data => {
            const events = data as Event
            return events
        });
}

export function AddAttendee(date: string): Promise<void | Event | null | undefined> {
    const url = new URL(`/event/${date}`, API)
    return fetch(url, {
        headers: {
            "Authorization": `Bearer ${GetToken()}`,
        },
        method: "POST",
    })
        .then(response => response.json())
        .then(data => {
            const events = data as Event
            return events
        });
}

export function RemoveAttendee(date: string): Promise<void | Event | null | undefined> {
    const url = new URL(`/event/${date}`, API)
    return fetch(url, {
        headers: {
            "Authorization": `Bearer ${GetToken()}`,
        },
        method: "DELETE",
    })
        .then(response => response.json())
        .then(data => {
            const events = data as Event
            return events
        });
}

export function GetToken(): string {
    const cookies = new Cookies();
    let value = cookies.get("token")

    if (value === undefined) {
        throw new Error("token not found")
    }

    return value
}
