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