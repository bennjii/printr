import prisma from "@lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return;

    const { user_id, job_id, offer_value } = JSON.parse(req.body);
    console.log({ user_id, job_id, offer_value }, req.body, JSON.parse(req.body));

    const bid = await prisma.bid.create({ 
        data: {
            bidder: user_id,
            price: offer_value,
        }
    });

    const bidMetadata = await prisma.bidMetadata.create({ 
        data: {
            bid_id: bid.id,
            bidder_id: user_id,
            job_id: job_id
        }
    })

    res.status(200).json({ 
        bid, bidMetadata
    })
}

export default handler;