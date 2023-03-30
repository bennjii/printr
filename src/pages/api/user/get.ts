import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'public/lib/prisma'

export default async function handle(
        req: NextApiRequest,
        res: NextApiResponse,
) {
  const result = await prisma.user.findMany({
  });
  return res.status(201).json(result)
}