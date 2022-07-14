import { Event } from "./model";
import Cookies from 'universal-cookie';

const API = "https://booking.ramonmedeiros.dev"

export function GetEvents(): Promise<void | Event[] | null | undefined> {
    const url = new URL("/events", API)
    return fetch(url, {
        method: "GET",
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
    const url = new URL(`/event/${date}`, API)
    return fetch(url, {
        method: "GET",
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
        headers:{
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
        headers:{
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
    return cookies.get("token")
}
