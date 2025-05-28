// In-memory store: { [fid]: { lastWorkout: string, streak: number } }
const streaks = {};

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { fid } = req.query;
        if (!fid) {
            res.status(400).json({ error: 'Missing fid' });
            return;
        }
        res.status(200).json(streaks[fid] || { streak: 0, lastWorkout: null });
    }

    if (req.method === 'POST') {
        const { fid } = req.body;
        if (!fid) {
            res.status(400).json({ error: 'Missing fid' });
            return;
        }

        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const user = streaks[fid] || { streak: 0, lastWorkout: null };

        if (user.lastWorkout === today) {
            // Already logged today
            res.status(200).json(user);
            return;
        }

        // Check if yesterday was last workout
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const newStreak = user.lastWorkout === yesterday ? user.streak + 1 : 1;

        streaks[fid] = { streak: newStreak, lastWorkout: today };
        res.status(200).json(streaks[fid]);
    }
}
