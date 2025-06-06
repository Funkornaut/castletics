import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
    // Generate a secure random nonce (at least 8 alphanumeric chars)
    const nonce = [...Array(16)].map(() => Math.random().toString(36)[2]).join('');
    res.status(200).json({ nonce });
}
