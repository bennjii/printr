import { ChangeEvent, createRef, DragEventHandler, useState } from "react";
import Image from "next/image";

export const PrintStart = ({ expanded }:  { expanded: boolean }) => {
    const [ print_mode, setPrintMode ] = useState<0 | 1 | 2>(0);
    const [ is_dragged, setIsDragged ] = useState(false);

    const [ file_list, setFileList ] = useState([]);

    const file_ref = createRef<HTMLInputElement>();

    const onFileChangeCapture = ( e: ChangeEvent<HTMLInputElement> ) => {
        console.log(e.target.files);
    };

    const dropHandler = (e: DragEventHandler<HTMLDivElement>) => {
        e.preventDefault();
        const files = e.dataTransfer.files as any[];

        console.log("Files: ", files);
        setFileList([...file_list, ...files])
    }

    return (
        <div className={`${expanded ? "flex" : "none hidden"} flex-col flex-1 `}>
            {(() => {
                switch(print_mode) {
                    // style={{ background: "radial-gradient(circle, rgba(41,98,255,0.7861738445378151) 42%, rgba(252,252,252,1) 68%)" }}
                    // <div className="absolute w-full h-full bg-blue-50 z-0 bg-opacity-20 blur-3xl dark:bg-opacity-20 dark:bg-blue-200"></div>
                    case 0:
                        return (
                            <div className="flex flex-col gap-4 flex-1 p-12 ">
                                <div className="flex justify-center flex-col gap-4 place-start" >
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
                                        onDropCapture={(e) => dropHandler(e)}
                                        onDrop={(e) => dropHandler(e)}
                                        >
                                        <p className="font-semibold text-center">Drag and drop or <a className="text-blue-600" onClick={() => file_ref.current?.click()} onDragOver={e => e.preventDefault()} onDrop={(e) => dropHandler(e)}>choose file</a></p>
                                    </div>

                                    {
                                        file_list.map(file => {
                                            return (
                                                <div>
                                                    <p>{JSON.stringify(file)}</p>
                                                </div>
                                            )
                                        })
                                    }
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
                <div className={`flex flex-row items-center gap-2 cursor-pointer bg-gray-100 px-2 py-1 rounded-md ${print_mode <= 0 ? "opacity-20" : ""}`} onClick={() => setPrintMode(print_mode < 1 ? 0 : print_mode-1 as typeof print_mode)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 12H4M4 12L10 18M4 12L10 6" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>

                    <p className="select-none">Back</p>
                </div>

                <div className={`flex flex-row items-center gap-2 cursor-pointer bg-gray-100 px-2 py-1 rounded-md`} onClick={() => setPrintMode(print_mode > 1 ? 2 : print_mode+1 as typeof print_mode)}>
                    <p className="select-none">Continue</p>

                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>
    )
}