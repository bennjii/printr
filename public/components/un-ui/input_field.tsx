import { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import styles from './UnUI.module.css'

import { ArrowRight, Check, CornerDownLeft, Eye, EyeOff, Heart, Key, Loader, RefreshCw, Repeat, Triangle } from 'react-feather'

interface Props { callback: Function, children?: React.ReactNode, enterCallback?: Function, noArrow: boolean, customValue?: React.ReactNode };
declare type NativeAttrs = Omit<React.InputHTMLAttributes<any>, keyof Props>;

const InputField: React.FC<Props & NativeAttrs> = ({ children, callback, enterCallback, noArrow, customValue, ...args }) => {
    const input_ref = useRef<HTMLInputElement>(null);
    const [ value, setValue ] = useState("");

    const [ isPasswordField, setIsPasswordField ] = useState(args["type"] == "password");
    const [ showPass, setShowPass ] = useState(false);

    return (
            <div 
                className={styles.inputField + " flex flex-row"}
             >
                {
                    noArrow && customValue ?
                    customValue
                    :
                    <>
                        <input
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if(e.key == "Enter") {
                                    if(enterCallback) enterCallback(value);
                                }
                            }}
                            className="flex flex-1 outline-none"
                            onChange={() => {
                                callback(input_ref.current!.value);
                                setValue(input_ref.current!.value);
                            }}
                            ref={input_ref}
                            {...args}
                            type={isPasswordField && showPass ? "text" : args.type}>
                            {
                                children ?? children
                            }
                        </input>

                        {
                            !noArrow ? 
                                value == "" ? 
                                    <ArrowRight height={16} color={"#b4b4b4"} />
                                :
                                    <ArrowRight height={16} color={"#252525"} onClick={() => {
                                        if(enterCallback) enterCallback(value);
                                    }}/>
                            :
                            <></>
                        }

                        {
                            isPasswordField ?
                                !showPass ?
                                <Eye onClick={() => { setShowPass(!showPass) }} size={18} opacity={0.8} />
                                :
                                <EyeOff onClick={() => { setShowPass(!showPass) }} size={18} opacity={0.8} />
                            :
                            <></>
                        }
                    </>
                }
            </div>
        )  
}

export default InputField;