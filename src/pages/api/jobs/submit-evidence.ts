import prisma from "@lib/prisma";
import { Job, Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return;

    const {
        job_id,
    } = JSON.parse(req.body);

    const pref = await prisma.job.findUnique({
        where: {
            id: job_id
        }
    });

    if(JSON.parse(pref?.job_preferences?.toString() ?? "{}").DANGEROUS_PREFERS_NO_CHECKS) {
        const job = await prisma.job.update({
            where: {
                id: job_id
            },
            data: {
                current_status: "ENROUTE"
            }
        });

        res.status(200).json({ job })
    }else {
        const job = await prisma.job.update({
            where: {
                id: job_id
            },
            data: {
                current_status: "REVIEW"
            }
        });
    }

}

export default handler;