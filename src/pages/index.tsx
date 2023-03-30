import {GetServerSideProps, type NextPage} from "next";
import {useEffect, useState} from "react";
import {PrintStart} from "../../public/components/print";
import {DEFAULT_BIDS, DEFAULT_PRINT_JOBS, DEFAULT_USER} from "../../public/lib/helpers";
import {Job, job_status_to_colour_pair, job_status_to_string, JobStatus, User} from "../../public/lib/printr";
import {Header} from "../../public/components/header";
import {JobElement} from "../../public/components/job";
import Image from "next/image";
import {getSession, useSession} from "next-auth/react";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../server/auth";

type ModSession = {
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
    }
}

const Home: NextPage<{ auth: ModSession, metaTags: any }> = ({auth, metaTags}: { auth: ModSession, metaTags: any }) => { 
    const [ activePrint, setActivePrint ] = useState(DEFAULT_PRINT_JOBS[0]);
    const [ activeUser, setActiveUser ] = useState(auth.user as any as User);    

    const [ printList, setPrintList ] = useState<Job[]>(DEFAULT_PRINT_JOBS);
    const [ rawPrintList, setRawPrintList ] = useState<Job[]>(DEFAULT_PRINT_JOBS);

    const [ activeMenu, setActiveMenu ] = useState<number>(0);

    useEffect(() => {
        fetch(`/api/user/${auth.id}`).then(async val => {
            const data: User = await val.json();
            setActiveUser(data);
        })
    }, [])

    useEffect(() => {
        const diff = rawPrintList.filter(element => !printList.includes(element));

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
                            printList.filter(k => k.current_status < 5).map(k => <JobElement key={`JOBELEM-${k.id}`} k={k} setActivePrint={setActivePrint} setActiveMenu={setActiveMenu} />)
                        }

                        <br />

                        <p className="text-gray-600">Old Prints</p>
                        {
                            printList.filter(k => k.current_status >= 5).map(k => <JobElement key={`JOBELEM-${k.id}`} k={k} setActivePrint={setActivePrint} setActiveMenu={setActiveMenu} />)
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
                                            printList={rawPrintList} setPrintList={setRawPrintList}
                                        />
                                    </div>
                                :

                        <div className={`flex flex-1 overflow-none flex-col bg-gray-100 rounded-md w-full`}>
                            <div className={`flex flex-col flex-1`}>
                                <div className="flex flex-col gap-4 flex-1 p-12 flex-1 justify-start">
                                    <div className="flex justify-start flex-row items-center justify-between pr-4 gap-4 place-start" >
                                        <div className="flex flex-col">
                                            <div className="flex flex-row items-center gap-2">
                                                <p className="font-bold text-xl">{activePrint?.job_name}</p>
                                                <p className={`px-4 py-0 rounded-md ${job_status_to_colour_pair(activePrint?.current_status ?? JobStatus.DRAFT)}`}>{job_status_to_string(activePrint?.current_status ?? JobStatus.DRAFT)}</p>
                                            </div>
                                            <p className="text-gray-500">{activePrint?.file_name}</p>
                                        </div>

                                        <div>
                                            {
                                                activePrint?.current_status == JobStatus.DRAFT ?
                                                    <div className="px-4 py-1 bg-gray-100 rounded-md cursor-pointer">Edit</div>
                                                    :
                                                    <></>
                                            }
                                        </div>
                                    </div>

                                    <div id="" className="flex flex-col gap-2 bg-gray-100 p-4 rounded-md" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
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

                                    {(() => {
                                        switch(activePrint?.current_status) {
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
                                            case JobStatus.BIDDING:
                                                return (
                                                    <div className="flex flex-row items-start justify-center flex-1 gap-4">
                                                        <div className="flex flex-col gap-2 justify-start items-start flex-1">
                                                            <p className="text-gray-600">Bids</p>

                                                            {
                                                                DEFAULT_BIDS.map((bid, i, a) => {
                                                                    return (
                                                                            <>
                                                                            <div key={bid.id} className="flex flex-row items-center gap-2 flex-1 justify-between w-full" style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px" }}>
                                                                                <p className="font-semibold">{bid.bidder}</p>
                                                                                <p className="text-gray-600">${bid.price.toFixed(2)}</p>
                                                                                <div
                                                                                    onClick={() => {
                                                                                        setActivePrint({
                                                                                            ...activePrint,
                                                                                            current_status: JobStatus.PREPRINT
                                                                                        })
                                                                                    }}
                                                                                    className="bg-green-100 text-green-800 px-2 py-1 rounded-md cursor-pointer">
                                                                                    Accept Bid
                                                                                </div>
                                                                            </div>

                                                                            {
                                                                                i == a.length-1 ? <></> : <div className="h-[2px] w-full bg-gray-200 border-solid rounded-full"></div>
                                                                            }
                                                                        </>
                                                                    )
                                                                })
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

                                    <p>{activePrint?.status_history?.map(k => { return (<></>) })}</p>
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

    const session = await getServerSession(context.req, context.res, authOptions)

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

    console.log(session)

    return {
        props: { 
            metaTags,
            auth: session
        }
    }
}

export default Home;
