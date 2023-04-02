import { useState } from "react";
import {User} from "../lib/printr";
import Image from "next/image";
import { signOut } from "next-auth/react";

export const Notification = ({ name, description, type }: { name: string, description: string, type: "positive" | "negative" | "neutral" }) => {
    const [ showModal, setShowModal ] = useState(false);

    return (
        <div className="flex flex-row items-center gap-2 justify-between">
            <div className="flex flex-col">
                <p className="text-lg font-bold">{name}</p>
                <p className="text-gray-600">{description}</p>
            </div>

            <div>
                <></>
            </div>
        </div>
    )
}