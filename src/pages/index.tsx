import {type NextPage} from "next";
import Image from "next/image";
import {useEffect, useState} from "react";
import {PrintStart} from "../../public/components/print";
import {DEFAULT_PRINT_JOBS, DEFAULT_USER} from "../../public/lib/helpers";
import {Job, JobStatus} from "../../public/lib/printr";
import {Header} from "../../public/components/header";
import {JobElement} from "../../public/components/job";
//<div className="bg-gray-900 px-4 py-2 rounded-lg text-white">Start Printing</div>

const Home: NextPage = () => {
    const [ expanded, setExpanded ] = useState(true);

    const [ activePrint, setActivePrint ] = useState(DEFAULT_PRINT_JOBS[0]);
    const [ activeUser, setActiveUser ] = useState(DEFAULT_USER);

    const [ printList, setPrintList ] = useState<Job[]>(DEFAULT_PRINT_JOBS);
    const [ rawPrintList, setRawPrintList ] = useState<Job[]>(DEFAULT_PRINT_JOBS);

    const [ activeMenu, setActiveMenu ] = useState<number>(0);

    useEffect(() => {
        let diff = rawPrintList.filter(element => !printList.includes(element));

        if(diff.length > 0) {
            setActivePrint(diff[0])
        }

        setPrintList([ ...rawPrintList.sort((a, b) => a.current_status - b.current_status) ])
    }, [rawPrintList]);

    return (
            <div className="flex flex-col min-w-screen w-full min-h-screen h-full">
                <Header activeUser={activeUser} currentPage="INDX" />

                <div className="flex flex-row flex-1 w-full p-8 gap-8">
                    <div className="flex flex-1 flex-col gap-2 min-w-[300px] max-w-[300px]">
                        <p className="text-gray-600">Current Prints</p>

                        {/* All of the prints in queue */}
                        {
                            printList.filter(k => k.current_status < 5).map(k => <JobElement k={k} setActivePrint={setActivePrint} setExpanded={setExpanded} />)
                        }

                        <br />

                        <p className="text-gray-600">Old Prints</p>
                        {
                            printList.filter(k => k.current_status >= 5).map(k => <JobElement k={k} setActivePrint={setActivePrint} setExpanded={setExpanded} />)
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

                            <PrintStart
                                expanded={expanded} setExpanded={setExpanded}
                                printList={rawPrintList} setPrintList={setRawPrintList}
                                />
                        </div>

                        <div className={`flex ${ !expanded ? "flex-1" : ""} bg-blue-100 overflow-none flex-col bg-gray-50 bg-opacity-50 rounded-md w-full`}>
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

                        <div className={`${!expanded ? "flex" : "none hidden"} flex-col flex-1`}>
                            <div className="flex flex-col gap-4 flex-1 p-12 flex-1 justify-start">
                                <div className="flex justify-start flex-col gap-4 place-start" >
                                    <div className="flex flex-col">
                                        <p className="font-bold text-xl">{activePrint.job_name}</p>
                                        <p className="text-gray-500">{activePrint.file_name}</p>
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
        </div>
    )
};

export default Home;
