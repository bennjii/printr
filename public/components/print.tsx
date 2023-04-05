import {type ChangeEvent, createRef, useEffect, useState} from "react";
import Image from "next/image";
import {
    COLOUR_OPTIONS,
    CONFIRM_PRINT_MODE, DEFAULT_CONFIG,
    DELIVERY_OPTIONS,
    FILAMENT_OPTIONS,
    FIXED_PRINTER_OPTIONS,
    getSize
} from "../lib/helpers";
import {
    Completeness,
    JobStatus, MinifiedConstructor,
    type PrintConfig
} from "../lib/printr";

import { Job, Job as JobDBType } from "@prisma/client"
import prisma from "@public/lib/prisma";

export const PrintStart = ({ activeMenu, setActiveMenu, setPrintList, setRawPrintList, setActivePrint, printList, user_id }:  { activeMenu: number, setActiveMenu: Function, setRawPrintList: Function, setActivePrint: Function, setPrintList: Function, printList: Job[], user_id: string }) => {
    const [ print_mode, setPrintMode ] = useState<0 | 1 | 2 | 4 | 5 | 6>(0);
    const [ is_dragged, setIsDragged ] = useState(false);
    const [ can_continue, setCanContinue ] = useState(false);

    const [ currentJob, setCurrentJob ] = useState<null | JobDBType>(null);
    const [ waiting, setWaiting ] = useState<boolean>(false);

    const [ config, setConfig ] = useState<PrintConfig>({ ...JSON.parse(JSON.stringify((DEFAULT_CONFIG))) });

    const file_ref = createRef<HTMLInputElement>();
    const message_ref = createRef<HTMLInputElement>();

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
            <div className={`flex flex-col flex-1 `}>
                {(() => {
                    switch(print_mode) {
                    case 0:
                        return (
                                <div className="flex flex-col gap-4 flex-1 p-12 flex-1">
                                    <div className="flex justify-start flex-col gap-4 place-start flex-1" >
                                        <div className="flex flex-col">
                                            <p className="font-bold text-xl">To start, upload a file</p>
                                            <p className="text-gray-500">Upload any .obj, .svb, or 3D object file</p>
                                        </div>

                                        <input className="hidden" type="file" ref={file_ref} onChangeCapture={onFileChangeCapture} />
                                        <div
                                            className={`border-2 px-32 py-32 ${is_dragged ? "bg-blue-50 border-[#0066FF]" : "bg-gray-50 border-gray-200"}  border-dashed rounded-md w-full items-center justify-center`}
                                            onDragEnter={() => setIsDragged(true)}
                                            onDragLeave={() => setIsDragged(false)}
                                            onDragOver={e => e.preventDefault()}
                                            onDropCapture={(e) => {e.preventDefault(); dropHandler(e.dataTransfer.files)}}
                                            // onDrop={(e) => {e.preventDefault(); dropHandler(e.dataTransfer.files)}}
                                            >
                                            <p className="font-semibold text-center select-none">Drag and drop or <a className="text-blue-600 cursor-pointer p-8 ml-[-2rem]" onClick={() => file_ref.current?.click()}>choose file</a></p>
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
                    case 1:
                        return (
                                <div className="flex flex-col flex-1 p-12 pb-0">
                                    <div className="flex justify-center flex-col gap-8 place-start" >
                                        <div className="flex flex-col">
                                            <p className="font-bold text-xl">Next, select your printing preferences</p>
                                            <p className="text-gray-500">Choose your desired colour, filament and method of delivery</p>
                                            <br />

                                            <div className="none flex-col gap-2 bg-gray-100 p-4 rounded-md" style={{ display: "none", gridTemplateColumns: "1fr 1fr" }}>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-row items-center gap-2"  style={{ display: 'grid', gridTemplateColumns: '40% 1fr' }}>
                                                        <div className="bg-gray-200 px-2 rounded-md font-semibold">
                                                            File(s):
                                                        </div>
                                                        {
                                                            config.files[0]?.name ?? "" // .map(k => k[0]?.name)  .join(', ')
                                                        }
                                                    </div>

                                                    <div className="flex flex-row items-center gap-2" style={{ display: 'grid', gridTemplateColumns: '40% 1fr' }}>
                                                        <div className="bg-gray-200 px-2 rounded-md font-semibold">
                                                            Colour:
                                                        </div>
                                                        {config.colour.name}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-row items-center gap-2" style={{ display: 'grid', gridTemplateColumns: '40% 1fr' }}>
                                                        <div className="bg-gray-200 px-2 rounded-md font-semibold">
                                                            Filament:
                                                        </div>
                                                        {config.filament.name}
                                                    </div>

                                                    <div className="flex flex-row items-center gap-2" style={{ display: 'grid', gridTemplateColumns: '40% 1fr' }}>
                                                        <div className="bg-gray-200 px-2 rounded-md font-semibold">
                                                            Prefered Method:
                                                        </div>
                                                        {config.delivery.method}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-start gap-2">
                                            <div>
                                                <p className="text-sm font-bold">COLOUR</p>
                                                <p className="text-gray-600">Choose your desired colour from the options below</p>

                                                <div className="flex flex-row items-center gap-2 py-2">
                                                    {
                                                        COLOUR_OPTIONS.map(colour => {
                                                            return (
                                                                    <div
                                                                        style={{ backgroundColor: colour.primary_hex, color: colour.secondary_hex, border: `2px ${colour.code == config.colour.code ? colour.secondary_hex : "transparent"} solid` }}
                                                                        className="flex flex-row items-center px-3 py-1 rounded-md cursor-pointer select-none"
                                                                        key={colour.code}
                                                                        onClick={() => setConfig({ ...config, colour: colour })}
                                                                        >
                                                                        {colour.name}
                                                                    </div>
                                                                )
                                                        })
                                                    }
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-sm font-bold">FILAMENT</p>
                                                <p className="text-gray-600">Choose your desired filament from the options below</p>

                                                <div className="flex flex-row items-center gap-2 py-2 flex-wrap">
                                                    {
                                                        FILAMENT_OPTIONS.map(filament => {
                                                            return (
                                                                    <div
                                                                        style={{ backgroundColor: config.filament.code == filament.code ? "#E5E5E5" : "#F5F5F5", color: config.filament.code == filament.code ? "#4D4D4D" : "#777777" }}
                                                                        className="flex flex-row items-center px-3 py-1 rounded-md cursor-pointer select-none"
                                                                        key={filament.code}
                                                                        onClick={() => setConfig({ ...config, filament: filament })}
                                                                        >
                                                                        {filament.name}
                                                                    </div>
                                                                    )
                                                        })
                                                    }
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-sm font-bold">DELIVERY</p>
                                                <p className="text-gray-600">Choose your desired delivery method from the options below</p>

                                                <div className="flex flex-row items-center gap-2 py-2 flex-wrap">
                                                    {
                                                        DELIVERY_OPTIONS.map(delivery => {
                                                            return (
                                                                    <div
                                                                        style={{ backgroundColor: config.delivery.method == delivery.method ? "#E5E5E5" : "#F5F5F5", color: config.delivery.method == delivery.method  ? "#4D4D4D" : "#777777" }}
                                                                        className="flex flex-row items-center px-3 py-1 rounded-md cursor-pointer select-none"
                                                                        key={delivery.method}
                                                                        onClick={() => setConfig({ ...config, delivery: delivery })}
                                                                        >
                                                                        {delivery.method}
                                                                    </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                )
                    case 2:
                        return (
                                <div className="flex flex-col gap-8 flex-1 p-12 flex-1 flex-start">
                                    <div className="flex flex-col justify-start gap-4 place-start flex-start" >
                                        <div className="flex flex-col">
                                            <p className="font-bold text-xl">Print Checking</p>
                                            <p className="text-gray-500">As you selected a delivery preference, would you like to skip checking for faster delivery?</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-row items-center gap-2 cursor-pointer" onClick={() => setConfig({  ...config, DANGEROUS_PREFERS_NO_CHECKS: !config.DANGEROUS_PREFERS_NO_CHECKS })}>
                                            {
                                                config.DANGEROUS_PREFERS_NO_CHECKS ?
                                                    <div className="flex h-4 w-4 rounded-md border-2 border-gray-700 bg-gray-700" ></div>
                                                :
                                                    <div className="flex h-4 w-4 rounded-md border-2 border-gray-700"></div>
                                            }

                                            <p className="font-semibold text-gray-900">Yes, I would like to skip checking</p>
                                        </div>

                                        <p className="text-gray-600">By checking the above, I consent to the following <a className="text-blue-600 font-semibold">terms and conditions</a>, accepting liability for damages or misprints.</p>
                                    </div>
                                </div>
                                )

                    case 4:
                        return (
                                <div className="flex flex-col gap-8 flex-1 p-12 flex-1 flex-start">
                                    <div className="flex flex-col justify-start gap-4 place-start flex-start" >
                                        <div className="flex flex-col">
                                            <p className="font-bold text-xl">Confirm Order</p>
                                            <p className="text-gray-500">Make sure everything is right, then we{'\''}ll get started right away!</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-8">
                                        <div className="flex flex-col gap-2">
                                            <p className="font-semibold text-sm uppercase">Print</p>
                                            <div id="" className="flex flex-col gap-2 bg-gray-100 rounded-md" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-row items-center gap-2"  style={{ display: 'grid', gridTemplateColumns: '40% 1fr' }}>
                                                        <div className="bg-gray-200 px-2 rounded-md font-semibold">
                                                            File(s):
                                                        </div>
                                                        {config.files.map(k => k.name).join(', ')}
                                                    </div>

                                                    <div className="flex flex-row items-center gap-2" style={{ display: 'grid', gridTemplateColumns: '40% 1fr' }}>
                                                        <div className="bg-gray-200 px-2 rounded-md font-semibold">
                                                            Colour:
                                                        </div>
                                                        {config.colour.name}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-row items-center gap-2" style={{ display: 'grid', gridTemplateColumns: '40% 1fr' }}>
                                                        <div className="bg-gray-200 px-2 rounded-md font-semibold">
                                                            Filament:
                                                        </div>
                                                        {config.filament.name}
                                                    </div>

                                                    <div className="flex flex-row items-center gap-2" style={{ display: 'grid', gridTemplateColumns: '40% 1fr' }}>
                                                        <div className="bg-gray-200 px-2 rounded-md font-semibold">
                                                            Delivery Method:
                                                        </div>
                                                        {config.delivery.method}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/*
                                        <div className="flex flex-col gap-2">
                                            <p className="font-semibold text-sm uppercase">Constructor</p>
                                            <div className="flex flex-col gap-2 bg-gray-100 p-4 rounded-md" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-row items-center gap-2"  style={{ display: 'grid', gridTemplateColumns: '40% 1fr' }}>
                                                        <div className="bg-gray-200 px-2 rounded-md font-semibold">
                                                            Name:
                                                        </div>
                                                        {config.constructor?.name}
                                                    </div>

                                                    <div className="flex flex-row items-center gap-2" style={{ display: 'grid', gridTemplateColumns: '40% 1fr' }}>
                                                        <div className="bg-gray-200 px-2 rounded-md font-semibold">
                                                            Completeness:
                                                        </div>
                                                        {config.constructor ? capitalise_first_letter(completeness_as_string(config.constructor.completeness_level)) : "NULL"}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-row items-center gap-2" style={{ display: 'grid', gridTemplateColumns: '40% 1fr' }}>
                                                        <div className="bg-gray-200 px-2 rounded-md font-semibold">
                                                            Location:
                                                        </div>
                                                        {config.constructor?.location.lattitude.toFixed(4)}, {config.constructor?.location.longitude.toFixed(4)}
                                                    </div>

                                                    <div className="flex flex-row items-center gap-2" style={{ display: 'grid', gridTemplateColumns: '40% 1fr' }}>
                                                        <div className="bg-gray-200 px-2 rounded-md font-semibold">
                                                            Identifier:
                                                        </div>
                                                        {config.constructor?.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>*/}

                                        <div className="flex flex-col gap-1 rounded-md">
                                            <div className="flex flex-row items-center gap-2">
                                                <p className="text-gray-400 text-sm">OPTIONAL: </p>
                                                <p className="text-gray-600">You may leave a message for your printer</p>
                                            </div>

                                            <input ref={message_ref} placeholder="Please be aware of the sharp corner" className="px-4 py-2 rounded-md" onChange={(e) => {
                                                setConfig({ ...config, message: e.target.value });
                                            }}></input>
                                        </div>

                                        <div className="flex flex-row items-center gap-4 bg-blue-100 text-blue-800 rounded-md p-2">
                                            <div>
                                                <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M11 0C4.92487 0 0 4.92487 0 11C0 17.0751 4.92487 22 11 22C17.0751 22 22 17.0751 22 11C22 4.92487 17.0751 0 11 0ZM11 6C10.4477 6 10 6.44772 10 7C10 7.55228 10.4477 8 11 8H11.01C11.5623 8 12.01 7.55228 12.01 7C12.01 6.44772 11.5623 6 11.01 6H11ZM12 11C12 10.4477 11.5523 10 11 10C10.4477 10 10 10.4477 10 11V15C10 15.5523 10.4477 16 11 16C11.5523 16 12 15.5523 12 15V11Z" fill="#1E40AF"/>
                                                </svg>
                                            </div>

                                            <p className="text-blue-800">Following placing your order, you will be notified when a constructor accepts your print</p>
                                        </div>
                                    </div>
                                </div>
                                )
                    case 5:
                        return (
                                <div className="flex flex-col gap-4 flex-1 p-12 flex-1">
                                    <div className="flex justify-start flex-col gap-4 place-start flex-1" >
                                        <div className="flex flex-col">
                                            <p className="font-bold text-xl">Order Placed!</p>
                                            <p className="text-gray-500">Click below to open and track your order.</p>
                                        </div>

                                        <div className="flex flex-1 flex-col">
                                            <div className="flex flex-row justify-between bg-blue-100 text-blue-800 p-2 rounded-md px-4 cursor-pointer"
                                                onClick={() => {
                                                    setActiveMenu(1);
                                                    setPrintMode(0)
                                                    setConfig({ ...DEFAULT_CONFIG })
                                                }}>
                                                <h1 className="font-bold">{currentJob?.job_name}</h1>
                                                <p className="cursor-pointer" >Track</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                )
                    case 6:
                        return (
                                <div className="flex flex-col gap-4 flex-1 p-12 flex-1">
                                    <div className="flex justify-start flex-col gap-4 place-start flex-1" >
                                        <div className="flex flex-col">
                                            <p className="font-bold text-xl">Pick Printer</p>
                                            <p className="text-gray-500">Please select from the following where wou would like to have your print printed.</p>
                                        </div>

                                        <div className="flex flex-row items-start gap-2 justify-between flex-1 h-full" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                                            <div className="flex flex-col gap-2 items-start flex-1">
                                                {
                                                    FIXED_PRINTER_OPTIONS.map((constr: MinifiedConstructor) => {
                                                        return (
                                                                <div
                                                                    key={constr.id}
                                                                    style={{ display: "grid", gridTemplateColumns: "1fr 50px 50px" }}
                                                                    className="flex flex-row items-center gap-4 bg-gray-100 px-2 py-1 rounded-md w-full justify-between">
                                                                    <div className="flex flex-row items-center gap-2">
                                                                        <div className={`h-4 w-4 rounded-full ${constr.completeness_level == Completeness.Absolute ? "bg-green-400" : "bg-orange-400"}`}></div>
                                                                        <p>{constr.name}</p>
                                                                    </div>

                                                                    <p className="text-gray-600">1.25km</p>
                                                                    <a className="font-semibold cursor-pointer" onClick={() => {
//                                                                        setConfig({ ...config, constructor: constr });
                                                                        setCanContinue(true);
                                                                    }}>Select</a>
                                                                </div>
                                                                )
                                                    })
                                                }
                                            </div>

                                            {/* <Map constructors={FIXED_PRINTER_OPTIONS} /> */}
                                        </div>
                                    </div>
                                </div>
                                )
                    default:
                        return (
                                <div className="flex flex-1 flex-col gap-4 items-center justify-center">
                                    <Image src="/img/unsure.svg" alt="" height={150} width={150}></Image>

                                    <div className="flex flex-col">
                                        <p className="font-bold text-lg">Uh oh!</p>
                                        <p className="text-gray-600">Please close this dialog and try again</p>
                                    </div>
                                </div>
                                )
                    }
                })()}

                <div className="flex flex-row items-center justify-between p-8">
                    <div className={`flex flex-row items-center gap-2 cursor-pointer bg-gray-200 px-2 py-1 rounded-md ${print_mode <= 0 ? "opacity-20" : ""} ${print_mode == 5 ? "hidden" : ""}`}
                        onClick={() => setPrintMode(print_mode < 1 ? 0 : (print_mode == 4 && config.delivery.method != "Delivery") ? 1 : print_mode-1 as typeof print_mode)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 12H4M4 12L10 18M4 12L10 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>

                        <p className="select-none">Back</p>
                    </div>

                    <div className={`flex flex-row items-center gap-2 cursor-pointer px-2 py-1 rounded-md ${!can_continue ? "opacity-20" : ""} ${print_mode == CONFIRM_PRINT_MODE ? "bg-green-100 text-green-800" : "bg-gray-200"}`}
                        onClick={() => {
                        if(print_mode == CONFIRM_PRINT_MODE+1) {
                            // We are restarting
                            setCanContinue(false);
                            setConfig({ ...DEFAULT_CONFIG });

                            console.log(DEFAULT_CONFIG);

                            setPrintMode(0);
                        }else if(print_mode == CONFIRM_PRINT_MODE) {
                            setWaiting(true);

                            const new_job: JobDBType = {
                                id: (Math.random() * 10000).toString(),

                                created_at: new Date(),
                                updated_at: new Date(),

                                current_status: "BIDDING",
                                status_history: [
                                    {
                                        value: JobStatus.BIDDING,
                                        timestamp: new Date().toISOString()
                                    }
                                ],

                                estimated_completion: "",

                                file_url: "https://s3.us-west-2.amazonaws.com/printr/nose_cone.obj",
                                file_name: config.files.map(k => k.name).join(', '),
                                job_name: config.files.map(k => k.name).join(', ').split('.')[0] ?? "",

                                job_preferences: config,
                                submitter_id: user_id,
                                constructor_id: null,
                                printer_id: null
                            };

                            fetch(`/api/jobs/create`, {
                                method: "POST",
                                body: JSON.stringify(new_job)
                            }).then(b => {
                                setCurrentJob(new_job);
                                // setPrintList([ ...printList, new_job ]);
                                setPrintMode(5);
                                setWaiting(false);

                                fetch(`/api/jobs/user/${user_id}`).then(async val => {
                                    const data: Job[] = await val.json();
                                    setRawPrintList(data);
                                    setPrintList(data);
                                    setActivePrint(data?.at(0) ?? null);
                                });
                            });
                        }else {
                            setPrintMode(print_mode > 4 ? 5 as typeof print_mode : (print_mode == 1 && config.delivery.method != "Delivery") ? 4 : print_mode == 2 && can_continue ? 4 : can_continue ? print_mode+1 as typeof print_mode : print_mode as typeof print_mode)
                        }
                    }}>
                    <p className="select-none">{ waiting ? "Processing Request" : print_mode == CONFIRM_PRINT_MODE ? "Place Order" : print_mode == CONFIRM_PRINT_MODE+1 ? "Restart" : "Continue" }</p>

                    {
                        waiting ?
                            <div className="rotate">
                                <Image src="./img/spinner.svg" height="18" width="18" alt=""/>
                            </div>
                        :
                            print_mode == CONFIRM_PRINT_MODE+1 ?
                                <svg width="18" height="18" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.54661 17.7675C9.94575 18.8319 12.8032 18.7741 15.2502 17.3613C19.3157 15.0141 20.7086 9.81556 18.3614 5.75008L18.1114 5.31706M3.63851 14.2502C1.2913 10.1847 2.68424 4.98619 6.74972 2.63898C9.19671 1.22621 12.0542 1.16841 14.4533 2.23277M1.49341 14.3338L4.22546 15.0659L4.95751 12.3338M17.0426 7.6659L17.7747 4.93385L20.5067 5.6659" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            :
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke={`${print_mode == CONFIRM_PRINT_MODE ? "#166534" : "black"}`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                    }
                </div>

                <div className={`bg-gray-100 px-2 py-1 rounded-md w-fit flex-row items-center gap-2 ${print_mode == 5 ? "flex" : "hidden"}`}
                    onClick={() => {
                        setActiveMenu(1);
                        setPrintMode(0)
                        setConfig({ ...DEFAULT_CONFIG })
                    }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 1L1 13M1 1L13 13" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>

                    <p>Close this window</p>
                </div>
            </div>
        </div>
    )
}