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
    const [ activeUser, setActiveUser ] = useState(auth.user as any as User);
    const [ activeTab, setActiveTab ] = useState<"Customer Prints" | "Constructor Jobs" | "Profile" | "Billing" | "Print States">("Customer Prints");  

    useEffect(() => {
        fetch(`/api/user/${auth.id}`).then(async val => {
            const data: User = await val.json();
            setActiveUser(data);
        });
    }, [])

    return (
        <div className="flex flex-col min-w-screen w-full min-h-screen h-full">
            <Header activeUser={activeUser} currentPage="INDX" />

            <p className="text-2xl p-16 pb-4 font-bold">Documentation</p>

            <div className="flex flex-row items-start p-16 pt-4 gap-12">
                <div className="flex flex-col gap-2 flex-1 min-w-[150px]">
                    <p className={`cursor-pointer ${activeTab == "Customer Prints" ? "text-blue-700" : ""}`} onClick={() => setActiveTab("Customer Prints")}>Customer Prints</p>
                    { (activeUser.is_constructor) ? <p className={`cursor-pointer ${activeTab == "Constructor Jobs" ? "text-blue-700" : ""}`} onClick={() => setActiveTab("Constructor Jobs")}>Constructor Jobs</p> : <></>}
                    <p className={`cursor-pointer ${activeTab == "Profile" ? "text-blue-700" : ""}`} onClick={() => setActiveTab("Profile")}>Profile</p>
                    <p className={`cursor-pointer ${activeTab == "Billing" ? "text-blue-700" : ""}`} onClick={() => setActiveTab("Billing")}>Billing</p>
                    <p className={`cursor-pointer ${activeTab == "Print States" ? "text-blue-700" : ""}`} onClick={() => setActiveTab("Print States")}>Print States</p>
                </div>

                {(() => {
                    switch(activeTab) {
                        case "Customer Prints":
                            return (
                                <div className="w-full flex flex-col">
                                    <p className="font-bold text-xl">How to upload a print?</p>
                                    <p className="text-gray-600">Here you can create a print a 3D file simply by uploading it and selecting your preferences. </p>
                                    <p className="text-gray-600">You simply need to drag a file or the below 'choose file' button on your view to get started.</p>

                                    <Image className="self-center rounded-md shadow-md my-4" src="/img/docs/Screenshot 2023-04-16 at 5.15.32 pm.png" alt="" height={500} width={500} />

                                    <p className="text-gray-600">Once uploaded, simply click <strong>Continue</strong></p>
                                    <br />

                                    <p className="font-bold text-xl">How to customise a print?</p>
                                    <p className="text-gray-600">In order to customise, your print, you can simply select the options in the viewport, simply click any of the buttons in the options below. </p>

                                    <Image className="self-center rounded-md shadow-md my-4" src="/img/docs/Screenshot 2023-04-16 at 5.25.44 pm.png" alt="" height={500} width={500} />

                                    <div className="bg-yellow-100 p-2 rounded-md flex flex-row gap-4 items-center px-4">
                                        <p className="text-yellow-100 bg-yellow-400 rounded-full flex items-center justify-center w-16 h-9 font-bold">i</p>
                                        <p className="text-yellow-900">If you choose delivery, you will be prompted wether or not you wish to skip <strong>Print Checking</strong>. <br /> By choosing to do so, your print will not be checked or reviewed with you for damages, but shipped immediately. This is faster than the usual method but <strong>you accept the liability of any printing damages or deformities</strong></p>
                                    </div>

                                    <br />

                                    <p className="font-bold text-xl">Why should I leave print notes?</p>
                                    <p className="text-gray-600">If there is a certain way you wish your print to be completed, or just want to thank your constructor - you can do so by leaving a note. This is usually used to reduce uncertainty around how a print should be performed or to ensure and qualify why a print meets printing standards</p>

                                    <br />

                                    <p className="font-bold text-xl">I haven't been contacted, is my print being printed or not?</p>
                                    <p className="text-gray-600">There are a few possible reasons why this might happen...</p>
                                    <br />
                                    <p className="text-gray-800 font-semibold">1. You have not accepted a bid. </p>
                                    <p className="text-gray-600">Please make sure you go to your print and view the active bids and accept one if there are any, if not, check 2.</p>

                                    <Image className="self-center rounded-md shadow-md my-4" src="/img/docs/Screenshot 2023-04-16 at 5.42.02 pm.png" alt="" height={500} width={500} />

                                    <p className="text-gray-800 font-semibold">2. No constructors have accepted your print.</p>
                                    <p className="text-gray-600">This can happen if your bid is unreasonable or there is a lack of constructors in your area. If this happens, please wait a bit longer.</p>
                                    <p className="text-gray-600">If you have preferred a pickup, please consider changing this to delivery to increase your area of available constructors.</p>
                                </div>
                            )
                        case "Constructor Jobs":
                            return (
                                <div className="w-full flex flex-col">
                                    <p className="font-bold text-xl">How do I make an offer?</p>
                                    <p className="text-gray-600">In order to accept a job, you will need to make an offer, you can do so by finding any jobs in the <strong>Job Queue</strong> which are in the bidding state, and clicking <strong>Make Offer</strong>. </p>

                                    <Image className="self-center rounded-md shadow-md my-4" src="/img/docs/Screenshot 2023-04-16 at 5.58.49 pm.png" alt="" height={500} width={500} />
                                    <p className="text-gray-600">Following this, you will be prompted for an amount you wish to offer, this will be the price you big against other constructors for - the customer can then choose between these offers for the one that best suits them according to distance and price. </p>

                                    <br />

                                    <p className="font-bold text-xl">My print is in Pre-Print what do I do now?</p>
                                    <p className="text-gray-600">Now, you will need to download the file and give it to the printer <strong>you indicated in your offer</strong> in whichever format you prefer. Once your printer has started printing, you should click <strong>Set print as started</strong> from the following options in your active print menu. This will let the customer know that the print has begun.</p>

                                    <Image className="self-center rounded-md shadow-md my-4" src="/img/docs/Screenshot 2023-04-16 at 6.21.28 pm.png" alt="" height={250} width={250} />

                                    <p className="font-bold text-xl">What evidence should I submit?</p>
                                    <p className="text-gray-600">You should submit photos and a scan which support the print that has ocurred, this should show to the user the quality of print performed, and should cover all appropriate areas of the print so the user can see exactly what has been printed and report any issues with the print. </p>
                                    
                                    <br />

                                    <div className="bg-yellow-100 p-2 rounded-md flex flex-row gap-4 items-center px-4">
                                        <p className="text-yellow-100 bg-yellow-400 rounded-full flex items-center justify-center w-16 h-9 font-bold">i</p>
                                        <p className="text-yellow-900">Failure to provide accurate evidence can result in a refund for the customer who is receiving errors unbeknownst to them. Providing accurate records will keep you away from issues.</p>
                                    </div>
                                     
                                    <br />

                                    <p className="font-bold text-xl">The print is too large to package, what should I do?</p>
                                    <p className="text-gray-600">If you are unable to, or think it too risky to deliver the item, you can force the user to pickup the item, either by themselves or by someone else. You can do so by clicking <strong>Force Pickup</strong> from the menu items.</p>

                                    <Image className="self-center rounded-md shadow-md my-4" src="/img/docs/Screenshot 2023-04-16 at 6.34.03 pm.png" alt="" height={250} width={250} />
                                </div>
                            )
                        case "Profile":
                            return (
                                <div className="w-full flex flex-col">
                                    <p className="font-bold text-xl">How do I change my address?</p>
                                    <p className="text-gray-600">You simply click the edit icon and add a new address, same with your name and email address.</p>
                                </div>
                            )
                        case "Billing":
                            return (
                                <div className="w-full flex flex-col">
                                    <p className="font-bold text-xl">What is printr's commission?</p>
                                    <p className="text-gray-600">We charge <strong>2.00%</strong> on each print, simple and small.</p>
                                    <br />

                                    <p className="font-bold text-xl">How am I charged for a print?</p>
                                    <p className="text-gray-600">When you accept a bid, you are charged to the card loaded on your account. We use Stripe for payment, so to modify your billing information - please go to your Profile and click <strong>Go to Billing Portal</strong>.</p>
                                    <br />

                                    <p className="font-bold text-xl">As a constructor, when do I receive money?</p>
                                    <p className="text-gray-600">Every transaction is tallied into a total which you can view in your <strong>Profile</strong>, the amount you are owed. This will be paid out you at the end of every month by our payment provider Stripe.  So see a breakdown, please go to your Profile and click <strong>Go to Billing Portal</strong>.</p>
                                </div>
                            )
                        case "Print States":
                            return (
                                <div className="w-full flex flex-col">
                                    <p className="font-bold text-xl">Print States</p>
                                    <p className="text-gray-600">All possible print states are as follows: </p>

                                    <br />

                                    <p className="text-gray-800 font-semibold">Draft</p>
                                    <p className="text-gray-600">The print is a draft and is not being requested for print at this stage.</p>
                                    <br />

                                    <p className="text-gray-800 font-semibold">Bidding</p>
                                    <p className="text-gray-600">The print is being bid for, constructors can bid on the item and the user can accept the print.</p>
                                    <br />

                                    <p className="text-gray-800 font-semibold">Pre-Print</p>
                                    <p className="text-gray-600">The job has been accepted, and will be printed by the constructor shortly, the constructor is allowed to download and upload the print to their printers, customers are advised to wait.</p>
                                    <br />

                                    <p className="text-gray-800 font-semibold">Printing</p>
                                    <p className="text-gray-600">The print is currently being printed, should be done shortly!</p>
                                    <br />

                                    <p className="text-gray-800 font-semibold">Pre-Delivery</p>
                                    <p className="text-gray-600">The print has completed, the constructor must upload evidence to move to the review stage.</p>
                                    <br />

                                    <p className="text-gray-800 font-semibold">Review</p>
                                    <p className="text-gray-600">The customer must accept or ask for a revision to move onward.</p>
                                    <br />

                                    <p className="text-gray-800 font-semibold">En-Route</p>
                                    <p className="text-gray-600">The print has been shipped and delivery information will be attached shortly.</p>
                                    <br />

                                    <p className="text-gray-800 font-semibold">Complete</p>
                                    <p className="text-gray-600">The print has been completed, enjoy.</p>
                                    <br />

                                    <p className="text-gray-800 font-semibold">Canceled</p>
                                    <p className="text-gray-600">The print has been canceled.</p>
                                    <br />

                                    <p className="text-gray-800 font-semibold">Ready-For-Pickup</p>
                                    <p className="text-gray-600">The print is ready for pickup, customers should go to the address and constructors please wait for the customer to arrive.</p>
                                    <br />
                                </div>
                            )
                    }
                })()}
            </div>
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