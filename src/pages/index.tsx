import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PrintStart } from "../../public/components/print";
//<div className="bg-gray-900 px-4 py-2 rounded-lg text-white">Start Printing</div>

const Home: NextPage = () => {
    const [ expanded, setExpanded ] = useState(true);

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
                    <div className="flex flex-row items-center bg-gray-100 gap-4 px-4 py-2 rounded-md">
                        <div className="bg-green-400 h-[20px] w-[20px] rounded-full"></div>
                        <div className="">
                            <p className="font-bold">Sundial</p>
                            <p className="text-gray-600">32 Minutes Remaining</p>
                        </div>
                    </div>

                    <div className="flex flex-row items-center bg-gray-100 gap-4 px-4 py-2 rounded-md">
                        <div className="bg-green-400 h-[20px] w-[20px] rounded-full"></div>
                        <div className="">
                            <p className="font-bold">Clock Hands</p>
                            <p className="text-gray-600">5 Hours Remaining</p>
                        </div>
                    </div>

                    <div className="flex flex-row items-center bg-gray-100 gap-4 px-4 py-2 rounded-md">
                        <div className="bg-blue-400 h-[20px] w-[20px] rounded-full"></div>
                        <div className="flex flex-col gap-0">
                            <p className="font-bold">Nose Cone</p>
                            <p className="text-gray-600">Completed</p>
                        </div>
                    </div>
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

                        <PrintStart expanded={expanded}/>
                    </div>

                    <div className={`flex ${ !expanded ? "flex-1 " : ""} flex-col bg-gray-50 bg-opacity-50 rounded-md w-full`}>
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

                            <p className="select-none font-semibold">Sundial</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Home;
