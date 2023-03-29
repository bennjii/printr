import { useEffect, useRef, useState } from "react";
import styles from './UnUI.module.css'

import { ArrowRight } from 'react-feather'
import Button from "./button";

interface Props { title?: string, active: boolean, children?: React.ReactNode };
declare type NativeAttrs = Omit<React.ButtonHTMLAttributes<any>, keyof Props>;

const Tab: React.FC<Props & NativeAttrs> = ({ title, active, children, ...args }) => {
    
    return (
        <div className={`${styles.tab} ${active ? styles.tabActive : styles.tabIdle}`}>
            <h3>{ title }</h3>
            <p>{ children ?? children }</p>
            <Button inline>Learn more</Button>
        </div>
    )
}

export default Tab;