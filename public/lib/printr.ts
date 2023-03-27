export enum JobStatus {
    DRAFT, BIDDING, PREPRINT,
    PRINTING, PREDELIVERY, ENROUTE,
    COMPLETE, CANCELED
}

export enum PrinterStatus {
    IDLE, PRINTING, UNAVALIABLE
}

export type History<T> = {
    value: T,
    timestamp: String
}

export type Colour = {
    name: string,
    primary_hex: string,
    secondary_hex: string,
    code: string
}

export type Filament = {
    name: string,
    code: string
}

export type LatLon = {
    lattitude: number,
    longitude: number
}

export type User = {
    id: String,
    email: String,
    name: String,

    created_at: String,
    updated_at: String,

    hash: String,
    is_constructor: boolean,
    location: String,
}

export type Constructor = {
    id: String,
    name: String,

    created_at: String,
    updated_at: String,

    owner_id: String,
    location: String
}

export type Printer = {
    id: String,
    model: String,

    created_at: String,
    updated_at: String,

    current_status: PrinterStatus
}

export type Job = {
    id: String,

    created_at: String,
    updated_at: String,

    current_status: JobStatus,
    status_history: History<JobStatus>[],
    estimated_completion: String,

    job_preferences: PrintConfig

    file_url: String,
    job_name: String
}

export type Bid = {
    id: String,

    created_at: String,
    updated_at: String,

    price: number
}

export const to_latlon = (input: number[]): LatLon =>  {
    return {
        lattitude: input[0]!,
        longitude: input[1]!
    }
}

export const from_latlon = (input: LatLon): number[] => {
    return [ input.lattitude, input.longitude ];
}

export const capitalise_first_letter = (input: string): string => {
    return input.charAt(0).toUpperCase() + input.slice(1)
}

export const completeness_as_string = (input: Completeness): string => {
    switch(input) {
        case Completeness.Absolute:
            return "absolute"
        case Completeness.Minimal:
            return "minimal"
        case Completeness.None:
            return "no matches"
        case Completeness.Partial:
            return "partial"
        default:
            return "impartial"
    }
}

export enum Completeness {
    Absolute, Partial, Minimal, None
}

// Minimal (Stripped-Down) type returned from API.
export type Constructor = {
    name: string,
    location: LatLon,
    completeness_level: Completeness,
    id: string
}

export type Pending = null;

export type PrintConfig = {
    colour: Colour,
    filament: Filament,
    delivery: DeliveryMethod,
    files: FileList[],
    constructor: Pending | Constructor,
    DANGEROUS_PREFERS_NO_CHECKS: boolean
}

export type DeliveryMethod = {
    method: "Pickup" | "Delivery",
    prefered: boolean,
}