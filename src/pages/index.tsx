import {GetServerSideProps, type NextPage} from "next";
import {createRef, useEffect, useState} from "react";
import {PrintStart} from "../../public/components/print";
import {DEFAULT_PRINT_JOBS, DEFAULT_USER, FIXED_PRINTER_OPTIONS} from "../../public/lib/helpers";
import {History, job_status_to_colour_pair, job_status_to_string, job_status_to_type, JobStatus, PrintConfig} from "../../public/lib/printr";
import {Header} from "../../public/components/header";
import {JobElement} from "../../public/components/job";
import Image from "next/image";
import {getSession, useSession} from "next-auth/react";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../server/auth";
import { Bid, Job, User } from "@prisma/client";
import { Map } from "@components/map";

export type ModSession = {
    user: {
        name: string,
        email: string,
        image: string
    }
    expires: string,
    id: string,
    jwt: {
        name: string,
        email: string,
        sub: string,
        id: string,
        iat: string
        exp: string,
        jti: string
    },
    user_info: any
}

const Home: NextPage<{ auth: ModSession, metaTags: any }> = ({auth, metaTags}: { auth: ModSession, metaTags: any }) => {
    const [ activePrint, setActivePrint ] = useState<Job | null>(null);
    const [ activeUser, setActiveUser ] = useState(auth.user as any as User);

    const [ printList, setPrintList ] = useState<Job[]>([]);
    const [ rawPrintList, setRawPrintList ] = useState<Job[]>([]);

    const [ activeMenu, setActiveMenu ] = useState<number>(0);
    const [ isLoading, setIsLoading ] = useState(false);

    const message_ref = createRef<HTMLInputElement>();

    useEffect(() => {
        fetch(`/api/user/${auth.id}`).then(async val => {
            const data: User = await val.json();
            setActiveUser(data);
        });

        fetch(`/api/jobs/user/${auth.id}`).then(async val => {
            const data: Job[] = await val.json();
            setRawPrintList(data);
            setPrintList(data);

            if(activePrint == null) setActivePrint(data?.at(0) ?? null);
        });
    }, [])

    // useEffect(() => {
    //     const diff = rawPrintList.filter(element => !printList.includes(element));

    //     if(diff.length > 0) {
    //         //@ts-ignore
    //         setActivePrint(diff[0])
    //     }

    //     setPrintList([ ...rawPrintList.sort((a, b) => job_status_to_type(a.current_status) - job_status_to_type(b.current_status)) ])
    // }, [rawPrintList]);

    return (
            <div className="flex flex-col min-w-screen w-full min-h-screen h-full">
                <Header activeUser={activeUser} currentPage="INDX" />

                <div className="flex flex-row flex-1 w-full p-8 gap-8">
                    <div className="flex flex-1 flex-col gap-2 min-w-[300px] max-w-[300px]">
                        <p className="text-gray-600">Current Prints</p>
                        {/* All of the prints in queue */}
                        {
                            printList.filter(k => job_status_to_type(k.current_status) < 5).length > 0 ?
                            printList.filter(k => job_status_to_type(k.current_status) < 5).map(k => <JobElement key={`JOBELEM-${k.id}-${k.current_status}`} k={k} setActivePrint={setActivePrint} setActiveMenu={setActiveMenu} />)
                            :
                            <p className="w-full text-center text-gray-400 text-sm pt-4">No current prints</p>
                        }

                        <br />

                        <p className="text-gray-600">Old Prints</p>
                        {
                            printList.filter(k => job_status_to_type(k.current_status) >= 5).length > 0 ?
                            printList.filter(k => job_status_to_type(k.current_status) >= 5).map(k => <JobElement key={`JOBELEM-${k.id}--${k.current_status}`} k={k} setActivePrint={setActivePrint} setActiveMenu={setActiveMenu} />)
                            :
                            <p className="w-full text-center text-gray-400 text-sm pt-4">No old/archived prints</p>
                        }
                    </div>

                    <div className={`flex flex-col flex-1 py-[32px] pb-0`}>
                        <div className="flex flex-row items-center gap-2">
                            <div className={`flex flex-row items-center gap-2 px-4 py-2 rounded-t-md ${activeMenu == 0 ? "bg-gray-100" : "hover:bg-gray-100 cursor-pointer"}`} onClick={() => setActiveMenu(0)}>
                                Print Now
                            </div>

                            <div className={`flex flex-row items-center gap-2 px-4 py-2 rounded-t-md ${activeMenu == 1 ? "bg-gray-100" : "hover:bg-gray-100 cursor-pointer"}`} onClick={() => setActiveMenu((1))}>{activePrint?.job_name}</div>
                        </div>

                        <div className={`flex flex-col flex-1 bg-gray-100 rounded-b-md rounded-r-md ${activeMenu != 0 ? "rounded-l-md" : ""}`}>
                            {
                                activeMenu == 0 ?
                                    <div className={`flex flex-1 overflow-none flex-col bg-gray-100 rounded-md w-full`}>
                                        <PrintStart
                                            activeMenu={activeMenu} setActiveMenu={setActiveMenu}
                                            printList={rawPrintList} setPrintList={setPrintList}
                                            setRawPrintList={setRawPrintList} setActivePrint={setActivePrint}
                                            user_id={auth.id}
                                        />
                                    </div>
                                :

                        <div className={`flex flex-1 overflow-none flex-col bg-gray-100 rounded-md w-full`}>
                            <div className={`flex flex-col flex-1`}>
                                <div className="flex flex-col gap-8 flex-1 p-12 flex-1 justify-start">
                                    <div className="flex justify-start flex-row items-center justify-between pr-4 gap-4 place-start" >
                                        <div className="flex flex-col">
                                            <div className="flex flex-row items-center gap-2">
                                                <p className="font-bold text-xl">{activePrint?.job_name}</p>
                                                <p className={`px-4 py-0 rounded-md ${job_status_to_colour_pair(job_status_to_type(activePrint?.current_status ?? "") ?? JobStatus.DRAFT)}`}>{job_status_to_string(job_status_to_type(activePrint?.current_status ?? "") ?? JobStatus.DRAFT)}</p>
                                            </div>
                                            <p className="text-gray-500">{activePrint?.file_name}</p>
                                        </div>

                                        <div>
                                            {
                                                job_status_to_type(activePrint?.current_status ?? "") == JobStatus.DRAFT ?
                                                    <div className="px-4 py-1 bg-gray-100 rounded-md cursor-pointer">Edit</div>
                                                    :
                                                    <></>
                                            }
                                        </div>
                                    </div>

                                    <div id="" className="flex flex-col gap-2 bg-gray-100 rounded-md" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-row items-center gap-2"  style={{ display: 'grid', gridTemplateColumns: '40% 1fr' }}>
                                                <div className="bg-gray-200 px-2 rounded-md font-semibold">
                                                    File(s):
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

                                    {(() => {
                                        switch(job_status_to_type(activePrint?.current_status ?? "")) {
                                            case JobStatus.DRAFT:
                                                return (
                                                    <div className="flex flex-row items-start justify-center flex-1">
                                                        <div className="flex flex-col gap-2 items-center justify-center flex-1 h-full">
                                                            <p className="text-gray-400">This is currently a draft</p>
                                                            <p className="bg-green-100 text-green-800 px-2 py-1 rounded-md w-fit cursor-pointer">Request Print</p>
                                                        </div>

                                                        <div className="flex flex-col gap-2 items-center justify-center flex-1 rounded-md overflow-hidden bg-gray-200 h-full">
                                                            <Image width="800" height="250" src="https://cdn.thingiverse.com/assets/77/43/33/73/12/featured_preview_d5f32543-af68-4dd7-ba21-261384749770.png" alt="Print" />
                                                        </div>
                                                    </div>
                                                )
                                            case JobStatus.REVIEW:
                                                return (
                                                    <div className="flex flex-row items-start justify-center flex-1">
                                                        <div className="flex flex-col gap-2 items-center justify-center flex-1 h-full">
                                                            <div className="flex flex-1 items-center justify-center">EVIDENCE</div>
                                                            <input ref={message_ref} placeholder="Notes regarding your decision" className="px-4 py-2 rounded-md w-full" onChange={(e) => {
                                                                    // setConfig({ ...config, message: e.target.value });
                                                                }}></input>
                                                            <div className="flex flex-row items-center gap-4 w-full justify-end">
                                                                <p 
                                                                    onClick={() => {
                                                                        if(isLoading) return;
                                                                        setIsLoading(true)

                                                                        // Update job to en-route
                                                                        fetch(`/api/jobs/complete-job`, {
                                                                            method: "POST",
                                                                            body: JSON.stringify({ 
                                                                                job_id: activePrint?.id,
                                                                                notes: message_ref.current?.value
                                                                            })
                                                                        }).then(b => {
                                                                            fetch(`/api/jobs/user/${auth.id}`).then(async val => {
                                                                                const data: Job[] = await val.json();
                                                                                setRawPrintList([ ...data ]);
                                                                                setPrintList([ ...data ]);
                                                                                // setActivePrint(data?.at(0) ?? null);

                                                                                setActivePrint({
                                                                                    ...activePrint,
                                                                                    current_status: "ENROUTE"
                                                                                } as Job);

                                                                                setIsLoading(false);
                                                                            });
                                                                        })
                                                                    }}
                                                                    className={`${isLoading ? "opacity-40" : "cursor-pointer"} bg-green-100 text-green-800 text-center px-4 rounded-md`}>Accept</p>
                                                                <p 
                                                                    onClick={() => {
                                                                        if(isLoading) return;
                                                                        setIsLoading(true)

                                                                        // Update job to pre-delivery
                                                                        fetch(`/api/jobs/finish-print`, {
                                                                            method: "POST",
                                                                            body: JSON.stringify({ 
                                                                                job_id: activePrint?.id,
                                                                                notes: message_ref.current?.value
                                                                            })
                                                                        }).then(b => {
                                                                            fetch(`/api/jobs/user/${auth.id}`).then(async val => {
                                                                                const data: Job[] = await val.json();
                                                                                setRawPrintList([ ...data ]);
                                                                                setPrintList([ ...data ]);
                                                                                // setActivePrint(data?.at(0) ?? null);

                                                                                setActivePrint({
                                                                                    ...activePrint,
                                                                                    current_status: "PREDELIVERY"
                                                                                } as Job);

                                                                                setIsLoading(false);
                                                                            });
                                                                        })
                                                                    }}
                                                                    className={`${isLoading ? "opacity-40" : "cursor-pointer"} bg-blue-100 text-blue-800 text-center px-4 rounded-md`}>Request More Evidence</p>
                                                                <p 
                                                                    onClick={() => {
                                                                        if(isLoading) return;
                                                                        setIsLoading(true)

                                                                        // Update job to pre-print
                                                                        fetch(`/api/jobs/accept-bid`, {
                                                                            method: "POST",
                                                                            body: JSON.stringify({ bid_id: null })
                                                                        }).then(b => {
                                                                            fetch(`/api/jobs/user/${auth.id}`).then(async val => {
                                                                                const data: Job[] = await val.json();
                                                                                setRawPrintList([ ...data ]);
                                                                                setPrintList([ ...data ]);
                                                                                // setActivePrint(data?.at(0) ?? null);

                                                                                setActivePrint({
                                                                                    ...activePrint,
                                                                                    current_status: "PREPRINT"
                                                                                } as Job);

                                                                                setIsLoading(false);
                                                                            });
                                                                        })
                                                                    }}
                                                                    className={`${isLoading ? "opacity-40" : "cursor-pointer"} bg-red-100 text-red-800 text-center px-4 rounded-md cursor-pointer`}>Re-Print</p>
                                                            </div>
                                                            <br />
                                                            <p className="text-gray-400">When requesting a re-print, you understand you incur the wait and must communicate responsibly in order to fulfil your order correctly.</p>
                                                        </div>
                                                    </div>
                                                )
                                            case JobStatus.PREDELIVERY:
                                                    return (
                                                        <div className="flex flex-row items-start justify-center flex-1">
                                                            <div className="flex flex-col gap-2 items-center justify-center flex-1 h-full">
                                                                <p className="text-gray-400">Soon, your constructor will upload evidence of your print, you may review them</p>
                                                            </div>
                                                        </div>
                                                    )
                                            case JobStatus.PRINTING:
                                                    return (
                                                        <div className="flex flex-row items-start justify-center flex-1">
                                                            <div className="flex flex-col gap-2 items-center justify-center flex-1 h-full">
                                                                <p className="text-gray-400">Your print is being printed, please wait for it to be completed!</p>
                                                            </div>
                                                        </div>
                                                    )
                                            case JobStatus.READYFORPICKUP:
                                                return (
                                                    <div className="flex flex-row items-start justify-center flex-1">
                                                        <div className="flex flex-col gap-2 items-center justify-center flex-1 h-full rounded-md overflow-hidden">
                                                            <Map constructors={FIXED_PRINTER_OPTIONS} />
                                                        </div>
                                                    </div>
                                                )
                                            case JobStatus.BIDDING:
                                                return (
                                                    <div className="flex flex-row items-start justify-center flex-1 gap-4">
                                                        <div className="flex flex-col gap-2 justify-start items-start flex-1">
                                                            <div className="flex flex-row items-center gap-2 flex-1 justify-between">
                                                                <p className="text-gray-600">Bids</p>
                                                                <div
                                                                    onClick={() => {
                                                                        if(isLoading) return;

                                                                        setIsLoading(true)
                                                                        fetch(`/api/jobs/`).then(async val => {
                                                                            const data: Job[] = await val.json();
                                                                            setRawPrintList(data);
                                                                            setPrintList(data);
                                                                            setIsLoading(false);
                                                                        });
                                                                    }} 
                                                                    className={`${ isLoading ? "opacity-20" : "" } bg-gray-800 text-white px-2 py-1 rounded-md cursor-pointer`}>
                                                                    Refresh
                                                                </div>
                                                            </div>

                                                            {
                                                                //@ts-ignore
                                                                activePrint.Bids.length > 0 ?
                                                                    //@ts-ignore
                                                                    activePrint.Bids.map((bid: Bid, i, a) => {
                                                                        return (
                                                                                <>
                                                                                <div key={bid.id} className="flex flex-row items-center gap-2 flex-1 justify-between w-full" style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px" }}>
                                                                                    <p className="font-semibold">{
                                                                                        //@ts-ignore
                                                                                        bid.bidder.name
                                                                                        }</p>
                                                                                    <p className="text-gray-600">${bid.price.toFixed(2)}</p>
                                                                                    <div
                                                                                        onClick={() => {
                                                                                            // Note, anyone can call this endpoint - security could be trivially implemented,
                                                                                            // But as this is a demo project we won't bother.

                                                                                            setIsLoading(true)

                                                                                            fetch(`api/jobs/accept-bid`, {
                                                                                                method: "POST",
                                                                                                body: JSON.stringify({
                                                                                                    bid_id: bid.id,
                                                                                                })
                                                                                            }).then(async k => {
                                                                                                const job = await k.json();
                                                                                                fetch(`/api/jobs/user/${auth.id}`).then(async val => {
                                                                                                    const data: Job[] = await val.json();
                                                                                                    setRawPrintList([ ...data ]);
                                                                                                    setPrintList([ ...data ]);
                                                                                                    // setActivePrint(data?.at(0) ?? null);
                                                                                                    
                                                                                                    setActivePrint(job.job);
                                                                                                });

                                                                                                setIsLoading(false);
                                                                                            })
                                                                                        }}
                                                                                        className={`${isLoading ? "bg-green-50 text-green-800 text-opacity-50" : "bg-green-100 text-green-800"} px-2 py-1 rounded-md cursor-pointer`}>
                                                                                        Accept Bid
                                                                                    </div>
                                                                                </div>

                                                                                {
                                                                                    i == a.length-1 ? <></> : <div className="h-[2px] w-full bg-gray-200 border-solid rounded-full"></div>
                                                                                }
                                                                            </>
                                                                        )
                                                                    })
                                                                :
                                                                    <p className="text-gray-400 w-full text-center pt-4">No current bids, check back later.</p>
                                                            }
                                                        </div>

                                                        <br />

                                                        <div className="flex flex-col gap-2 justify-center flex-1 rounded-md overflow-hidden h-full">
                                                            <p className="text-gray-600">Render Preview</p>
                                                            <div className="flex flex-col gap-2 justify-center flex-1 rounded-md overflow-hidden bg-gray-200 h-full">
                                                                <Image width="800" height="250" src="https://cdn.thingiverse.com/assets/77/43/33/73/12/featured_preview_d5f32543-af68-4dd7-ba21-261384749770.png" alt="Print" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            case JobStatus.PREPRINT:
                                                return (
                                                    <div className="flex flex-row items-start justify-center flex-1">
                                                        <div className="flex flex-col gap-2 items-center justify-center flex-1 h-full">
                                                            <p className="text-gray-400">The constructor is preparing to print your order, check back when they have started printing</p>
                                                        </div>
                                                    </div>
                                                )
                                            case JobStatus.ENROUTE:
                                                return (
                                                    <div className="flex flex-row items-start justify-center flex-1">
                                                        <div className="flex flex-col gap-2 items-center justify-center flex-1 h-full">
                                                            <p className="text-gray-400">The constructor is sending your order, you will be sent tracking information shortly.</p>
                                                        </div>
                                                    </div>
                                                )
                                            case JobStatus.CANCELED:
                                                return (
                                                    <div className="flex flex-row items-start justify-center flex-1">
                                                        <div className="flex flex-col gap-2 items-center justify-center flex-1 h-full">
                                                            <p className="text-gray-400">This print has been canceled.</p>
                                                            <p className="bg-green-100 text-green-800 px-2 py-1 rounded-md w-fit cursor-pointer">Re-Request Print</p>
                                                        </div>

                                                        <div className="flex flex-col gap-2 items-center justify-center flex-1 rounded-md overflow-hidden bg-gray-200 h-full">
                                                            <Image width="800" height="250" src="https://cdn.thingiverse.com/assets/77/43/33/73/12/featured_preview_d5f32543-af68-4dd7-ba21-261384749770.png" alt="Print" />
                                                        </div>
                                                    </div>
                                                )
                                            default:
                                                return (<></>)
                                        }
                                    })()}

                                    <p>{(activePrint?.status_history as any as History<JobStatus>[])?.map(k => { return (<></>) })}</p>
                                </div>
                            </div>
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
