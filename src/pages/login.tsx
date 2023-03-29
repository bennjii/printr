import { useEffect, useRef, useState } from 'react';
import { motion } from "framer-motion";
import { cardVariants, subTitleControl } from '@components/framer_constants';

import { getSession, getCsrfToken, signIn as signInAuth, getProviders, useSession } from "next-auth/react";
import { GetServerSidePropsContext } from 'next';

import InputField from '@components/un-ui/input_field';
import Button from '@components/un-ui/button';

import { ArrowRight, Check, GitHub  } from 'react-feather';
import { useRouter } from 'next/router';
import { filter } from "lodash";

export default function Home({ providers }) {
    const [ authInformation, setAuthInformation ] = useState({
        email: "",
        password: ""
    });

    const router = useRouter();

    const [ awaitingReply, setAwaitingReply ] = useState(false);
    const [ authFailure, setAuthFailure ] = useState("");
    const [ authSuccess, setAuthSuccess ] = useState<"logged_out" | "logged_in" | "login_failure">("logged_out");

    const signIn = async (provider?) => {
        setAwaitingReply(true);

        if(provider)
            signInAuth(provider).then(e => {
                alert(e);
            });
        else {
            const { ok, error } = await signInAuth("credentials", {
                email: authInformation.email,
                password: authInformation.password,
                redirect: false,
            });

            setAwaitingReply(false);

            if(error) {
                console.log(error);
                setAuthSuccess("login_failure");
                setAuthFailure("Account does not exist, try signing up!");
            }else {
                setAuthSuccess("logged_in");
                setAuthFailure("");
            }
        }
    }

    return (
            <div className="flex-col flex font-sans min-h-screen" > {/* style={{ background: 'linear-gradient(-45deg, rgba(99,85,164,0.2) 0%, rgba(232,154,62,.2) 100%)' }} */}
                <div className="flex-col flex font-sans min-h-screen w-screen relative overflow-hidden">
                    <div id="gradient-canvas" className="md:top-0 w-full z-10 absolute h-screen  bg-blue-400" style={{ width: '200%', height: '200%', zIndex: 0 }} data-transition-in></div>

                    <div className="flex-row flex-1 w-screen h-full grid sm:grid-cols-3">
                        <div className="w-full bg-white z-20 flex justify-center items-center flex-col sm:px-72 max-h-screen">
                            <div className="flex flex-col flex-1 gap-8 justify-center">
                                <motion.div initial="offscreen" whileInView="onscreen" viewport={{ once: true }} variants={subTitleControl}>
                                    <a className="font-bold font-altSans text-lg text-slate-400 hover:cursor-pointer" href="../">printr</a>
                                    <motion.h1 variants={cardVariants} className="m-0 font-bold text-2xl md:text-3xl">Login</motion.h1>
                                    <motion.p  variants={cardVariants} className="text-slate-600 text-base">Lets get back to printing!</motion.p>
                                </motion.div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm uppercase text-slate-500">Email</p>
                                        <InputField
                                            placeholder='Email'
                                            type="email"
                                            noArrow={true}
                                            callback={(email) => {
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
                                            callback={(password) => {
                                            setAuthInformation({
                                                ...authInformation,
                                                password
                                            })
                                        }}
                                            enterCallback={() => signIn()}
                                        />
                                    </div>
                                </div>

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
                                            "Loading"
                                        :
                                            authSuccess == "logged_in" ?
                                            "Success"
                                            :
                                            authSuccess == "login_failure" ?
                                            "Login" // "Failed"
                                            :
                                            "Login"
                                    }
                                    </Button>
                                    <div className="flex flex-row items-center text-sm text-slate-700">
                                        No Account?<Button icon={false} className="bg-transparent text-blue-500 w-fit font-semibold text-sm" onClick={() => {
                                            router.replace('./signup')
                                        }}> Sign Up</Button>
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
    const redirect_url = "/print"

    if (session) {
        return { redirect: { permanent: false, destination: redirect_url } };
    }

    const csrfToken = await getCsrfToken({ req: context.req });
    const providers = filter(await getProviders(), (provider) => {
        return provider.type !== "credentials";
    });

    return {
        props: { csrfToken: csrfToken ? csrfToken : null, providers },
    };
}