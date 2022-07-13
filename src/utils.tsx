import { Attendee, Event } from "./model";

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

export function AddAttendee(date: string, attendee: Attendee): Promise<void | Event | null | undefined> {
    const url = new URL(`/event/${date}`, API)
    return fetch(url, {
        method: "POST",
        body: JSON.stringify(attendee)
    })
        .then(response => response.json())
        .then(data => {
            const events = data as Event
            return events
        });
}
