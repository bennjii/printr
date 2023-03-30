import { useEffect, useRef, useState } from 'react';
import { motion } from "framer-motion";
import { cardVariants, subTitleControl } from '@components/framer_constants';

import { getSession, getCsrfToken, signIn as signInAuth, getProviders, ClientSafeProvider } from "next-auth/react";
import { GetServerSidePropsContext } from 'next';

import InputField from '@components/un-ui/input_field';
import Button from '@components/un-ui/button';

import { ArrowRight, Check, GitHub  } from 'react-feather';
import { useRouter } from 'next/router';
import { filter } from "lodash";

export default function Home({ providers }: { providers: ClientSafeProvider[] }) {
    const [ authInformation, setAuthInformation ] = useState({
        email: "",
        password: "",
        name: ""
    });

    const router = useRouter();

    const [ awaitingReply, setAwaitingReply ] = useState(false);
    const [ authFailure, setAuthFailure ] = useState("");
    const [ authSuccess, setAuthSuccess ] = useState<"logged_out" | "logged_in" | "login_failure">("logged_out");

    const signIn = async (provider?: any) => {
        setAwaitingReply(true);

        if(provider)
            signInAuth(provider).then(e => {
            });
        else {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                body: JSON.stringify({ ...authInformation }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setAwaitingReply(false);
                throw new Error(data.message || 'Something went wrong!');
            }

            if(response.status == 201) {
                const val = await signInAuth("credentials", {
                    email: authInformation.email,
                    password: authInformation.password,
                    redirect: false,
                });

                const { ok, error } = val!;

                setAwaitingReply(false);

                if(error) {
                    console.log(error);
                    setAuthSuccess("login_failure");
                    setAuthFailure("Account does not exist, try signing up!");
                }else {
                    setAuthSuccess("logged_in");
                    setAuthFailure("");

                    router.replace('/');
                }
            }else {
                setAwaitingReply(false);
                setAuthSuccess("login_failure");
                setAuthFailure(data?.message ?? "Authentication Failure");
            }
        }
    }

    return (
            <div className="flex-col flex font-sans min-h-screen" > {/* style={{ background: 'linear-gradient(-45deg, rgba(99,85,164,0.2) 0%, rgba(232,154,62,.2) 100%)' }} */}
                <div className="flex-col flex font-sans min-h-screen w-screen relative overflow-hidden">
                    <div id="gradient-canvas" className="md:top-0 w-full z-10 absolute h-screen  bg-blue-400" style={{ width: '200%', height: '200%', zIndex: 0 }} data-transition-in></div>

                    <div className="flex-row flex-1 w-screen h-full grid sm:grid-cols-3">
                        <div className="w-full bg-white z-20 flex justify-center items-center flex-col sm:px-72">
                            <div className="flex flex-col flex-1 gap-8 justify-center">
                                <motion.div initial="offscreen" whileInView="onscreen" viewport={{ once: true }} variants={subTitleControl}>
                                    <a className="font-bold font-altSans text-lg text-slate-400 hover:cursor-pointer" href="../">printr</a>
                                    <motion.h1 variants={cardVariants} className="m-0 font-bold text-2xl md:text-3xl">Sign Up</motion.h1>
                                    <motion.p  variants={cardVariants} className="text-slate-600 text-base">Welcome to printr!</motion.p>
                                </motion.div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm uppercase text-slate-500">Name</p>
                                        <InputField
                                            placeholder='Username'
                                            type="text"
                                            noArrow={true}
                                            callback={(name: string) => {
                                                setAuthInformation({
                                                    ...authInformation,
                                                    name
                                                })
                                            }}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm uppercase text-slate-500">Email</p>
                                        <InputField
                                            placeholder='Email'
                                            type="email"
                                            noArrow={true}
                                            callback={(email: string) => {
                                                setAuthInformation({
                                                    ...authInformation,
                                                    email
                                                })
                                            }}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm uppercase text-slate-500">Password</p>
                                        <InputField
                                            type="password"
                                            placeholder='Password'
                                            noArrow={true}
                                            callback={(password: string) => {
                                                setAuthInformation({
                                                    ...authInformation,
                                                    password
                                                })
                                            }}
                                            enterCallback={() => signIn()}
                                        />
                                    </div>
                                </div>

                                {/* Style This! */}
                                {
                                    authSuccess == "login_failure" ? (
                                            <div className="flex flex-row gap-4 items-center rounded-2xl rounded-r-lg">
                                                <div className="flex items-center justify-center bg-red-100 rounded-full h-8 w-8">
                                                    <p className="text-red-500 font-bold font-altSans">!</p>
                                                </div>

                                                <p className="text-red-500 font-base font-sans text-sm">
                                                    { authFailure }
                                                </p>
                                            </div>
                                    ) : <></>
                                }

                                <div className="flex flex-row justify-between">
                                    <Button
                                        className=" bg-blue-600 text-slate-50 w-fit font-semibold text-sm"
                                        loaderOnly={awaitingReply}
                                        icon={authSuccess == "logged_in" ? <Check size={16}/> : <ArrowRight size={16} />}
                                        onClick={() => signIn()}
                                        >
                                        {
                                        awaitingReply ?
                                            "Signing up..."
                                        :
                                            authSuccess == "logged_in" ?
                                            "Success"
                                            :
                                            authSuccess == "login_failure" ?
                                            "Signup" // "Failed"
                                            :
                                            "Signup"
                                    }
                                    </Button>
                                    <div className="flex flex-row items-center text-sm text-slate-700">
                                        Have an account?<Button icon={false} className="bg-transparent text-blue-500 w-fit font-semibold text-sm" onClick={() => {
                                            router.replace('./login')
                                        }}>Login</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getSession(context);

    if (session) {
        return { redirect: { permanent: false, destination: "/print" } };
    }

    const csrfToken = await getCsrfToken({ req: context.req });
    const providers = filter(await getProviders(), (provider) => {
        return provider.type !== "credentials";
    });

    return {
        props: { csrfToken, providers },
    };
}