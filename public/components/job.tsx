import {Job, JobStatus} from "../lib/printr";

export const JobElement = ({ k, setActiveMenu, setExpanded, setActivePrint }: { k: Job, setActiveMenu?: Function, setExpanded?: Function, setActivePrint: Function }) => {
    return (
        <div
            onClick={() => {
                if(setActiveMenu) setActiveMenu(1);
                if(setExpanded) setExpanded(false)
                setActivePrint(k)
            }}
            key={k.id}
            className={`flex flex-row items-center bg-gray-100 gap-4 px-4 py-2 rounded-md cursor-pointer ${k.current_status == JobStatus.COMPLETE || k.current_status == JobStatus.CANCELED || k.current_status == JobStatus.DRAFT ? "opacity-40" : ""}`}>
            <div className={`${k.current_status == JobStatus.PRINTING ? "bg-green-400" : k.current_status == JobStatus.BIDDING ? "bg-orange-400" : k.current_status == JobStatus.CANCELED ? "bg-red-400" : k.current_status == JobStatus.ENROUTE ? "" : k.current_status == JobStatus.PREPRINT ? "bg-yellow-400" : k.current_status == JobStatus.COMPLETE ? "bg-green-400" : k.current_status == JobStatus.DRAFT ? "bg-orange-400" : k.current_status == JobStatus.PREDELIVERY ? "bg-gray-400" : "bg-gray-400"} h-[20px] w-[20px] rounded-full`}></div>
            <div className="">
                <p className="font-bold">{k.job_name}</p>
                <p className="text-gray-600">{k.current_status == JobStatus.PRINTING ? `${k.estimated_completion} Remaining` : k.current_status == JobStatus.BIDDING ? "Bidding" : k.current_status == JobStatus.CANCELED ? "Canceled" : k.current_status == JobStatus.DRAFT ? "Draft" : k.current_status == JobStatus.ENROUTE ? "En Route" : k.current_status == JobStatus.PREPRINT ? "Preparing to print" : "" }</p>
            </div>
        </div>
    )
}