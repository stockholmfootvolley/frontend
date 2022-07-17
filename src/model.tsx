
export interface Event {
    id: string
    name: string
    date: Date
    attendees: Attendee[]
    local: string
    level: string
    max_participants: number
}

export interface Attendee {
    name: string
    phone: string
    sign_time: string
}
