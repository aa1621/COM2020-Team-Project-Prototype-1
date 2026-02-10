import { supabaseUser } from "../lib/supabaseClient.js";
import { safeParseJson } from "../services/challengeRules.service.js";

export async function listChallenges(req, res, next) {
    try {
        const type = req.query.type;

        let q = supabaseUser
            .from("challenges")
            .select("challenge_id, title, challenge_type, rules, scoring, start_date, end_date")
            .order("state_date", {ascending: false});

        if (type) {
            q = q.eq("challenge_type", type);
        }

        const {data, error} = await q;

        if (error) return next(error);

        const payload = (data ?? []).map(c => ({
            ...c,
            rules: safeParseJson(c.rules, {}),
            scoring: safeParseJson(c.scoring, {}),
        }));

        res.json({challenges: payload});
    } catch (err) {
        next(err);
    }
}

export async function getChallenge(req, res, next) {
    try {
        const {challengeId} = req.params;

        const {data, error} = await supabaseUser
            .from("challenges")
            .select("challenge_id, title, challenge_type, rules, scoring, start_date, end_date")
            .eq("challenge_id", challengeId)
            .single();

        if (error) return next(error);
        if(!data) return res.status(404).json({error: "Challenge not found"});

        res.json({
            challenge: {
                ...data,
                rules: safeParseJson(data.rules, {}),
                scoring: safeParseJson(data.scoring, {}),
            },
        });
    } catch (err) {
        next(err);
    }
}

export async function listChallengeSubmissions(req, res, next) {
    try {
        const {challengeId} = req.params;

        const limit = Math.min(Number(req.query.limit ?? 50), 200);
        const status = req.query.status;

        let q = supabaseUser
            .from("submissions")
            .select("submission_id, challenge_id, user_id, group_id, points, status")
            .eq("challenge_id", challengeId)
            .order("points", {ascending: false})
            .limit(limit);

        if (status) q = q.eq("status", status);

        const {data, error} = await q;
        if (error) return next(error);

        res.json({submissions: data ?? []});
    } catch (err) {
        next(err);
    }
}

export async function listUserSubmissions(req, res, next) {
    try {
        const {userId} = req.params;

        const limit = Math.min(Number(req.query.limit ?? 50), 200);

        const {data, error} = await supabaseUser
            .from("submissions")
            .select("submission_id, challenge_id, user_id, group_id, points, status")
            .eq("user_id", userId)
            .order("points", {ascending: false})
            .limit(limit);
        
        if (error) return next(error);

        res.json({submissions: data ?? []});
    } catch (err) {
        next(err);
    }
}
