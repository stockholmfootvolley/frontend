export interface Event {
    id: string
    name: string
    date: Date
    attendees: Attendee[]
    payments: Payment[]
    local: string
    level: Level
    price: number
    max_participants: number
    qr_code: string
}

export interface Attendee {
    name: string
    phone: string
    email: string
    sign_time: string
}

export interface Payment {
    email: string
    paid_timestamp: Date
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
