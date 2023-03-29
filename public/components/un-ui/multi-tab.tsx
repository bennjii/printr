import { cloneElement, useEffect, useRef, useState } from "react";
import styles from './UnUI.module.css'

import { ArrowRight } from 'react-feather'
import Tab from "./tab";

interface Props { tabs: {title: string, desc: string, data: any}[] };
declare type NativeAttrs = Omit<React.ButtonHTMLAttributes<any>, keyof Props>;

const MultiTab: React.FC<Props & NativeAttrs> = ({ tabs, ...args }) => {
    const [ current, setCurrent ] = useState(0);

    useEffect(() => {
        console.log(tabs);

        const timeout = setTimeout(() => {
            setCurrent((current + 1) % 3)
        }, 10000);

        return () => {
            clearTimeout(timeout);
        }
    }, [current, tabs])

    return (
        <div className={styles.multitab}>
            <div>
            {
                tabs.map((tab, index) => {
                    return (
                        <Tab key={`MULTITAB-${index}`} title={tab.title} active={index === current}>{tab.desc}</Tab>
                    )
                })
            }
            </div>

            <div>
                {
                    tabs[current].data
                }
            </div>
        </div>
    )
}

export default MultiTab;