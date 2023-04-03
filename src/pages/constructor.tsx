import {GetServerSideProps, type NextPage} from "next";
import {createRef, useEffect, useState} from "react";
import {DEFAULT_PRINTERS, DEFAULT_PRINT_JOBS, DEFAULT_USER} from "../../public/lib/helpers";
import {job_status_to_colour_pair, job_status_to_string, job_status_to_type, JobStatus, PrintConfig} from "../../public/lib/printr";
import {Header} from "../../public/components/header";
import {JobElement} from "../../public/components/job";
import { Job, Printer, User } from "@prisma/client";
import { ModSession } from ".";
import { getServerSession } from "next-auth";
import { authOptions } from "../server/auth";

const Home: NextPage<{ auth: ModSession, metaTags: any }> = ({auth, metaTags}: { auth: ModSession, metaTags: any }) => {
    const [ activePrint, setActivePrint ] = useState<Job | null>(null);
    const [ activeUser, setActiveUser ] = useState(auth.user as any as User);

    const [ printList, setPrintList ] = useState<Job[]>([]);
    const [ printers, setPrinters ] = useState<Printer[]>(DEFAULT_PRINTERS);
    const [ rawPrintList, setRawPrintList ] = useState<Job[]>([]);

    const [ offerModal, setOfferModal ] = useState<{
        active: boolean,
        job_id: string | null,
        value: number
    }>({
        active: false,
        job_id: null,
        value: 0.0
    });

    useEffect(() => {
        fetch(`/api/user/${auth.id}`).then(async val => {
            const data: User = await val.json();
            setActiveUser(data);
        });

        fetch(`/api/jobs/user/${auth.id}`).then(async val => {
            const data: Job[] = await val.json();
            setRawPrintList(data);
            setPrintList(data);
            setActivePrint(data?.at(0) ?? null);
        });
    }, [])

    const [ isNewInJobQueue, setIsNewInJobQueue ] = useState(true);
    const [ activeMenu, setActiveMenu ] = useState<number>(0);
    const [ isLoading, setIsLoading ] = useState(false);

    const offer_ref = createRef<HTMLInputElement>();

    useEffect(() => {
        setIsNewInJobQueue(false)
    }, [activeMenu]);

    useEffect(() => {
        const diff = rawPrintList.filter(element => !printList.includes(element));

        if(diff.length > 0) {
            setActivePrint(diff[0] ?? null)
        }

        setPrintList([ ...rawPrintList.sort((a, b) => job_status_to_type(a.current_status) - job_status_to_type(b.current_status)) ])
    }, [rawPrintList]);

    return (
            <div className="flex flex-col min-w-screen w-full min-h-screen h-full">
                <Header activeUser={activeUser} currentPage="CONST" />

                {
                    offerModal.active ?
                    <div
                        onClick={(e) => {
                            e.stopPropagation()
                            setOfferModal({ ...offerModal, active: false });
                        }}
                        id="modal-cover"
                        className="z-50 fixed flex items-center bg-gray-900 bg-opacity-50 backdrop-blur-sm justify-center w-screen h-screen text-gray-900" style={{ minWidth: '100vw', minHeight: '100vh', left: 0, top: 0}}>
                        <div
                            onClick={(e) => {
                                e.stopPropagation()
                            }}
                            id="modal"
                            className="bg-white flex flex-col items-center gap-4 p-8 rounded-md min-w-[400px]">
                            <div className="flex flex-col flex-start justify-start items-start pr-32 w-full">
                                <p className="font-bold text-xl">Make Offer</p>
                                <p className="text-gray-500">{activePrint?.file_name}</p>
                            </div>

                            <div className="w-full flex flex-col flex-1">
                                <p className="text-gray-600 uppercase text-sm">Offer Value</p>
                                <input ref={offer_ref} placeholder="$15.00" className="px-4 py-2 rounded-md bg-gray-100" onChange={(e) => {
                                    setOfferModal({ ...offerModal, value: parseFloat(e.target.value) });
                                }}></input>
                            </div>

                            <div className="w-full flex flex-col flex-1">
                                <p className="text-gray-600 uppercase text-sm">Allocate Printer</p>
                                <select className="px-4 py-2 rounded-md bg-gray-100">
                                    {
                                        printers.map(k => {
                                            return (
                                                <option className="px-4 py-2 rounded-md">{k.current_status} - {k.name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>

                            <br />

                            <div
                                onClick={() => {
                                    if(!isLoading) {
                                        setIsLoading(true)
                                        fetch(`/api/offer/create`, {
                                            method: "POST",
                                            body: JSON.stringify({
                                                user_id: auth.id,
                                                job_id: offerModal.job_id,
                                                offer_value: offerModal.value
                                            })
                                        }).then(async val => {
                                            const data = await val.json();
                                            console.log("Bid", data);

                                            setOfferModal({ ...offerModal, active: false })
                                        });
                                    }
                                }}
                                className={`text-sm text-center cursor-pointer font-semibold ${ isLoading ? "bg-green-50 text-green-800 text-opacity-50" : "bg-green-100 text-green-800" } items-center justify-center p-2 rounded-md w-full flex-1 flex`}>
                                    {
                                        isLoading ? "Placing Offer..." : "Confirm Offer"
                                    }
                                </div>
                        </div>
                    </div>
                    :
                    <></>
                }

                <div className="flex flex-row flex-1 w-full p-8 gap-8">
                    <div className="flex flex-1 flex-col gap-2 min-w-[300px] max-w-[300px]">
                        <p className="text-gray-600">Active Jobs</p>

                        {/* All of the prints in queue */}
                        {
                            printList.filter(k => job_status_to_type(k.current_status) != 7 && job_status_to_type(k.current_status) != 0).filter(k => job_status_to_type(k.current_status) < 5).map(k => <JobElement key={`JOBELEM-${k.id}`} k={k} setActivePrint={setActivePrint} setActiveMenu={setActiveMenu} />)
                        }

                        <br />

                        <p className="text-gray-600">Inactive Jobs</p>
                        {
                            printList.filter(k => job_status_to_type(k.current_status) != 7).filter(k => job_status_to_type(k.current_status) >= 5).map(k => <JobElement key={`JOBELEM-${k.id}`} k={k} setActivePrint={setActivePrint} setActiveMenu={setActiveMenu} />)
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
                            <div className={`flex flex-row items-center gap-2 px-4 py-2 rounded-t-md ${activeMenu == 1 ? "bg-gray-100" : "hover:bg-gray-100 cursor-pointer"}`} onClick={() => setActiveMenu((1))}>Printer List</div>
                            <div className={`flex flex-row items-center gap-2 px-4 py-2 rounded-t-md ${activeMenu == 2 ? "bg-gray-100" : "hover:bg-gray-100 cursor-pointer"}`} onClick={() => setActiveMenu((2))}>Active Print - {activePrint?.job_name}</div>
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
                                                    printList.filter(k => job_status_to_type(k.current_status) == 0).map((k, i, a) => {
                                                        return (
                                                            <>
                                                                <div className={`flex flex-row items-center `} style={{ display: "grid", gridTemplateColumns: "200px 100px 90px 75px 50px 1fr 15px 1fr" }}>
                                                                    <p className="font-bold">{k.job_name}</p>
                                                                    <p className="text-sm text-gray-400">{k.created_at.toString()}</p>
                                                                    <p className="text-sm text-gray-400">{(k.job_preferences as any as PrintConfig).colour.name}</p>
                                                                    <p className="text-sm text-gray-400">{(k.job_preferences as any as PrintConfig).delivery.method}</p>
                                                                    <p className="text-sm text-gray-400">{(k.job_preferences as any as PrintConfig).filament.name}</p>
                                                                    <p className="text-sm text-center cursor-pointer font-semibold bg-gray-100 rounded-md">Download File</p>
                                                                    <div></div>
                                                                    <p
                                                                        onClick={() => {
                                                                            setOfferModal({ ...offerModal, active: true, job_id: k.id })
                                                                        }}
                                                                        className="text-sm text-center cursor-pointer font-semibold bg-green-100 text-green-800 rounded-md">Make Offer</p>
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
                            activeMenu == 1 ?
                                        <div className="flex flex-col gap-4 flex-1 p-12 flex-1 justify-start">
                                            <div className="flex justify-start flex-col gap-4 place-start" >
                                                <div className="flex flex-col">
                                                    <p className="font-bold text-xl">Printer List</p>
                                                    <p className="text-gray-500">See what all your printers are doing</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col bg-white p-4 px-6 rounded-md flex-1 gap-2">
                                                {
                                                    printers.map((k, i, a) => {
                                                        return (
                                                            <>
                                                                <div className={`flex flex-row items-center `} style={{ display: "grid", gridTemplateColumns: "1fr 50px 150px 1fr 100px" }}>
                                                                    <p className="font-bold">{k.name}</p>
                                                                    <p className="text-sm text-gray-600">{k.current_status}</p>
                                                                    <p className="text-sm text-gray-400">{k.created_at.toDateString()}</p>
                                                                    <div></div>
                                                                    <p className="text-sm text-center cursor-pointer font-semibold bg-orange-100 text-orange-800 rounded-md">Idle Printer</p>
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
                                                        <p className={`px-4 py-0 rounded-md ${job_status_to_colour_pair(job_status_to_type(activePrint?.current_status ?? "") ?? JobStatus.DRAFT)}`}>{job_status_to_string(job_status_to_type(activePrint?.current_status ?? "") ?? JobStatus.DRAFT)}</p>
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
                                                        {(activePrint?.job_preferences as any as PrintConfig)?.colour?.name}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-row items-center gap-2" style={{ display: 'grid', gridTemplateColumns: '40% 1fr' }}>
                                                        <div className="bg-gray-200 px-2 rounded-md font-semibold">
                                                            Filament:
                                                        </div>
                                                        {(activePrint?.job_preferences as any as PrintConfig)?.filament?.name}
                                                    </div>

                                                    <div className="flex flex-row items-center gap-2" style={{ display: 'grid', gridTemplateColumns: '40% 1fr' }}>
                                                        <div className="bg-gray-200 px-2 rounded-md font-semibold">
                                                            Delivery Method:
                                                        </div>
                                                        {(activePrint?.job_preferences as any as PrintConfig)?.delivery?.method}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* <p>{activePrint?.status_history?.map(k => { return ( <></> ) })}</p> */}
                                    </div>
                            }
                    </div>
                </div>
            </div>
        </div>
    )
};

export const  getServerSideProps: GetServerSideProps = async (context) => {
    const metaTags = {
		"og:title": [`Upload. Print. Collect.`],
		"og:description": ["Reseda boasts up to 1GB/s real world throughput, affordably pricing, and incredible security."],
		"og:url": [`https://reseda.app/`],
	};

    const session: ModSession | null = await getServerSession(context.req, context.res, authOptions);

    if(!session) {
        return {
            props: {
                metaTags
            },
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    session.user.image = session.user.image ?? "";
    session.user_info = session.user_info ?? "";

    console.log(session)

    return {
        props: {
            metaTags,
            auth: session
        }
    }
}

export default Home;
