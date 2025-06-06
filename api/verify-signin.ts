import { verifySignInMessage } from '@farcaster/auth-kit';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { message, signature } = req.body;

    if (!message || !signature) {
        res.status(400).json({ error: 'Missing message or signature' });
        return;
    }

    try {
        // This will throw if invalid
        const result = await verifySignInMessage(message, signature);

        // result contains { fid, ... }
        res.status(200).json({ fid: result.fid });
    } catch (e) {
        res.status(401).json({ error: 'Invalid signature' });
    }
}
