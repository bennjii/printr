import prisma from "@lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return;

    const { user_id, job_id, offer_value, printer_id, bid_id } = JSON.parse(req.body);
    console.log({ user_id, job_id, offer_value, printer_id }, req.body, JSON.parse(req.body)); 
    
    // Get old printer id
    const get_bid = await prisma.bid.findUnique({ 
        where: {
            id: bid_id
        },
    });

    // Set the old printer to idle
    const set_printer_idle = await prisma.printer.update({ 
        where: {
            id: get_bid?.printer_id
        },
        data: {
            current_status: 'IDLE'
        }
    })

    // Update Bid
    const bid = await prisma.bid.update({ 
        where: {
            id: bid_id
        },
        data: {
            printer_id: printer_id,
            price: offer_value,
        }
    });

    // Set new printer to active
    const printer = await prisma.printer.update({ 
        where: {
            id: printer_id
        },
        data: {
            current_status: 'UNAVALIABLE'
        }
    })

    res.status(200).json({ 
        bid, printer
    })
}

export default handler;