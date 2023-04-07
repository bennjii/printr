import { Job } from "@prisma/client";
import {JobStatus, job_status_to_type} from "../lib/printr";
import { useState } from "react";

export const JobElement = ({ k, setActiveMenu, setExpanded, setActivePrint }: { k: Job, setActiveMenu?: Function, setExpanded?: Function, setActivePrint: Function }) => {
    const [ status, setStatus ] = useState(job_status_to_type(k.current_status));

    return (
        <div
            onClick={() => {
                if(setActiveMenu) setActiveMenu(1);
                if(setExpanded) setExpanded(false)
                setActivePrint(k)
            }}
            key={k.id}
            className={`flex flex-row items-center bg-gray-100 gap-4 px-4 py-2 rounded-md cursor-pointer ${status == JobStatus.COMPLETE || status == JobStatus.CANCELED || status == JobStatus.DRAFT ? "opacity-40" : ""}`}>
            <div className={`${status == JobStatus.PRINTING ? "bg-green-400" : status == JobStatus.BIDDING ? "bg-orange-400" : status == JobStatus.CANCELED ? "bg-red-400" : status == JobStatus.ENROUTE ? "bg-blue-400" : status == JobStatus.PREPRINT ? "bg-yellow-400" : status == JobStatus.COMPLETE ? "bg-green-400" : status == JobStatus.DRAFT ? "bg-orange-400" : status == JobStatus.PREDELIVERY ? "bg-gray-400" : status == JobStatus.REVIEW ? "bg-purple-400" : "bg-gray-400"} h-[20px] w-[20px] rounded-full`}></div>
            <div className="">
                <p className="font-bold">{k.job_name}</p>
                <p className="text-gray-600">{status == JobStatus.PRINTING ? `${k.estimated_completion} Remaining` : status == JobStatus.BIDDING ? "Bidding" : status == JobStatus.CANCELED ? "Canceled" : status == JobStatus.DRAFT ? "Draft" : status == JobStatus.ENROUTE ? "En Route" : status == JobStatus.PREPRINT ? "Preparing to print" : status == JobStatus.REVIEW ? "Awaiting review" : status == JobStatus.PREDELIVERY ? "Waiting for evidence" : "" }</p>
            </div>
        </div>
    )
}