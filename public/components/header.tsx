import { useState } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { User } from "@prisma/client";
import { useRouter } from "next/router";

export const Header = ({ activeUser, currentPage }: {  activeUser: User, currentPage: String }) => {
    const [ showModal, setShowModal ] = useState(false);
    const router = useRouter();

    return (    
        <>
            <title>Printr</title>
            <link rel="icon" href="/favicon.ico" />

            <div className="flex flex-row items-center justify-between w-full min-w-screen px-8 py-4">
                {
                    currentPage == "CONST" ?
                    <div className="flex flex-row items-center gap-2 relative cursor-pointer" onClick={() => {
                        router.push("/")
                    }}>
                        <Image src="favicon.svg" alt="" height={28} width={28}></Image>
                        <p className="font-bold text-xl">printr</p>
                        <p className="text-blue-600 font-bold text-sm absolute ml-[88px] mt-[1rem]">CONSTRUCTOR</p>
                    </div>
                        :
                    <div className="flex flex-row items-center gap-2 cursor-pointer" onClick={() => {
                        router.push("/")
                    }}>
                        <Image src="favicon.svg" alt="" height={28} width={28}></Image>
                        <p className="font-bold text-xl">printr</p>
                    </div>
                }


                <p></p>

                <div className={`${activeUser.is_constructor ? "bg-gray-100 px-4 pr-0 rounded-md" : ""} overflow-hidden flex flex-row items-center gap-4`}>
                    <a
                        href={currentPage == "INDX" ? "./constructr" : "./"}
                        className={`flex-row items-center gap-4 text-slate-800 cursor-pointer ${activeUser.is_constructor ? "flex" : "hidden"}`}>
                        <p>Switch to {currentPage == "INDX" ? "constructor" : "customer"} view</p>
                    </a>

                    <div
                        onClick={() => setShowModal(true)} 
                        className={`flex relative flex-row items-center gap-4 py-1 px-3 ${activeUser.is_constructor ? "bg-slate-900 text-white" : ""}`}>
                        <p>{activeUser.name}</p>
                        <Image src="/img/user_icons/blurple.svg" alt="" height={35} width={35}></Image>

                        {
                            showModal ?
                            <div
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setShowModal(false)
                                }} 
                                id="modal-cover"
                                className="fixed w-screen h-screen text-gray-900" style={{ minWidth: '100vw', minHeight: '100vh', left: 0, top: 0}}>
                                <div 
                                    onClick={(e) => {
                                        e.stopPropagation()
                                    }} 
                                    id="modal"
                                    className="fixed top-16 right-8 bg-gray-100 flex flex-col items-center gap-2 py-2 px-2 rounded-md">
                                    <div 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            window.location.href = "/profile"
                                        }} 
                                        id="profile-btn"
                                        className="flex w-full flex-row items-center gap-4 px-3 py-2 hover:bg-white rounded-md cursor-pointer justify-between">
                                        <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17 19C17 17.6044 17 16.9067 16.8278 16.3389C16.44 15.0605 15.4395 14.06 14.1611 13.6722C13.5933 13.5 12.8956 13.5 11.5 13.5H6.5C5.10444 13.5 4.40665 13.5 3.83886 13.6722C2.56045 14.06 1.56004 15.0605 1.17224 16.3389C1 16.9067 1 17.6044 1 19M13.5 5.5C13.5 7.98528 11.4853 10 9 10C6.51472 10 4.5 7.98528 4.5 5.5C4.5 3.01472 6.51472 1 9 1C11.4853 1 13.5 3.01472 13.5 5.5Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>

                                        <p>Profile</p>
                                    </div>
                                    <div 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            window.location.href = "/documentation"
                                        }} 
                                        id="docs-btn"
                                        className="flex w-full flex-row items-center gap-4 px-3 py-2 hover:bg-white rounded-md cursor-pointer justify-between">
                                        <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11 10H5M7 14H5M13 6H5M17 5.8V16.2C17 17.8802 17 18.7202 16.673 19.362C16.3854 19.9265 15.9265 20.3854 15.362 20.673C14.7202 21 13.8802 21 12.2 21H5.8C4.11984 21 3.27976 21 2.63803 20.673C2.07354 20.3854 1.6146 19.9265 1.32698 19.362C1 18.7202 1 17.8802 1 16.2V5.8C1 4.11984 1 3.27976 1.32698 2.63803C1.6146 2.07354 2.07354 1.6146 2.63803 1.32698C3.27976 1 4.11984 1 5.8 1H12.2C13.8802 1 14.7202 1 15.362 1.32698C15.9265 1.6146 16.3854 2.07354 16.673 2.63803C17 3.27976 17 4.11984 17 5.8Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>

                                        <p>Docs</p>
                                    </div>
                                    <div 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            signOut()
                                        }} 
                                        id="sign-out-btn"
                                        className="flex w-full flex-row items-center gap-4 px-3 py-2 hover:bg-white rounded-md cursor-pointer">
                                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14 14.9999L19 9.99994M19 9.99994L14 4.99994M19 9.99994H7M10 14.9999C10 15.2955 10 15.4433 9.98901 15.5713C9.87482 16.9019 8.89486 17.9968 7.58503 18.2572C7.45903 18.2823 7.31202 18.2986 7.01835 18.3312L5.99694 18.4447C4.46248 18.6152 3.69521 18.7005 3.08566 18.5054C2.27293 18.2453 1.60942 17.6515 1.26118 16.8724C1 16.2881 1 15.5162 1 13.9722V6.02764C1 4.4837 1 3.71174 1.26118 3.12746C1.60942 2.34842 2.27293 1.75454 3.08566 1.49447C3.69521 1.29941 4.46246 1.38466 5.99694 1.55516L7.01835 1.66865C7.31212 1.70129 7.45901 1.71761 7.58503 1.74267C8.89486 2.0031 9.87482 3.09798 9.98901 4.42855C10 4.55657 10 4.70436 10 4.99994" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>

                                        <p>Sign Out</p>
                                    </div>
                                    <div 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            alert(e.currentTarget.id)
                                        }} 
                                        id="settings-btn"
                                        className="flex w-full flex-row items-center gap-4 px-3 py-2 hover:bg-white rounded-md cursor-pointer">
                                        <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.3951 18.3711L7.97955 19.6856C8.15329 20.0768 8.43683 20.4093 8.79577 20.6426C9.15472 20.8759 9.57366 21.0001 10.0018 21C10.4299 21.0001 10.8488 20.8759 11.2078 20.6426C11.5667 20.4093 11.8503 20.0768 12.024 19.6856L12.6084 18.3711C12.8165 17.9047 13.1664 17.5159 13.6084 17.26C14.0532 17.0034 14.5678 16.8941 15.0784 16.9478L16.5084 17.1C16.9341 17.145 17.3637 17.0656 17.7451 16.8713C18.1265 16.6771 18.4434 16.3763 18.6573 16.0056C18.8715 15.635 18.9735 15.2103 18.9511 14.7829C18.9286 14.3555 18.7825 13.9438 18.5307 13.5978L17.684 12.4344C17.3825 12.0171 17.2214 11.5148 17.224 11C17.2239 10.4866 17.3865 9.98635 17.6884 9.57111L18.5351 8.40778C18.787 8.06175 18.933 7.65007 18.9555 7.22267C18.978 6.79528 18.8759 6.37054 18.6618 6C18.4479 5.62923 18.131 5.32849 17.7496 5.13423C17.3681 4.93997 16.9386 4.86053 16.5129 4.90556L15.0829 5.05778C14.5722 5.11141 14.0577 5.00212 13.6129 4.74556C13.17 4.48825 12.82 4.09736 12.6129 3.62889L12.024 2.31444C11.8503 1.92317 11.5667 1.59072 11.2078 1.3574C10.8488 1.12408 10.4299 0.99993 10.0018 1C9.57366 0.99993 9.15472 1.12408 8.79577 1.3574C8.43683 1.59072 8.15329 1.92317 7.97955 2.31444L7.3951 3.62889C7.18803 4.09736 6.83798 4.48825 6.3951 4.74556C5.95032 5.00212 5.43577 5.11141 4.9251 5.05778L3.49066 4.90556C3.06499 4.86053 2.6354 4.93997 2.25397 5.13423C1.87255 5.32849 1.55567 5.62923 1.34177 6C1.12759 6.37054 1.02555 6.79528 1.04804 7.22267C1.07052 7.65007 1.21656 8.06175 1.46844 8.40778L2.3151 9.57111C2.61704 9.98635 2.77964 10.4866 2.77955 11C2.77964 11.5134 2.61704 12.0137 2.3151 12.4289L1.46844 13.5922C1.21656 13.9382 1.07052 14.3499 1.04804 14.7773C1.02555 15.2047 1.12759 15.6295 1.34177 16C1.55589 16.3706 1.8728 16.6712 2.25417 16.8654C2.63554 17.0596 3.06502 17.1392 3.49066 17.0944L4.92066 16.9422C5.43133 16.8886 5.94587 16.9979 6.39066 17.2544C6.83519 17.511 7.18687 17.902 7.3951 18.3711Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M9.99998 14C11.6568 14 13 12.6569 13 11C13 9.34315 11.6568 8 9.99998 8C8.34313 8 6.99998 9.34315 6.99998 11C6.99998 12.6569 8.34313 14 9.99998 14Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>

                                        <p>Settings</p>
                                    </div>
                                </div>
                            </div>
                            :
                            <></>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}