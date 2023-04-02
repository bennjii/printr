import { useState } from "react";
import {User} from "../lib/printr";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { Notification } from "./notification";

export const NotificationMenu = ({ addNotification }: { addNotification: Function }) => {
    const [ notifications, setNotifications ] = useState<{ name: string, description: string, type: "positive" | "negative" | "neutral" }[]>([]);

    return (
        <div className="fixed">
            {
                notifications.map(e => {
                    return (
                        <Notification name={e.name} description={e.description} type={e.type} />
                    )
                })
            }
        </div>
    )
}