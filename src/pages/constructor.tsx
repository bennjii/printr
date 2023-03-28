import {type NextPage} from "next";
import {useEffect, useState} from "react";
import {DEFAULT_PRINT_JOBS, DEFAULT_USER} from "../../public/lib/helpers";
import {Job, job_status_to_colour_pair, job_status_to_string, JobStatus} from "../../public/lib/printr";
import {Header} from "../../public/components/header";
import {JobElement} from "../../public/components/job";

const Home: NextPage = () => {
    const [ activePrint, setActivePrint ] = useState(DEFAULT_PRINT_JOBS[0]);
    const [ activeUser, setActiveUser ] = useState(DEFAULT_USER);

    const [ printList, setPrintList ] = useState<Job[]>(DEFAULT_PRINT_JOBS);
    const [ rawPrintList, setRawPrintList ] = useState<Job[]>(DEFAULT_PRINT_JOBS);

    const [ isNewInJobQueue, setIsNewInJobQueue ] = useState(true);

    const [ activeMenu, setActiveMenu ] = useState<number>(0);

    useEffect(() => {
        setIsNewInJobQueue(false)
    }, [activeMenu]);

    useEffect(() => {
        const diff = rawPrintList.filter(element => !printList.includes(element));

        if(diff.length > 0) {
            setActivePrint(diff[0])
        }

        setPrintList([ ...rawPrintList.sort((a, b) => a.current_status - b.current_status) ])
    }, [rawPrintList]);

    return (
            <div className="flex flex-col min-w-screen w-full min-h-screen h-full">
                <Header activeUser={activeUser} currentPage="CONST" />

                <div className="flex flex-row flex-1 w-full p-8 gap-8">
                    <div className="flex flex-1 flex-col gap-2 min-w-[300px] max-w-[300px]">
                        <p className="text-gray-600">Active Jobs</p>

                        {/* All of the prints in queue */}
                        {
                            printList.filter(k => k.current_status != 7 && k.current_status != 0).filter(k => k.current_status < 5).map(k => <JobElement key={`JOBELEM-${k.id}`} k={k} setActivePrint={setActivePrint} setActiveMenu={setActiveMenu} />)
                        }

                        <br />

                        <p className="text-gray-600">Inactive Jobs</p>
                        {
                            printList.filter(k => k.current_status != 7).filter(k => k.current_status >= 5).map(k => <JobElement key={`JOBELEM-${k.id}`} k={k} setActivePrint={setActivePrint} setActiveMenu={setActiveMenu} />)
                        }
                    </div>

                    <div className={`flex flex-col flex-1 py-[32px] pb-0`}>
                        <div className="flex flex-row items-center gap-2">
                            <div className={`flex flex-row items-center gap-2 px-4 py-2 rounded-t-md ${activeMenu == 0 ? "bg-gray-100" : "hover:bg-gray-100 cursor-pointer"}`} onClick={() => setActiveMenu(0)}>
                                Job Queue
                                {
                                isNewInJobQueue ? <div className="h-3 w-3 rounded-full bg-orange-400"></div> : <></>
                                }
                            </div>

                            <div className={`flex flex-row items-center gap-2 px-4 py-2 rounded-t-md ${activeMenu == 1 ? "bg-gray-100" : "hover:bg-gray-100 cursor-pointer"}`} onClick={() => setActiveMenu((1))}>{activePrint?.job_name}</div>
                        </div>

                        <div className={`flex flex-col flex-1 bg-gray-100 rounded-b-md rounded-r-md ${activeMenu != 0 ? "rounded-l-md" : ""}`}>
                            {
                                activeMenu == 0 ?
                                        <div className="flex flex-col gap-4 flex-1 p-12 flex-1 justify-start">
                                            <div className="flex justify-start flex-col gap-4 place-start" >
                                                <div className="flex flex-col">
                                                    <p className="font-bold text-xl">Job Queue</p>
                                                    <p className="text-gray-500">Place bids on new jobs to secure them</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col bg-white p-4 px-6 rounded-md flex-1 gap-2">
                                                {
                                                    printList.filter(k => k.current_status == 0).map((k, i, a) => {
                                                        return (
                                                            <>
                                                                <div className={`flex flex-row items-center `} style={{ display: "grid", gridTemplateColumns: "200px 100px 90px 75px 50px 1fr 15px 1fr" }}>
                                                                    <p className="font-bold">{k.job_name}</p>
                                                                    <p className="text-sm text-gray-400">{k.created_at}</p>
                                                                    <p className="text-sm text-gray-400">{k.job_preferences.colour.name}</p>
                                                                    <p className="text-sm text-gray-400">{k.job_preferences.delivery.method}</p>
                                                                    <p className="text-sm text-gray-400">{k.job_preferences.filament.name}</p>
                                                                    <p className="text-sm text-center cursor-pointer font-semibold bg-gray-100 rounded-md">Download File</p>
                                                                    <div></div>
                                                                    <p className="text-sm text-center cursor-pointer font-semibold bg-green-100 text-green-800 rounded-md">Make Offer</p>
                                                                </div>

                                                                {
                                                                    i == a.length-1 ? <></> : <div className="h-[2px] w-full bg-gray-200 border-solid rounded-full"></div>
                                                                }
                                                            </>
                                                        )
                                                    })
                                                }
                                            </div>

                                        </div>
                                :
                                        <div className="flex flex-col gap-4 flex-1 p-12 flex-1 justify-start">
                                            <div className="flex justify-start flex-col gap-4 place-start" >
                                                <div className="flex flex-col">
                                                    <div className="flex flex-row items-center gap-2">
                                                        <p className="font-bold text-xl">{activePrint?.job_name}</p>
                                                        <p className={`px-4 py-0 rounded-md ${job_status_to_colour_pair(activePrint?.current_status ?? JobStatus.DRAFT)}`}>{job_status_to_string(activePrint?.current_status ?? JobStatus.DRAFT)}</p>
                                                    </div>

                                                    <p className="text-gray-500">{activePrint?.file_name}</p>
                                                </div>
                                            </div>

                                            <div id="" className="flex flex-col gap-2 bg-gray-100 p-4 rounded-md" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-row items-center gap-2"  style={{ display: 'grid', gridTemplateColumns: '40% 1fr' }}>
                                                        <div className="bg-gray-200 px-2 rounded-md font-semibold">
                                                            File:
                                                        </div>
                                                        {activePrint?.file_name}
                                                    </div>

                                                    <div className="flex flex-row items-center gap-2" style={{ display: 'grid', gridTemplateColumns: '40% 1fr' }}>
                                                        <div className="bg-gray-200 px-2 rounded-md font-semibold">
                                                            Colour:
                                                        </div>
                                                        {activePrint?.job_preferences?.colour?.name}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-row items-center gap-2" style={{ display: 'grid', gridTemplateColumns: '40% 1fr' }}>
                                                        <div className="bg-gray-200 px-2 rounded-md font-semibold">
                                                            Filament:
                                                        </div>
                                                        {activePrint?.job_preferences?.filament?.name}
                                                    </div>

                                                    <div className="flex flex-row items-center gap-2" style={{ display: 'grid', gridTemplateColumns: '40% 1fr' }}>
                                                        <div className="bg-gray-200 px-2 rounded-md font-semibold">
                                                            Delivery Method:
                                                        </div>
                                                        {activePrint?.job_preferences?.delivery?.method}
                                                    </div>
                                                </div>
                                            </div>

                                            <p>{activePrint?.status_history?.map(k => { return ( <></> ) })}</p>
                                    </div>
                            }
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Home;
