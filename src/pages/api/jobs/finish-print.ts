import prisma from "@lib/prisma";
import { Job, Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return;

    const {
        job_id,
        notes
    } = JSON.parse(req.body);

    const job = await prisma.job.update({
        where: {
            id: job_id
        },
        data: {
            current_status: "PREDELIVERY",
            notes: notes ?? ""
        }
    });

    const printer = await prisma.printer.update({
        where: {
            id: job.printer_id ?? ""
        },
        data: {
            current_status: "IDLE"
        }
    });

    res.status(200).json({ 
        job, printer
    })
}

export default handler;