import prisma from "@lib/prisma";
import { Job, Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return;

    const {
        name, location, printers, user_id
    } = JSON.parse(req.body);

    const constructor = await prisma.constructor.create({
        data: {
            name: name,
            location: location,
            owner_id: user_id
        }
    });

    printers.map((p: {name: string, model: string}) => {
        prisma.printer.create({
            data: {
                name: p.name,
                model: p.model
            }
        })
    })

    res.status(200).json({ 
        constructor
    })
}

export default handler;