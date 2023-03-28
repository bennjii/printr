export enum JobStatus {
    BIDDING, PREPRINT,
    PRINTING, PREDELIVERY, ENROUTE,

    COMPLETE, CANCELED, DRAFT
}

export const job_status_to_string = (status: JobStatus) => {
    switch(status) {
        case JobStatus.BIDDING:
            return "Bidding"
        case JobStatus.CANCELED:
            return "Canceled"
        case JobStatus.COMPLETE:
            return "Complete"
        case JobStatus.DRAFT:
            return "Draft"
        case JobStatus.ENROUTE:
            return "En Route"
        case JobStatus.PREDELIVERY:
            return "Pre-Delivery"
        case JobStatus.PREPRINT:
            return "Pre-Print"
        case JobStatus.PRINTING:
            return "Printing"
    }
}

export const job_status_to_colour_pair = (status: JobStatus) => {
    return status == JobStatus.PRINTING ? "bg-green-100 text-green-800" : status == JobStatus.BIDDING ? "bg-orange-100 text-orange-800" : status == JobStatus.CANCELED ? "bg-red-100 text-red-800" : status == JobStatus.ENROUTE ? "bg-yellow-100 text-yellow-800" : status == JobStatus.PREPRINT ? "bg-yellow-100 text-yellow-800" : status == JobStatus.COMPLETE ? "bg-green-100 text-green-800" : status == JobStatus.DRAFT ? "bg-orange-100 bg-orange-800" : status == JobStatus.PREDELIVERY ? "bg-gray-400 text-gray-800" : "bg-gray-400 text-gray-800"
}

export enum PrinterStatus {
    IDLE, PRINTING, UNAVALIABLE
}

export type History<T> = {
    value: T,
    timestamp: string
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
    id: string,
    email: string,
    name: string,

    created_at: string,
    updated_at: string,

    hash: string,
    is_constructor: boolean,
    location: string,
}

export type Constructor = {
    id: string,
    name: string,

    created_at: string,
    updated_at: string,

    owner_id: string,
    location: string
}

export type Printer = {
    id: string,
    model: string,

    created_at: string,
    updated_at: string,

    current_status: PrinterStatus
}

export type Job = {
    id: string,

    created_at: string,
    updated_at: string,

    current_status: JobStatus,
    status_history: History<JobStatus>[],
    estimated_completion: string | null,

    job_preferences: PrintConfig

    file_url: string,
    file_name: string,
    job_name: string
}

export type Bid = {
    id: string,

    created_at: string,
    updated_at: string,

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
export type MinifiedConstructor = {
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