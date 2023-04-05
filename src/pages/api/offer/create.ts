import prisma from "@lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return;

    const { user_id, job_id, offer_value, printer_id } = JSON.parse(req.body);
    console.log({ user_id, job_id, offer_value, printer_id }, req.body, JSON.parse(req.body));

    const bid = await prisma.bid.create({ 
        data: {
            bidder_id: user_id,
            price: offer_value,
            job_id,
            printer_id: printer_id
        }
    });

    const printer = await prisma.printer.update({ 
        where: {
            id: printer_id
        },
        data: {
            current_status: 'UNAVALIABLE'
        }
    })

    // const bidMetadata = await prisma.bidMetadata.create({ 
    //     data: {
    //         bid_id: bid.id,
    //         bidder_id: user_id,
    //         job_id: job_id
    //     }
    // })

    res.status(200).json({ 
        bid, printer
    })
}

export default handler;