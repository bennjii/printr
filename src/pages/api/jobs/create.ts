import prisma from "@lib/prisma";
import { Job, Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return;

    const {
        current_status,
        status_history,

        estimated_completion,

        file_url,
        file_name,
        job_name,

        job_preferences,
        submitter_id,
    }: Job = JSON.parse(req.body);

    const job = await prisma.job.create({ 
        data: {
            current_status,
            status_history: status_history as Prisma.InputJsonValue,
            estimated_completion,
            file_url,
            file_name,
            job_name,
            job_preferences: job_preferences as Prisma.InputJsonValue,
            submitter: {
                connect: {
                    id: submitter_id
                }
            }
        }
    });

    res.status(200).json({ 
        job
    })
}

export default handler;