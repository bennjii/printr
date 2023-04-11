import { createRef, useEffect, useRef, useState } from 'react';
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
        name: "",
        request_constructor: false
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
                setAuthFailure(data?.message ?? "Authentication Failure");
                // throw new Error(data.message || 'Something went wrong!');
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

    const [ showConstructorViewer, setShowConstructorViewer ] = useState(false);
    const [ cState, setCState ] = useState<0 | 1 | 2>(0);

    const printer_name_ref = createRef<HTMLInputElement>();
    const printer_model_ref = createRef<HTMLInputElement>();

    const constructor_address_ref = createRef<HTMLInputElement>();
    const constructor_name_ref = createRef<HTMLInputElement>();

    const [ nameVal, setNameVal ] = useState("");
    const [ modelVal, setModelVal ] = useState(""); 

    const [ printerList, setPrinterList ] = useState<{
        name: string,
        model: string,
        id: string
    }[]>([]);

    const constructor = () => {
        setShowConstructorViewer(true)
    }

    return (
            <div className="flex-col flex font-sans min-h-screen" > {/* style={{ background: 'linear-gradient(-45deg, rgba(99,85,164,0.2) 0%, rgba(232,154,62,.2) 100%)' }} */}
                {
                    showConstructorViewer ?
                    <div className="fixed h-full w-full bg-white z-40 flex flex-col p-32">
                        <div className={`flex fixed left-10 top-10 flex-row items-center gap-2 px-2 py-1 rounded-md cursor-pointer text-gray-600`}
                            onClick={() => {
                                setShowConstructorViewer(false);
                                setCState(0)
                            }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 12H4M4 12L10 18M4 12L10 6" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>

                            <p className="select-none">Exit</p>
                        </div>

                        <div className="flex flex-row items-center justify-between">
                            <p className="text-2xl font-bold">Become a constructor</p>

                            <div className="flex flex-row items-center gap-4">
                                <p className={`${cState == 0 ? "bg-blue-600 text-white" : "bg-gray-200"} rounded-full p-4 w-10 h-10 flex items-center justify-center font-semibold`}>1</p>
                                <p className={`${cState == 1 ? "bg-blue-600 text-white" : "bg-gray-200"} rounded-full p-4 w-10 h-10 flex items-center justify-center font-semibold`}>2</p>
                                {/* <p className={`${cState == 2 ? "bg-blue-600 text-white" : "bg-gray-200"} rounded-full p-4 w-10 h-10 flex items-center justify-center font-semibold`}>3</p> */}
                            </div>
                        </div>

                        <div className="flex flex-1">
                            {(() => {
                                switch (cState) {
                                    case 0:
                                        return (
                                            <div className="flex flex-col w-full flex-1 gap-4 pb-8">
                                                <p className="text-gray-400">What printers do you have?</p>

                                                <div className="flex flex-col flex-1 bg-gray-100 rounded-md p-4 gap-2">
                                                    {
                                                        printerList.map(p => {
                                                            return (
                                                                <div className='flex flex-row gap-2 justify-between bg-white items-center px-4 py-2 rounded-md'>
                                                                    <div className='flex flex-row gap-2'>
                                                                        <p>{p.name}</p>
                                                                        <p className="text-gray-600">{p.model}</p>
                                                                    </div>

                                                                    <svg 
                                                                        onClick={() => {
                                                                            setPrinterList([ ...printerList.filter(b => b.id != p.id) ])
                                                                        }}
                                                                        className='cursor-pointer' width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M11.7071 1.70711C12.0976 1.31658 12.0976 0.683417 11.7071 0.292893C11.3166 -0.0976311 10.6834 -0.0976311 10.2929 0.292893L6 4.58579L1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L4.58579 6L0.292893 10.2929C-0.0976311 10.6834 -0.0976311 11.3166 0.292893 11.7071C0.683417 12.0976 1.31658 12.0976 1.70711 11.7071L6 7.41421L10.2929 11.7071C10.6834 12.0976 11.3166 12.0976 11.7071 11.7071C12.0976 11.3166 12.0976 10.6834 11.7071 10.2929L7.41421 6L11.7071 1.70711Z" fill="black"/>
                                                                    </svg>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>

                                                <div className="flex flex-col bg-gray-100 rounded-md p-4 gap-2">
                                                    <div className="flex flex-row gap-2 flex-1">
                                                        <div className="flex flex-col flex-1">
                                                            <p className="text-sm font-semibold text-gray-600">PRINTER NAME/IDENTIFIER</p>
                                                            <input 
                                                                onInput={(e) => setNameVal(e.currentTarget.value)}
                                                                ref={printer_name_ref} placeholder="Printer Name/Identifier" className="px-4 py-2 rounded-md w-full" onChange={(e) => {
                                                            }}></input>
                                                        </div>
                                                        
                                                        <div className="flex flex-col flex-1">
                                                            <p className="text-sm font-semibold text-gray-600">PRINTER MODEL</p>
                                                            <input 
                                                                onInput={(e) => setModelVal(e.currentTarget.value)}
                                                                ref={printer_model_ref} placeholder="Printer Model" className="px-4 py-2 rounded-md w-full" onChange={(e) => {
                                                            }}></input>
                                                        </div>
                                                    </div>

                                                    <div className="py-2"></div>

                                                    <div className="flex flex-row justify-between">
                                                        <div></div>
                                                        <div className={`flex flex-row items-center gap-2 bg-gray-200 px-2 py-1 rounded-md cursor-pointer w-fit ${
                                                            ((modelVal != "") && (nameVal != ""))
                                                                ? "" : "opacity-20"
                                                            }`}
                                                            onClick={() => {
                                                                setPrinterList([...printerList, {
                                                                    model: modelVal,
                                                                    name: nameVal,
                                                                    id: (Math.random() * 10_000).toString()
                                                                }]);

                                                                setModelVal("")
                                                                if(printer_model_ref.current) printer_model_ref.current.value = "";
                                                                setNameVal("")
                                                                if(printer_name_ref.current) printer_name_ref.current.value = "";
                                                            }}
                                                            >
                                                            <p className="select-none">Add Printer</p>

                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke={`${"black"}`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    case 1:
                                        return (
                                            <div className="flex flex-col w-full flex-1 gap-4 pb-8">
                                                <p className="text-gray-400">Where are you located?</p>

                                                <div className='bg-gray-100 p-4 rounded-md'>
                                                    <input 
                                                        onInput={(e) => setNameVal(e.currentTarget.value)}
                                                        ref={constructor_address_ref} placeholder="Street Address" className="px-4 py-2 rounded-md w-full" onChange={(e) => {
                                                    }}></input>
                                                </div>

                                                <br />
                                                
                                                <p className="text-gray-400">What would you like to be called?</p>

                                                <div className='bg-gray-100 p-4 rounded-md'>
                                                    <input 
                                                        onInput={(e) => setNameVal(e.currentTarget.value)}
                                                        ref={constructor_name_ref} placeholder="Name" className="px-4 py-2 rounded-md w-full" onChange={(e) => {
                                                    }}></input>
                                                </div>

                                            </div>
                                        )
                                    case 2:
                                        return (
                                            <div className='flex flex-1 items-center justify-center text-gray-400'>Creating Constructor...</div>
                                        )
                                }
                            })()}
                        </div>

                        <div className="flex flex-row items-center justify-between">
                            <div className={`flex flex-row items-center gap-2 bg-gray-200 px-2 py-1 rounded-md ${cState == 0 || cState == 2 ? "opacity-20" : "cursor-pointer"}`}
                                onClick={() => { if(!(cState == 0 || cState == 2)) setCState(cState-1 as 0 | 1 | 2) }}
                                >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 12H4M4 12L10 18M4 12L10 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>

                                <p className="select-none">Back</p>
                            </div>

                            <div 
                                className={`flex flex-row items-center gap-2 cursor-pointer bg-gray-200 px-2 py-1 rounded-md ${cState == 2 ? "opacity-20" : "cursor-pointer"}`}
                                onClick={async () => { 
                                    if(cState < 2) {
                                        if(cState == 1) {
                                            const response = await fetch('/api/auth/signup', {
                                                method: 'POST',
                                                body: JSON.stringify({ ...authInformation }),
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                            });
                                
                                            const data = await response.json();

                                            fetch(`/api/constructor/create`, {
                                                method: "POST",
                                                body: JSON.stringify({
                                                    name: constructor_name_ref.current?.value,
                                                    location: constructor_address_ref.current?.value,
                                                    printers: printerList,
                                                    user_id: data.uid
                                                })
                                            }).then(b => {
                                                router.push('/constructor')
                                            })
                                        }

                                        setCState(cState+1 as 0 | 1 | 2)
                                    } 
                                }}
                            >
                                <p className="select-none">{cState == 0 ? "Continue" : "Create"}</p>

                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke={`${"black"}`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
                }
                
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

                                <div onClick={() => {setAuthInformation({ ...authInformation, request_constructor: !authInformation.request_constructor })}} className="flex flex-col gap-2">
                                    <p className="text-xs text-gray-600 font-semibold">BE A CONSTRUCTOR</p>
                                    <div className="flex flex-row items-center gap-2 cursor-pointer">
                                        {
                                            authInformation.request_constructor  ?
                                                <div className="flex h-4 w-4 rounded-md border-2 border-gray-700 bg-gray-700" ></div>
                                            :
                                                <div className="flex h-4 w-4 rounded-md border-2 border-gray-700"></div>
                                        }

                                        <p className="font-semibold text-sm text-gray-900 select-none">Yes, I would like to be a constructor</p>
                                    </div>
                                </div>

                                <div className="flex flex-row justify-between">
                                    <Button
                                        className=" bg-blue-600 text-slate-50 w-fit font-semibold text-sm"
                                        loaderOnly={awaitingReply}
                                        icon={authSuccess == "logged_in" ? <Check size={16}/> : <ArrowRight size={16} />}
                                        onClick={() => {
                                            if(authInformation.request_constructor)  constructor()
                                            else signIn()
                                        }}>
                                        {
                                        authInformation.request_constructor ?
                                        "Continue"
                                        :
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
        return { redirect: { permanent: false, destination: "/" } };
    }

    const csrfToken = await getCsrfToken({ req: context.req });
    const providers = filter(await getProviders(), (provider) => {
        return provider.type !== "credentials";
    });

    return {
        props: { csrfToken, providers },
    };
}