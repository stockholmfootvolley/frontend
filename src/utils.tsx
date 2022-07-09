import { Event } from "./model";

const API = "https://booking-dofknovuoa-lz.a.run.app"

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
    const url = new URL(`/events/${date}`, API)
    return fetch(url, {
        method: "GET",
    })
        .then(response => response.json())
        .then(data => {
            const events = data as Event
            return events
        });
}