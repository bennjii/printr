import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@lib/prisma'

// GET /api/user/[id]
// Required fields in body: name, email
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const bidId = req.query.id?.toString();

    console.log("Found Request");
    const t = new Date().getTime();

    if(String(bidId)) {
        const result = await prisma.bid.findUnique({
            where: {
                id: String(bidId)
            },
            include: {
                printer: true
            }
        });

        console.log("Finished Request in ", new Date().getTime() - t, "ms ");

        res.json(result);
    }else {
        res.json({});
    }
}