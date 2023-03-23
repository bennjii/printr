import { type Colour, DeliveryMethod, type Filament } from "./printr";

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