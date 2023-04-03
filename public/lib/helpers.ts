import { Printer, PrinterStatus } from "@prisma/client";
import {
    Bid,
    type Colour,
    Completeness,
    DeliveryMethod,
    type Filament,
    Job,
    JobStatus, MinifiedConstructor,
    to_latlon, User
} from "./printr";

export const CONFIRM_PRINT_MODE = 4;

export function getSize(size: string, dp?: number): string {
    const sizes = [' Bytes', ' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];

    for (let i = 1; i < sizes.length; i++) {
        if (parseFloat(size) < Math.pow(1000, i))
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

export const FIXED_PRINTER_OPTIONS: MinifiedConstructor[] = [
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
    message: "",
    constructor: null,
    DANGEROUS_PREFERS_NO_CHECKS: false
}

export const DEFAULT_PRINTERS: Printer[] = [
    {
        id: "FF1",
        model: "FlashForge Guider IIS V2",
        name: "FlashForge 1",

        created_at: new Date(),
        updated_at: new Date(),

        current_status: PrinterStatus.IDLE
    },
    {
        id: "FF2",
        model: "FlashForge Guider IIS V2",
        name: "FlashForge 2",

        created_at: new Date(),
        updated_at: new Date(),

        current_status: PrinterStatus.IDLE
    },
    {
        id: "UltiMakS3-1",
        model: "Ultimaker 2+ Connect",
        name: "Ultimaker 2+",

        created_at: new Date(),
        updated_at: new Date(),

        current_status: PrinterStatus.IDLE
    },
    {
        id: "UltiMakS3-1",
        model: "Ultimaker S3",
        name: "Ultimaker S3",

        created_at: new Date(),
        updated_at: new Date(),

        current_status: PrinterStatus.IDLE
    }
];

export const DEFAULT_PRINT_JOBS: Job[] = [
    {
        id: "abcdef",

        created_at: "2023-03-27",
        updated_at: "2023-03-27",

        current_status: JobStatus.PRINTING,
        status_history: [],
        estimated_completion: "32 minutes",

        job_name: "Clock Hands",
        file_url: "clock_hands.obj",
        file_name: "clock_hands.obj",

        job_preferences: {
            colour: COLOUR_OPTIONS[0]!,
            filament: FILAMENT_OPTIONS[0]!,
            delivery: {
                method: "Delivery",
                prefered: false
            },
            message: "",
            files: [],
            constructor: null,
            DANGEROUS_PREFERS_NO_CHECKS: false
        }
    },
    {
        id: "abcdef",

        created_at: "2023-03-27",
        updated_at: "2023-03-27",

        current_status: JobStatus.COMPLETE,
        status_history: [],
        estimated_completion: "32 minutes",

        file_url: "nose_cone.obj",
        file_name: "nose_cone.obj",
        job_name: "Nose Cone",

        job_preferences: {
            colour: COLOUR_OPTIONS[0]!,
            filament: FILAMENT_OPTIONS[0]!,
            delivery: {
                method: "Delivery",
                prefered: false
            },
            message: "",
            files: [],
            constructor: null,
            DANGEROUS_PREFERS_NO_CHECKS: false
        }
    },
    {
        id: "abcdef",

        created_at: "2023-03-27",
        updated_at: "2023-03-27",

        current_status: JobStatus.PREPRINT,
        status_history: [],
        estimated_completion: "Evaluation",

        file_url: "pen_holder.obj",
        file_name: "pen_holder.obj",
        job_name: "Pen Holder",

        job_preferences: {
            colour: COLOUR_OPTIONS[0]!,
            filament: FILAMENT_OPTIONS[0]!,
            delivery: {
                method: "Delivery",
                prefered: false
            },
            message: "",
            files: [],
            constructor: null,
            DANGEROUS_PREFERS_NO_CHECKS: false
        }
    },
    {
        id: "abcdef",

        created_at: "2023-03-27",
        updated_at: "2023-03-27",
        estimated_completion: "32 minutes",

        current_status: JobStatus.DRAFT,
        status_history: [],

        file_url: "sundial_print.obj",
        file_name: "sundial_print.obj",
        job_name: "Sundial",

        job_preferences: {
            colour: COLOUR_OPTIONS[0]!,
            filament: FILAMENT_OPTIONS[0]!,
            delivery: {
                method: "Delivery",
                prefered: false
            },
            message: "",
            files: [],
            constructor: null,
            DANGEROUS_PREFERS_NO_CHECKS: false
        }
    },
    {
        id: "abcdef",

        created_at: "2023-03-27",
        updated_at: "2023-03-27",
        estimated_completion: "32 minutes",

        current_status: JobStatus.BIDDING,
        status_history: [],

        file_url: "open_twist_mushroom.obj",
        file_name: "open_twist_mushroom.obj",
        job_name: "Open Twist Mushroom",

        job_preferences: {
            colour: COLOUR_OPTIONS[0]!,
            filament: FILAMENT_OPTIONS[0]!,
            delivery: {
                method: "Delivery",
                prefered: false
            },
            message: "",
            files: [],
            constructor: null,
            DANGEROUS_PREFERS_NO_CHECKS: false
        }
    },
    {
        id: "abcdef",

        created_at: "2023-03-27",
        updated_at: "2023-03-27",
        estimated_completion: "32 minutes",

        current_status: JobStatus.BIDDING,
        status_history: [],

        file_url: "open_twist_mushroom.obj",
        file_name: "open_twist_mushroom.obj",
        job_name: "Open Twist Mushroom",

        job_preferences: {
            colour: COLOUR_OPTIONS[0]!,
            filament: FILAMENT_OPTIONS[0]!,
            delivery: {
                method: "Delivery",
                prefered: false
            },
            message: "",
            files: [],
            constructor: null,
            DANGEROUS_PREFERS_NO_CHECKS: false
        }
    }
]

export const DEFAULT_USER: User = {
    id: "",
    email: "ben@bennjii.dev",
    name: "Ben White",

    created_at: new Date().getUTCDate().toString(),
    updated_at: new Date().getUTCDate().toString(),

    hash: "ABCDEFG",
    is_constructor: true,
    location: "Sydney, NSW",
}

export const DEFAULT_BIDS: Bid[] = [
    {
        id: "anaovna00sgenoin3",
        bidder: "Darlington Prints",

        created_at: "2023-03-27",
        updated_at: "2023-03-27",

        price: 15.20
    },
    {
        id: "anaovna00sgenoin3",
        bidder: "Central 3D Printers",

        created_at: "2023-03-27",
        updated_at: "2023-03-27",

        price: 18.42
    },
    {
        id: "anaovna00sgenoin3",
        bidder: "Jackson House Prints",

        created_at: "2023-03-27",
        updated_at: "2023-03-27",

        price: 12.86
    }
]
