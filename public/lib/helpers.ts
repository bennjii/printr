import {type Colour, Completeness, Constructor, DeliveryMethod, type Filament, to_latlon} from "./printr";

export const CONFIRM_PRINT_MODE = 4;

export function getSize(size: string, dp?: number): string {
    const sizes = [' Bytes', ' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];

    for (let i = 1; i < sizes.length; i++) {
        if (parseFloat(size) < Math.pow(1000, i))
            //@ts-ignore
            return (parseFloat(size) / Math.pow(1000, i - 1)).toFixed(dp !== null ? dp : 2).toString() + sizes[i - 1];
    }

    return size;
}

export const DELIVERY_OPTIONS: DeliveryMethod[] = [
    {
        method: "Pickup",
        prefered: true,
    },
    {
        method: "Delivery",
        prefered: true,
    }
]

export const FILAMENT_OPTIONS: Filament[] = [
    {
        name: "PLA",
        code: "PLA"
    },
    {
        name: "ABS",
        code: "ABS"
    },
    {
        name: "PETG",
        code: "PETG"
    },
    // Flexible Filaments
//    {
//        name: "TPU",
//        code: "F-TPU"
//    },
//    {
//        name: "TPE",
//        code: "F-TPE"
//    },
//    {
//        name: "TPC",
//        code: "F-TPC"
//    },
//    {
//        name: "Nylon Filament",
//        code: "NFL"
//    },
    {
        name: "PVA",
        code: "PVA"
    },
    {
        name: "HIPS",
        code: "HIPS"
    },
    {
        name: "Carbon Fiber",
        code: "CFIB"
    },
    {
        name: "Polycarbonate",
        code: "PCB"
    },
    {
        name: "ASA",
        code: "ASA"
    },
    {
        name: "Polypropylene",
        code: "PP"
    }
]

export const COLOUR_OPTIONS: Colour[] = [
    {
        name: "Sage Green",
        primary_hex: "#DDFBD8",
        secondary_hex: "#124111",
        code: "SGREEN"
    },
    {
        name: "Carnage Red",
        primary_hex: "#FBD8D8",
        secondary_hex: "#411111",
        code: "CRED"
    },
    {
        name: "Obscure White",
        primary_hex: "#F5F5F5",
        secondary_hex: "#888888",
        code: "WHITE"
    },
    {
        name: "Rogue Blue",
        primary_hex: "#D8E0FB",
        secondary_hex: "#111C41",
        code: "RBLUE"
    },
    {
        name: "Adventure Yellow",
        primary_hex: "#FBF3D8",
        secondary_hex: "#412811",
        code: "AYEL"
    },
];

export const FIXED_PRINTER_OPTIONS: Constructor[] = [
    {
        name: "Darlington Prints",
        location: to_latlon([151.186344, -33.888437]),
        completeness_level: Completeness.Absolute,
        id: "q39h29j21w0918h81g"
    },
    {
        name: "Central 3D Printers",
        location: to_latlon([151.2069986455657, -33.863668189634026]),
        completeness_level: Completeness.Absolute,
        id: "bnja991gb910tub2ag"
    },
    {
        name: "Jackson House 3D",
        location: to_latlon([151.16657477539488, -33.88951988211027]),
        completeness_level: Completeness.Partial,
        id: "g240b40t2083g49293"
    }
];

export const DEFAULT_CONFIG = {
    colour: COLOUR_OPTIONS[0]!,
    filament: FILAMENT_OPTIONS[0]!,
    delivery: DELIVERY_OPTIONS[0]!,
    files: [],
    constructor: null,
    DANGEROUS_PREFERS_NO_CHECKS: false
}

export const DEFAULT_PRINT_JOBS: PrintJobs[] = []