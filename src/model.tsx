
export interface Event {
    id: string
    name: string
    date: Date
    attendees: Attendee[]
    local: string
}

export interface Attendee {
    name: string
    phone: string
}