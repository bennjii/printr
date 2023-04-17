import prisma from "@lib/prisma";
import { Job, Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return;

    const {
        bid_id,
    } = JSON.parse(req.body);

    const bid = await prisma.bid.findUnique({
        where: {
            id: bid_id
        },
        include: {
            printer: true
        }
    });

    const job = await prisma.job.update({
        where: {
            id: bid?.job_id
        },
        data: {
            current_status: "PREPRINT",
            printer_id: bid?.printer_id,
            constructor_id: bid?.printer.constructor_id
        },
        include: {
            constructor: true,
            submitter: true,
            Bids: {
                include: {
                    bidder: true
                }
            }
        }
    });

    if(!job) {
        res.status(401).json({ 
            job
        })

        return;
    }

    const bids = await prisma.bid.findMany({
        where: {
            job_id: bid?.job_id
        }
    })

    await bids.forEach(async bi => {
        return await prisma.bid.delete({
            where: {
                id: bi.id
            }
        }).then(async b => {
            await prisma.printer.update({
                where: {
                    id: bi.printer_id
                },
                data: {
                    current_status: "IDLE"
                }
            })
        })
    });

    console.log("Printing: ", job.printer_id);

    const update = await prisma.printer.update({
        where: {
            id: job.printer_id ?? ""
        },
        data: {
            current_status: "PRINTING"
        }
    });

    console.log("Updating, ", update);

    res.status(200).json({ 
        job
    })
}

export default handler;