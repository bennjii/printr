import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@lib/prisma'

// GET /api/user/[id]
// Required fields in body: name, email
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const userId = req.query.id?.toString();

    console.log("Found Request");
    const t = new Date().getTime();

    const result = await prisma.job.findMany({
        include: {
            constructor: true,
            submitter: true,
            Bids: true
        }
    });

    console.log("Finished Request in ", new Date().getTime() - t, "ms ");

    res.json(result);
}