import { verifyPassword } from "@lib/crpyt";
import prisma from "@lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return;

    const { email, password } = typeof req.body == "string" ? JSON.parse(req.body) : req.body;

    if (
        !email ||
        !email.includes('@') ||
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

    if(!existingUser) {
        res.status(404).json({
            message: "User does not exist."
        })
        return;
    }

    // Hash password, and do same on signup end for identical comparison.
    const truePass = await verifyPassword(password, existingUser.hash);

    if(!truePass) {
        res.status(422).json({
            message:
                'Invalid username or password.',
            }
        );
    }else {
        await prisma.user.delete({
            where: {
                id: existingUser.id
            }
        });

        res.status(201).json({ message: 'User Deleted Successfully' });
    }
}

export default handler;