import prisma from "@lib/prisma";
import { Job, Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return;

    const {
        job_id,
        photo_url
    } = JSON.parse(req.body);

    const pref = await prisma.job.findUnique({
        where: {
            id: job_id
        }
    });

    console.log(pref?.job_preferences);

    //@ts-ignore
    if(pref?.job_preferences?.DANGEROUS_PREFERS_NO_CHECKS!) {
        const job = await prisma.job.update({
            where: {
                id: job_id
            },
            data: {
                //@ts-ignore
                current_status: pref?.job_preferences?.delivery?.method == "Pickup" ? "READYFORPICKUP" : "ENROUTE",
                evidence: photo_url
            }
        });

        res.status(200).json({ job })
    }else {
        const job = await prisma.job.update({
            where: {
                id: job_id
            },
            data: {
                current_status: "REVIEW",
                evidence: photo_url
            }
        });

        res.status(200).json({ job })
    }
}

export default handler;