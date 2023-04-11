import { hashPassword } from "@lib/crpyt";
import prisma from "@lib/prisma";

import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return;

    const { email, password, name, request_constructor } = req.body;

    if (
        !email ||
        !email.includes('@'))
        {
        res.status(422).json({
            message: 'Email should be properly formatted',
        });
        return;
    }
        
    if(
        !password ||
        password.trim().length < 7
    ) {
        res.status(422).json({
        message:
            'Password should also be at least 7 characters long.',
        });
        return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if(existingUser) {
        res.status(422).json({ message: 'User already exists!' });
        return;
    }

    // Hash password, and do same on signup end for identical comparison.
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            email,
            name,

            hash: hashedPassword,
            is_constructor: request_constructor,
            location: "TBD"
        }
    });

    res.status(201).json({ message: 'User Created Successfully', uid: user.id });
}

export default handler;