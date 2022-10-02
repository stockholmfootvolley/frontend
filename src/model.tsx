
export interface Event {
    id: string
    name: string
    date: Date
    attendees: Attendee[]
    local: string
    level: string
    price: number
    max_participants: number
    qr_code: string
}

export interface Attendee {
    name: string
    phone: string
    sign_time: string
}

export interface PaymentLink {
    payment_link: string
}

export interface User {
    name: string
    email: string
    level: string
}