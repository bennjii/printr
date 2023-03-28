import {User} from "../lib/printr";
import Image from "next/image";

export const Header = ({ activeUser, currentPage }: {  activeUser: User, currentPage: String }) => {
    return (
        <>
            <title>Printr</title>
            <link rel="icon" href="/favicon.ico" />

            <div className="flex flex-row items-center justify-between w-full min-w-screen px-8 py-4">
                {
                    currentPage == "CONST" ?
                    <div className="flex flex-row items-center gap-2 relative">
                        <Image src="favicon.svg" alt="" height={28} width={28}></Image>
                        <p className="font-bold text-xl">printr</p>
                        <p className="text-blue-600 font-bold text-sm absolute ml-[88px] mt-[1rem]">CONSTRUCTOR</p>
                    </div>
                        :
                    <div className="flex flex-row items-center gap-2">
                        <Image src="favicon.svg" alt="" height={28} width={28}></Image>
                        <p className="font-bold text-xl">printr</p>
                    </div>
                }


                <p></p>

                <div className={`${activeUser.is_constructor ? "bg-gray-100 px-4 pr-0 rounded-md" : ""} overflow-hidden flex flex-row items-center gap-4`}>
                    <a
                        href={currentPage == "INDX" ? "./constructor" : "./"}
                        className={`flex-row items-center gap-4 text-slate-800 cursor-pointer ${activeUser.is_constructor ? "flex" : "hidden"}`}>
                        <p>Switch to {currentPage == "INDX" ? "constructor" : "customer"} view</p>
                    </a>

                    <div className={`flex flex-row items-center gap-4 py-1 px-3 ${activeUser.is_constructor ? "bg-slate-900 text-white" : ""}`}>
                        <p>{activeUser.name}</p>
                        <Image src="/img/user_icons/blurple.svg" alt="" height={35} width={35}></Image>
                    </div>
                </div>
            </div>
        </>
    )
}