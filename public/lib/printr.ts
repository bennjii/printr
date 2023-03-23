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

export type PrintConfig = {
    colour: Colour,
    filament: Filament,
    delivery: DeliveryMethod,
    files: FileList[],
    DANGEROUS_PREFERS_NO_CHECKS: boolean
}

export type DeliveryMethod = {
    method: "Pickup" | "Delivery",
    prefered: boolean,
}