import {type NextPage} from "next";
import Image from "next/image";
import {useState} from "react";
import {PrintStart} from "../../public/components/print";
import {DEFAULT_PRINT_JOBS} from "../../public/lib/helpers";
import {JobStatus} from "../../public/lib/printr";
//<div className="bg-gray-900 px-4 py-2 rounded-lg text-white">Start Printing</div>

const Home: NextPage = () => {
    const [ expanded, setExpanded ] = useState(true);
    const [ activePrint, setActivePrint ] = useState(DEFAULT_PRINT_JOBS[0]);

    return (
            <div className="flex flex-col min-w-screen w-full min-h-screen h-full">
                <title>Printr</title>
                <link rel="icon" href="/favicon.ico" />

                <div className="flex flex-row items-center justify-between w-full min-w-screen px-8 py-4">
                    <p className="font-bold text-lg">printr</p>
                    {/* <Image src="/img/light_logo.png" alt="" height={69.5} width={200}></Image> */}

                    <p></p>

                    <div className="flex flex-row items-center gap-4">
                        <p>Ben White</p>
                        <Image src="/img/user_icons/blurple.svg" alt="" height={35} width={35}></Image>
                    </div>
                </div>

                <div className="flex flex-row flex-1 w-full p-8 gap-8">
                    <div className="flex flex-1 flex-col gap-2 min-w-[300px] max-w-[300px]">
                        <p className="text-gray-600">Current Prints</p>
                        {/* All of the prints in queue */}
                        {
                        DEFAULT_PRINT_JOBS.map(k => {
                            return (
                                    <div
                                        onClick={() => {
                                        setExpanded(false)
                                            setActivePrint(k)
                                    }}
                                        key={k.id}
                                        className={`flex flex-row items-center bg-gray-100 gap-4 px-4 py-2 rounded-md cursor-pointer ${k.current_status == JobStatus.COMPLETE ? "opacity-40" : ""}`}>
                                        <div className={`${k.current_status == JobStatus.PRINTING ? "bg-green-400" : k.current_status == JobStatus.BIDDING ? "bg-orange-400" : k.current_status == JobStatus.CANCELED ? "bg-red-400" : k.current_status == JobStatus.ENROUTE ? "" : k.current_status == JobStatus.PREPRINT ? "bg-yellow-400" : k.current_status == JobStatus.COMPLETE ? "bg-green-400" : k.current_status == JobStatus.DRAFT ? "bg-orange-400" : k.current_status == JobStatus.PREDELIVERY ? "bg-gray-400" : "bg-gray-400"} h-[20px] w-[20px] rounded-full`}></div>
                                        <div className="">
                                            <p className="font-bold">{k.job_name}</p>
                                            <p className="text-gray-600">{k.current_status == JobStatus.PRINTING ? `${k.estimated_completion} Remaining` : k.current_status == JobStatus.BIDDING ? "Bidding" : k.current_status == JobStatus.CANCELED ? "Canceled" : k.current_status == JobStatus.DRAFT ? "Draft" : k.current_status == JobStatus.ENROUTE ? "En Route" : k.current_status == JobStatus.PREPRINT ? "Preparing to print" : "" }</p>
                                        </div>
                                    </div
                                        >
                                        )
                        })
                    }
                    </div>

                    <div className={`flex flex-col gap-2 flex-1 py-[32px] pb-0`}>
                        <div className={`flex ${ expanded ? "flex-1 " : ""} bg-blue-100 overflow-none flex-col bg-gray-50 bg-opacity-50 rounded-md w-full`}>
                            <div className="cursor-pointer flex w-full bg-gray-100 px-4 py-2 rounded-md items-center gap-4" onClick={() => setExpanded(!expanded)}>
                                <div className="w-[14px] flex items-center justify-center">
                                    {
                                    expanded ?
                                        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L7 7L13 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    :
                                        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 13L7 7L1 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>

                                }
                                </div>

                                <p className="select-none font-semibold">Print Now</p>
                            </div>

                            <PrintStart expanded={expanded} setExpanded={setExpanded}/>
                        </div>

                        <div className={`flex ${ expanded ? "flex-1" : "h-fit"} bg-blue-100 overflow-none flex-col bg-gray-50 bg-opacity-50 rounded-md w-full`}>
                            <div className="cursor-pointer flex w-full bg-gray-100 px-4 py-2 rounded-md items-center gap-4" onClick={() => setExpanded(!expanded)}>
                                <div className="w-[14px] flex items-center justify-center">
                                    {
                                     !expanded ?
                                        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L7 7L13 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    :
                                        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 13L7 7L1 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>

                                }
                                </div>
                                <p className="select-none font-semibold">{activePrint.job_name}</p>
                            </div>

                            <div className={`flex-col gap-4 p-12 ${!expanded ? "flex flex-1" : "none hidden"}`}>
                                <div className="flex justify-start flex-col gap-4 place-start flex-1" >
                                    <div className="flex flex-col">
                                        <p className="font-bold text-xl">{activePrint.job_name}</p>
                                        <p className="text-gray-500">{activePrint.file_url}</p>
                                    </div>
                                </div>

                                <div id="" className="flex flex-col gap-2 bg-gray-100 p-4 rounded-md" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-row items-center gap-2"  style={{ display: 'grid', gridTemplateColumns: '40% 1fr' }}>
                                            <div className="bg-gray-200 px-2 rounded-md font-semibold">
                                                File(s):
                                            </div>
                                            {activePrint.job_preferences.files.map(k => k[0]?.name).join(', ')}
                                        </div>

                                        <div className="flex flex-row items-center gap-2" style={{ display: 'grid', gridTemplateColumns: '40% 1fr' }}>
                                            <div className="bg-gray-200 px-2 rounded-md font-semibold">
                                                Colour:
                                            </div>
                                            {activePrint.job_preferences.colour.name}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-row items-center gap-2" style={{ display: 'grid', gridTemplateColumns: '40% 1fr' }}>
                                            <div className="bg-gray-200 px-2 rounded-md font-semibold">
                                                Filament:
                                            </div>
                                            {activePrint.job_preferences.filament.name}
                                        </div>

                                        <div className="flex flex-row items-center gap-2" style={{ display: 'grid', gridTemplateColumns: '40% 1fr' }}>
                                            <div className="bg-gray-200 px-2 rounded-md font-semibold">
                                                Delivery Method:
                                            </div>
                                            {activePrint.job_preferences.delivery.method}
                                        </div>
                                    </div>
                                </div>

                                {(() => {
                                    switch(activePrint.current_status) {
                                        case JobStatus.DRAFT:
                                            return (
                                                <div>

                                                </div>
                                            )
                                        default:
                                            return (<></>)
                                    }
                                })()}

                            <p>{activePrint.status_history.map(k => {})}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Home;
