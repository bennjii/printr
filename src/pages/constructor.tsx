import {GetServerSideProps, type NextPage} from "next";
import {ChangeEvent, createRef, useEffect, useState} from "react";
import {DEFAULT_CONFIG, DEFAULT_PRINTERS, DEFAULT_PRINT_JOBS, DEFAULT_USER, getSize} from "../../public/lib/helpers";
import {job_status_to_colour_pair, job_status_to_string, job_status_to_type, JobStatus, PrintConfig} from "../../public/lib/printr";
import {Header} from "../../public/components/header";
import {JobElement} from "../../public/components/job";
import { Bid, BidMetadata, Job, Printer, User } from "@prisma/client";
import { ModSession } from ".";
import { getServerSession } from "next-auth";
import { authOptions } from "../server/auth";
import Image from "next/image";

const Home: NextPage<{ auth: ModSession, metaTags: any }> = ({auth, metaTags}: { auth: ModSession, metaTags: any }) => {
    const [ activePrint, setActivePrint ] = useState<Job | null>(null);
    const [ activeUser, setActiveUser ] = useState(auth.user as any as User);

    const [ printList, setPrintList ] = useState<Job[]>([]);
    const [ printers, setPrinters ] = useState<Printer[]>([]);
    const [ rawPrintList, setRawPrintList ] = useState<Job[]>([]);

    const [ offerModal, setOfferModal ] = useState<{
        active: boolean,
        job_id: string | null,
        value: number,
        type: "create" | "delete",
        bid_id: string,
        printer: string,
    }>({
        active: false,
        job_id: null,
        value: 0.0,
        type: "create",
        bid_id: "",
        printer: "",
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

        fetch(`/api/printers/constructor/${auth.id}`).then(async val => {
            const data: Printer[] = await val.json();
            setPrinters(data);
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

    const [ config, setConfig ] = useState<PrintConfig>({ ...JSON.parse(JSON.stringify((DEFAULT_CONFIG))) });
    const [ isDragged, setIsDragged ] = useState(false);
    const [ canContinue, setCanContinue ] = useState(false);

    const printer_ref = createRef<HTMLSelectElement>();
    const file_ref = createRef<HTMLInputElement>();
    const message_ref = createRef<HTMLInputElement>();
    const file_image_ref = createRef<HTMLInputElement>();

    const onFileChangeCapture = ( e: ChangeEvent<HTMLInputElement> ) => {
        e.preventDefault();
        e.target.files ? dropHandler(e.target.files) : {};
    };

    const dropHandler = (files: FileList) => {
        setIsDragged(false);

        const f_l = config.files;
        f_l.push({ name: files.item(0)?.name ?? "", size: files.item(0)?.size ?? 0, url: "" });

        setConfig({ ...config, files: f_l })
        setCanContinue(true);
    }

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
                            className="bg-white flex flex-col items-center gap-4 p-8 rounded-md min-w-[440px]">
                            <div className="flex flex-col flex-start justify-start items-start w-full">
                                <p className="font-bold text-xl">{offerModal.type == "create" ? "Make" : "Modify"} Offer</p>
                                <p className="text-gray-500">{activePrint?.file_name}</p>
                            </div>

                            <div className="w-full flex flex-col flex-1">
                                <p className="text-gray-600 uppercase text-sm">Offer Value</p>
                                <input defaultValue={offerModal.value != 0 ? offerModal.value : undefined} ref={offer_ref} placeholder="$15.00" className="px-4 py-2 rounded-md bg-gray-100" onChange={(e) => {
                                    setOfferModal({ ...offerModal, value: parseFloat(e.target.value) });
                                }}></input>
                            </div>

                            <div className="w-full flex flex-col flex-1">
                                <p className="text-gray-600 uppercase text-sm">Allocate Printer</p>
                                <select className="px-4 py-2 rounded-md bg-gray-100" ref={printer_ref} defaultValue={printers.filter(k => k.id == offerModal.printer)[0]?.id}>
                                    {
                                        printers.filter(k => k.current_status == "IDLE" || k.id == offerModal.printer).map(k => {
                                            console.log(printers, offerModal.printer);

                                            return (
                                                <option className="px-4 py-2 rounded-md" value={k.id}>{k.current_status == "UNAVALIABLE" ? "Current" : "Available"} - {k.name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>

                            <br />

                            <div className="flex flex-row items-center gap-2 w-full flex-1">
                                <div
                                    onClick={() => {
                                        if(!isLoading) {
                                            setIsLoading(true)

                                            if(offerModal.type != "delete") {
                                                fetch(`/api/offer/create`, {
                                                    method: "POST",
                                                    body: JSON.stringify({
                                                        user_id: auth.id,
                                                        job_id: offerModal.job_id,
                                                        printer_id: printer_ref.current?.value,
                                                        offer_value: offerModal.value
                                                    })
                                                }).then(async val => {
                                                    const data = await val.json();
                                                    console.log("Bid", data);
    
                                                    fetch(`/api/jobs/user/${auth.id}`).then(async val => {
                                                        const data: Job[] = await val.json();
                                                        setRawPrintList([ ...data ]);
                                                        setPrintList([ ...data ]);
                                                        setActivePrint(data?.at(0) ?? null);
                                                    });
                                            
                                                    fetch(`/api/printers/constructor/${auth.id}`).then(async val => {
                                                        const data: Printer[] = await val.json();
                                                        setPrinters([ ...data ]);
                                                    });
    
                                                    setIsLoading(false)
                                                    setOfferModal({ ...offerModal, active: false })
                                                });
                                            }else {
                                                fetch(`/api/offer/update`, {
                                                    method: "POST",
                                                    body: JSON.stringify({
                                                        bid_id: offerModal.bid_id,
                                                        user_id: auth.id,
                                                        job_id: offerModal.job_id,
                                                        printer_id: printer_ref.current?.value,
                                                        offer_value: offerModal.value
                                                    })
                                                }).then(async val => {
                                                    const data = await val.json();
                                                    console.log("Bid", data);
    
                                                    fetch(`/api/jobs/user/${auth.id}`).then(async val => {
                                                        const data: Job[] = await val.json();
                                                        setRawPrintList(data);
                                                        setPrintList(data);
                                                        setActivePrint(data?.at(0) ?? null);
                                                    });
                                            
                                                    fetch(`/api/printers/constructor/${auth.id}`).then(async val => {
                                                        const data: Printer[] = await val.json();
                                                        setPrinters(data);
                                                    });
    
                                                    setIsLoading(false)
                                                    setOfferModal({ ...offerModal, active: false })
                                                });
                                            }
                                        }
                                    }}
                                    className={`text-sm text-center cursor-pointer font-semibold ${ isLoading ? "bg-green-50 text-green-800 text-opacity-50" : "bg-green-100 text-green-800" } items-center justify-center p-2 rounded-md w-full flex-1 flex`}>
                                        {
                                            isLoading ? "Placing Offer..." : offerModal.type == "delete" ? "Save Offer" : "Confirm Offer"
                                        }
                                    </div>

                                    {
                                    offerModal.type == "delete" ? 
                                    <div
                                        onClick={() => {
                                            if(!isLoading) {
                                                setIsLoading(true)
                                                fetch(`/api/offer/delete`, {
                                                    method: "POST",
                                                    body: JSON.stringify({
                                                        user_id: auth.id,
                                                        job_id: offerModal.job_id,
                                                        printer_id: printer_ref.current?.value,
                                                        offer_value: offerModal.value,
                                                        bid_id: offerModal.bid_id
                                                    })
                                                }).then(async val => {
                                                    const data = await val.json();
                                                    console.log("Bid", data);

                                                    setOfferModal({ ...offerModal, active: false })
                                                });
                                            }
                                        }}
                                        className={`text-sm text-center cursor-pointer font-semibold ${ isLoading ? "bg-red-50 text-red-800 text-opacity-50" : "bg-red-100 text-red-800" } items-center justify-center p-2 rounded-md w-full flex-1 flex`}>
                                            {
                                                isLoading ? "Revoking Offer..." : "Revoke Offer"
                                            }
                                        </div>
                                    :
                                    <></>
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
                            printList.filter(k => job_status_to_type(k.current_status) != 7 && job_status_to_type(k.current_status) != 0).length > 0 ?
                            printList.filter(k => job_status_to_type(k.current_status) != 7 && job_status_to_type(k.current_status) != 0).filter(k => job_status_to_type(k.current_status) < 5).map(k => <JobElement key={`JOBELEM-${k.id}`} k={k} setActivePrint={setActivePrint} setActiveMenu={setActiveMenu} />)
                            :
                            <p className="w-full text-center text-gray-400 text-sm pt-4">No current active jobs</p>
                        }

                        <br />

                        <p className="text-gray-600">Inactive Jobs</p>
                        {
                            printList.filter(k => job_status_to_type(k.current_status) != 7).filter(k => job_status_to_type(k.current_status) >= 5).length > 0 ? 
                            printList.filter(k => job_status_to_type(k.current_status) != 7).filter(k => job_status_to_type(k.current_status) >= 5).map(k => <JobElement key={`JOBELEM-${k.id}`} k={k} setActivePrint={setActivePrint} setActiveMenu={setActiveMenu} />)
                            :
                            <p className="w-full text-center text-gray-400 text-sm pt-4">No current inactive jobs</p>
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
                                                    printList.filter(k => job_status_to_type(k.current_status) == 0).length > 0 ?
                                                        printList.filter(k => job_status_to_type(k.current_status) == 0).map((k, i, a) => {
                                                            return (
                                                                <>
                                                                    <div className={`flex flex-row items-center `} style={{ display: "grid", gridTemplateColumns: "200px 175px 90px 75px 50px 1fr" }}>
                                                                        <p className="font-bold">{k.job_name}</p>
                                                                        <p className="text-sm text-gray-400">{new Date(k.created_at).toLocaleString()}</p>
                                                                        <p className="text-sm text-gray-400">{(k.job_preferences as any as PrintConfig).colour.name}</p>
                                                                        <p className="text-sm text-gray-400">{(k.job_preferences as any as PrintConfig).delivery.method}</p>
                                                                        <p className="text-sm text-gray-400">{(k.job_preferences as any as PrintConfig).filament.name}</p>

                                                                        <div className="flex flex-col gap-2">
                                                                        <p className="text-sm text-center cursor-pointer font-semibold bg-gray-100 rounded-md">Download File</p>
                                                                        {
                                                                            //@ts-ignore
                                                                            k.Bids?.filter((k: Bid) => k.bidder_id == auth.id).length > 0 ?
                                                                            <p
                                                                            onClick={() => {
                                                                                //@ts-ignore
                                                                                fetch(`/api/offer/${k.Bids?.filter((k: Bid) => k.bidder_id == auth.id)[0].id}`).then(async b => {
                                                                                    const bid: Bid = await b.json();
                                                                                    console.log("OPEN BID", bid);

                                                                                    setOfferModal({ 
                                                                                        ...offerModal, 
                                                                                        active: true, 
                                                                                        type: "delete", 
                                                                                        job_id: k.id,
                                                                                        value: bid.price,
                                                                                        bid_id: bid.id,
                                                                                        //@ts-ignore
                                                                                        printer: bid.printer_id
                                                                                    })
                                                                                });
                                                                                
                                                                            }}
                                                                            className="text-sm text-center cursor-pointer font-semibold bg-orange-100 text-orange-800 rounded-md">Modify Offer</p>
                                                                            :
                                                                            <p
                                                                            onClick={() => {
                                                                                setOfferModal({ ...offerModal, active: true, type: "create", job_id: k.id, value: 0 })
                                                                            }}
                                                                            className="text-sm text-center cursor-pointer font-semibold bg-green-100 text-green-800 rounded-md">Make Offer</p>
                                                                        }
                                                                        </div>
                                                                    </div>

                                                                    {
                                                                        i == a.length-1 ? <></> : <div className="h-[2px] w-full bg-gray-200 border-solid rounded-full"></div>
                                                                    }
                                                                </>
                                                            )
                                                        })
                                                    :
                                                        <p className="text-gray-400 w-full text-center p-8">No active jobs</p>
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
                                                                <div className={`flex flex-row items-center `} style={{ display: "grid", gridTemplateColumns: "1fr 120px 150px 1fr 100px" }}>
                                                                    <p className="font-bold">{k.name}</p>
                                                                    <p className="text-sm text-gray-600">{k.current_status}</p>
                                                                    <p className="text-sm text-gray-400">{k.id}</p>
                                                                    <div></div>
                                                                    <p className="text-sm text-center cursor-pointer font-semibold bg-orange-100 text-orange-800 rounded-md">{k.current_status == "PRINTING" ? "Idle Printer" : k.current_status == "IDLE" ? "Busy Printer" : "Idle Printer"}</p>
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

                                            <br />

                                            {(() => {
                                                switch(job_status_to_type(activePrint?.current_status ?? "")) {
                                                    case JobStatus.PREPRINT:
                                                        return (
                                                            <div className="flex flex-row items-start justify-center flex-1">
                                                                <div className="flex flex-col gap-4 flex-1 h-full">
                                                                    <p className="text-sm font-semibold">PRINT INFORMATION</p>

                                                                    <div className="flex flex-col items-start">
                                                                        <p className="text-gray-400 text-sm">CHOSEN PRINTER</p>
                                                                        <p>{activePrint?.printer_id}</p>
                                                                    </div>

                                                                    <div className="flex flex-col items-start">
                                                                        <p className="text-gray-400 text-sm">DOWNLOAD FILE</p>
                                                                        <a className="text-blue-600" href={activePrint?.file_url}>Download</a>
                                                                    </div>

                                                                    <div className="flex flex-col items-start">
                                                                        <p className="text-gray-400 text-sm">START PRINT</p>
                                                                        <p 
                                                                            onClick={() => {
                                                                                fetch(`api/jobs/start-print`, {   
                                                                                    method: "POST",
                                                                                    body: JSON.stringify({
                                                                                        job_id: activePrint?.id ?? ""
                                                                                    })
                                                                                }).then(async data => {
                                                                                    const { job, printer }: { job: Job, printer: Printer } = await data.json();
                                                                                    
                                                                                    setActivePrint({
                                                                                        ...job
                                                                                    });

                                                                                    fetch(`/api/jobs/user/${auth.id}`).then(async val => {
                                                                                        const data: Job[] = await val.json();
                                                                                        setRawPrintList(data);
                                                                                        setPrintList(data);
                                                                                        setActivePrint(data?.at(0) ?? null);
                                                                                    });
                                                                            
                                                                                    fetch(`/api/printers/constructor/${auth.id}`).then(async val => {
                                                                                        const data: Printer[] = await val.json();
                                                                                        setPrinters(data);
                                                                                    });
                                                                                })
                                                                            }}
                                                                            className={`${isLoading ? "bg-green-50 text-green-800 text-opacity-50" : "bg-green-100 text-green-800"} w-fit px-2 py-1 rounded-md cursor-pointer`}>Set print as started</p>
                                                                    </div>
                                                                </div>

                                                                <div className="flex flex-col gap-2 items-center justify-center flex-1 rounded-md overflow-hidden bg-gray-200 h-full">
                                                                    <Image width="800" height="250" src="https://cdn.thingiverse.com/assets/77/43/33/73/12/featured_preview_d5f32543-af68-4dd7-ba21-261384749770.png" alt="Print" />
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
                                                    case JobStatus.PRINTING:
                                                        return (
                                                            <div className="flex flex-row items-start justify-center flex-1">
                                                                <div className="flex flex-col gap-2 items-center justify-center flex-1 h-full">
                                                                    <p className="text-gray-400">Finished printing?</p>
                                                                    <p 
                                                                        onClick={() => {
                                                                            if(isLoading) return;

                                                                            setIsLoading(true);

                                                                            fetch(`api/jobs/finish-print`, {   
                                                                                method: "POST",
                                                                                body: JSON.stringify({
                                                                                    job_id: activePrint?.id ?? ""
                                                                                })
                                                                            }).then(async data => {
                                                                                const { job, printer }: { job: Job, printer: Printer } = await data.json();
                                                                                
                                                                                setActivePrint({
                                                                                    ...job
                                                                                });

                                                                                fetch(`/api/jobs/user/${auth.id}`).then(async val => {
                                                                                    const data: Job[] = await val.json();
                                                                                    setRawPrintList(data);
                                                                                    setPrintList(data);
                                                                                    setActivePrint(data?.at(0) ?? null);
                                                                                });
                                                                        
                                                                                fetch(`/api/printers/constructor/${auth.id}`).then(async val => {
                                                                                    const data: Printer[] = await val.json();
                                                                                    setPrinters(data);
                                                                                });

                                                                                setIsLoading(false);
                                                                            })
                                                                        }}
                                                                        className="bg-green-100 text-green-800 px-2 py-1 rounded-md w-fit cursor-pointer">Mark as finished</p>
                                                                </div>

                                                                <div className="flex flex-col gap-2 items-center justify-center flex-1 rounded-md overflow-hidden bg-gray-200 h-full">
                                                                    <Image width="800" height="250" src="https://cdn.thingiverse.com/assets/77/43/33/73/12/featured_preview_d5f32543-af68-4dd7-ba21-261384749770.png" alt="Print" />
                                                                </div>
                                                            </div>
                                                        )
                                                    case JobStatus.PREDELIVERY:
                                                        return (
                                                            <div className="flex flex-row items-start justify-center flex-1">
                                                                <div className="flex flex-col gap-2 flex-1 h-full">
                                                                    <div className="flex flex-row items-center justify-between gap-4">
                                                                        <p>You must <strong>scan</strong> and <strong>take photos</strong> of the print to send to the customer.</p>
                                                                        
                                                                        <div className="flex flex-row items-center gap-2 bg-green-100 px-2 rounded-md">
                                                                            <p className="text-green-600">Scan</p>

                                                                            <svg width="18" height="11" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M17.7071 0.292893C18.0976 0.683417 18.0976 1.31658 17.7071 1.70711L6.70711 12.7071C6.31658 13.0976 5.68342 13.0976 5.29289 12.7071L0.292893 7.70711C-0.0976311 7.31658 -0.0976311 6.68342 0.292893 6.29289C0.683417 5.90237 1.31658 5.90237 1.70711 6.29289L6 10.5858L16.2929 0.292893C16.6834 -0.0976311 17.3166 -0.0976311 17.7071 0.292893Z" fill="#3DD35E"/>
                                                                            </svg>
                                                                        </div>

                                                                        <div 
                                                                            onClick={() => {
                                                                                if(isLoading) return;

                                                                                setIsLoading(true);
                                                                                fetch(`api/jobs/submit-evidence`, {   
                                                                                    method: "POST",
                                                                                    body: JSON.stringify({
                                                                                        job_id: activePrint?.id ?? ""
                                                                                    })
                                                                                }).then(async data => {
                                                                                    const { job, printer }: { job: Job, printer: Printer } = await data.json();
                                                                                    setActivePrint({
                                                                                        ...job
                                                                                    });
    
                                                                                    fetch(`/api/jobs/user/${auth.id}`).then(async val => {
                                                                                        const data: Job[] = await val.json();
                                                                                        setRawPrintList(data);
                                                                                        setPrintList(data);
                                                                                        setActivePrint(data?.at(0) ?? null);
                                                                                    });
                                                                            
                                                                                    fetch(`/api/printers/constructor/${auth.id}`).then(async val => {
                                                                                        const data: Printer[] = await val.json();
                                                                                        setPrinters(data);
                                                                                    });

                                                                                    setIsLoading(false);
                                                                                })
                                                                            }}
                                                                            className="flex flex-row items-center gap-2 bg-gray-200 px-2 rounded-md cursor-pointer">
                                                                            { isLoading ? <p className="text-gray-400">Submitting Evidence</p> : <p className="text-gray-800">Submit Evidence</p> }
                                                                        </div>
                                                                    </div>

                                                                    <input className="hidden" type="file" ref={file_ref} onChangeCapture={onFileChangeCapture} />
                                                                    <input className="hidden" type="file" accept="image/*;capture=camera" ref={file_image_ref} onChangeCapture={onFileChangeCapture} />

                                                                    <div
                                                                        className={`border-2 flex px-32 py-32 items-center justify-center text-center ${isDragged ? "bg-blue-50 border-[#0066FF]" : "bg-gray-50 border-gray-200"}  border-dashed rounded-md w-full items-center justify-center`}
                                                                        onDragEnter={() => setIsDragged(true)}
                                                                        onDragLeave={() => setIsDragged(false)}
                                                                        onDragOver={e => e.preventDefault()}
                                                                        onDropCapture={(e) => {e.preventDefault(); dropHandler(e.dataTransfer.files)}}
                                                                        // onDrop={(e) => {e.preventDefault(); dropHandler(e.dataTransfer.files)}}
                                                                        >
                                                                        <div className="font-semibold text-center select-none gap-1 flex flex-row items-center">Drag and drop, <a className="text-blue-600 cursor-pointer p-8 pr-0 ml-[-2rem]" onClick={() => file_ref.current?.click()}>choose</a> or <a className="text-blue-600 cursor-pointer p-8 pr-0 ml-[-2rem]" onClick={() => file_image_ref.current?.click()}>take</a> photo</div>
                                                                    </div>

                                                                    {
                                                                        config.files.map((file, i) => {
                                                                            return (
                                                                                <div key={`INDX-${file.name}`} className="flex flex-row items-center gap-2">
                                                                                    <div className="bg-blue-200 text-blue-800 px-2 rounded-md">{file?.name.split(".")[1]}</div>
                                                                                    <p>{file?.size ? getSize(file?.size.toString(), 2) : "0B"}</p>
                                                                                    <p className="text-gray-600">{file?.name.split(".")[0]}</p>
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                    default:
                                                        return (<></>)
                                                }
                                            })()}
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
