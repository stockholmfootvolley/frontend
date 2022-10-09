export interface Event {
    id: string
    name: string
    date: Date
    attendees: Attendee[]
    local: string
    level: Level
    price: number
    max_participants: number
    qr_code: string
}

export interface Attendee {
    name: string
    phone: string
    sign_time: string
    paid_time: Date
}

export interface UserInfo {
    user: User
    picture: string
}

export interface User {
    name: string
    email: string
    level: Level
}

export enum Level {
    Basic = 0,
    Medium,
    Advanced,
}
