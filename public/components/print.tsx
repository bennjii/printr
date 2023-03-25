import { type ChangeEvent, createRef, useState } from "react";
import Image from "next/image";
import { COLOUR_OPTIONS, DELIVERY_OPTIONS, FILAMENT_OPTIONS, getSize } from "../lib/helpers";
import { type PrintConfig } from "../lib/printr";
import { Map } from './map'

export const PrintStart = ({ expanded }:  { expanded: boolean }) => {
    const [ print_mode, setPrintMode ] = useState<0 | 1 | 2 | 3 | 4>(3);
    const [ is_dragged, setIsDragged ] = useState(false);
    const [ can_continue, setCanContinue ] = useState(false);

    const [ config, setConfig ] = useState<PrintConfig>({
        colour: COLOUR_OPTIONS[0]!,
        filament: FILAMENT_OPTIONS[0]!,
        delivery: DELIVERY_OPTIONS[0]!,
        files: [],
        DANGEROUS_PREFERS_NO_CHECKS: false
    });

    const file_ref = createRef<HTMLInputElement>();

    const onFileChangeCapture = ( e: ChangeEvent<HTMLInputElement> ) => {
        e.preventDefault();
        e.target.files ? dropHandler(e.target.files) : {};
    };

    const dropHandler = (files: FileList) => {
        setIsDragged(false);

        const f_l = config.files;
        f_l.push(files)

        setConfig({ ...config, files: f_l })
        setCanContinue(true);
    }

    return (
        <div className={`${expanded ? "flex" : "none hidden"} flex-col flex-1 `}>
            {(() => {
                switch(print_mode) {
                    // style={{ background: "radial-gradient(circle, rgba(41,98,255,0.7861738445378151) 42%, rgba(252,252,252,1) 68%)" }}
                    // <div className="absolute w-full h-full bg-blue-50 z-0 bg-opacity-20 blur-3xl dark:bg-opacity-20 dark:bg-blue-200"></div>
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
                                        <p className="font-semibold text-center">Drag and drop or <a className="text-blue-600" onClick={() => file_ref.current?.click()}>choose file</a></p>
                                    </div>

                                    {
                                        config.files.map((file, i) => {
                                            console.log("F", file);

                                            return (
                                                <div key={`INDX-${i}`} className="flex flex-row items-center gap-2">
                                                    <div className="bg-blue-200 text-blue-800 px-2 rounded-md">{file[0]?.name.split(".")[1]}</div>
                                                    <p>{file[0]?.size ? getSize(file[0]?.size.toString(), 2) : "0B"}</p>
                                                    <p className="text-gray-600">{file[0]?.name.split(".")[0]}</p>
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

                                            <div className="flex flex-col gap-2 bg-gray-100 p-4 rounded-md" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-row items-center gap-2"  style={{ display: 'grid', gridTemplateColumns: '40% 1fr' }}>
                                                        <div className="bg-gray-200 px-2 rounded-md font-semibold">
                                                            File(s):
                                                        </div>
                                                        {config.files.map(k => k[0]?.name).join(', ')}
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
                                                                    style={{ backgroundColor: colour.primary_hex, color: colour.secondary_hex }}
                                                                    className="flex flex-row items-center px-3 py-1 rounded-md cursor-pointer"
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
                                                                        className="flex flex-row items-center px-3 py-1 rounded-md cursor-pointer"
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
                                                                        className="flex flex-row items-center px-3 py-1 rounded-md cursor-pointer"
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
                    case 3:
                        return (
                                <div className="flex flex-col gap-4 flex-1 p-12 flex-1">
                                    <div className="flex justify-start flex-col gap-4 place-start flex-1" >
                                        <div className="flex flex-col">
                                            <p className="font-bold text-xl">Pick Printer</p>
                                            <p className="text-gray-500">Please select from the following where wou would like to have your print printed.</p>
                                        </div>

                                        <div className="flex flex-row items-start gap-2 justify-between flex-1 h-full">
                                            <div className="flex flex-col gap-2 items-start flex-1">
                                                <div
                                                    style={{ display: "grid", gridTemplateColumns: "1fr 50px 50px" }}
                                                    className="flex flex-row items-center gap-4 bg-gray-100 px-2 py-1 rounded-md w-full justify-between">
                                                    <div className="flex flex-row items-center gap-2">
                                                        <div className="h-4 w-4 rounded-full bg-green-400"></div>
                                                        <p>Darlington Prints</p>
                                                    </div>

                                                    <p className="text-gray-600">0.5km</p>
                                                    <a className="font-semibold cursor-pointer">Select</a>
                                                </div
>

                                                <div
                                                    style={{ display: "grid", gridTemplateColumns: "1fr 50px 50px" }}
                                                    className="flex flex-row items-center gap-4 bg-gray-100 px-2 py-1 rounded-md w-full justify-between">
                                                    <div className="flex flex-row items-center gap-2">
                                                        <div className="h-4 w-4 rounded-full bg-green-400"></div>
                                                        <p>Central 3D Printers</p>
                                                    </div>

                                                    <p className="text-gray-600">0.9km</p>
                                                    <a className="font-semibold cursor-pointer">Select</a>
                                                </div
>

                                                <div
                                                    style={{ display: "grid", gridTemplateColumns: "1fr 50px 50px" }}
                                                    className="flex flex-row items-center gap-4 bg-gray-100 px-2 py-1 rounded-md w-full justify-between">
                                                    <div className="flex flex-row items-center gap-2">
                                                        <div className="h-4 w-4 rounded-full bg-green-400"></div>
                                                        <p>Jackson House 3D</p>
                                                    </div>

                                                    <p className="text-gray-600">1.25km</p>
                                                    <a className="font-semibold cursor-pointer">Select</a>
                                                </div>
                                            </div>

                                            <Map />
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
                <div className={`flex flex-row items-center gap-2 cursor-pointer bg-gray-100 px-2 py-1 rounded-md ${print_mode <= 0 ? "opacity-20" : ""}`}
                    onClick={() => setPrintMode(print_mode < 1 ? 0 : (print_mode == 3 && config.delivery.method != "Delivery") ? 1 : print_mode-1 as typeof print_mode)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 12H4M4 12L10 18M4 12L10 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>

                    <p className="select-none">Back</p>
                </div>

                <div className={`flex flex-row items-center gap-2 cursor-pointer bg-gray-100 px-2 py-1 rounded-md ${!can_continue ? "opacity-20" : ""}`}
                    onClick={() => setPrintMode(print_mode > 2 ? 3 : (print_mode == 1 && config.delivery.method != "Delivery") ? 3 : print_mode+1 as typeof print_mode)}>
                    <p className="select-none">Continue</p>

                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>
    )
}