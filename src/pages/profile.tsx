import {GetServerSideProps, type NextPage} from "next";
import {createRef, useEffect, useState} from "react";
import {PrintStart} from "../../public/components/print";
import {DEFAULT_PRINT_JOBS, DEFAULT_USER} from "../../public/lib/helpers";
import {History, job_status_to_colour_pair, job_status_to_string, job_status_to_type, JobStatus, PrintConfig} from "../../public/lib/printr";
import {Header} from "../../public/components/header";
import {JobElement} from "../../public/components/job";
import Image from "next/image";
import {getSession, useSession} from "next-auth/react";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../server/auth";
import { Bid, Job, User } from "@prisma/client";
import Button from "@components/un-ui/button";

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

    useEffect(() => {
        fetch(`/api/user/${auth.id}`).then(async val => {
            const data: User = await val.json();
            setActiveUser(data);
        });
    }, [])

    return (
            <div className="flex flex-col min-w-screen w-full min-h-screen h-full">
                <Header activeUser={activeUser} currentPage="INDX" />

                <div className="flex flex-1 flex-col p-16">
                    <p className="text-2xl font-bold">{activeUser.name}</p>
                    <p>{activeUser.email}</p>
                    <p>{activeUser.location}</p>

                    <br />

                    <p className="text-sm font-bold text-gray-400">BILLING INFORMATION</p>
                    <p>{ activeUser.is_constructor ? "To Receive:" : "Total Due:" } <strong>$15.00</strong></p>

                    <br />

                    <Button className="text-gray-800 text-left w-fit bg-gray-200">View Billing Portal</Button>
                </div>

                <p className="flex flex-col p-16 opacity-20">Last Updated: {activeUser.updated_at?.toString()}</p>
            </div>
    )
}

export const  getServerSideProps: GetServerSideProps = async (context) => {
    const metaTags = {
		"og:title": [`Upload. Print. Collect.`],
		"og:description": [""],
		"og:url": [`https://printr.vercel.app/`],
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