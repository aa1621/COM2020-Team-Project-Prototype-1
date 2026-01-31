import { supabaseUser } from "../lib/supabaseClient.js";
import { safeParseJson } from "../services/challengeRules.service.js";
import { calculatePoints } from "../services/scoring.service.js";

export async function createSubmission(req, res, next) {
    try {
        const { challengeId } = req.params;

        const bodyUserId = req.body?.userId;
        const demoUserId = req.header("x-user-id") || bodyUserId;
        if (!demoUserId) {
            return res.status(400).json({
                error: 'Missing user id. For now pass header "x-user-id" (or body user_id).',
            });
        }

        const groupId = req.body?.groupId ?? null;

        const totalCO2eFromBody = req.body?.total_co2e;
        const logIds = Array.isArray(req.body?.log_ids) ? req.body.log_ids : null;

        if ((totalCO2eFromBody == null || Number.isNaN(Number(totalCO2eFromBody))) && ! logIds) {
            return res.status(400).json({
                error: "Provide either total_co2e (number) or log_ids (array of uuids).",
            });
        }
        
        const { data: challenge, error: chError} = await supabaseUser
            .from("challenges")
            .select("challenge_id, title, rules, scoring, start_date, end_date")
            .eq("challenge_id", challengeId)
            .single();

        if (chError) return next(chError);
        if (!challenge) return res.status(404).json({error: "Challenge not found"});

        const today = new Date().toISOString().slice(0, 10);
        if (challenge.start_date && today < challenge.start_date) {
            return res.status(400).json({error: "Challenge has not started yet"});
        }
        if (challenge.end_date && today > challenge.end_date) {
            return res.status(400).json({error: "Challenge has ended"});
        }

        const rulesObj = safeParseJson(challenge.rules, {});
        const scoringObj = safeParseJson(challenge.scoring, {points_per_kg: 10});

        const evidenceRequired = rulesObj?.evidence_required === true;

        let totalCO2eKg = 0;

        if (logIds) {
            const {data: logs, error: logsErr} = await supabaseUser
                .from("action_logs")
                .select("log_id, user_id, calculated_co2e")
                .in("log_id", logIds);
            
            if (logsErr) return next(logsErr);

            const foreign = (logs ?? []).find(l => l.user_id !== demoUserId);
            if (foreign) {
                return res.status(403).json({error: "One or more logs do not belong to this user"});
            }

            totalCO2eKg = (logs ?? []).reduce((sum, l) => sum + Number(l.calculated_co2e || 0), 0);
        } else {
            totalCO2eKg = Number(totalCO2eFromBody);
        }

        if (!(totalCO2eKg > 0)) {
            return res.status(400).json({error: "total_co2e must be a positive number"});
        }

        const points = calculatePoints(totalCO2eKg, scoringObj);
        const status = evidenceRequired ? "pending_review" : "approved";

        const insertRow = {
            challenge_id: challenge.challenge_id,
            user_id: demoUserId,
            group_id: groupId,
            points,
            status,
        };

        const {data: inserted, error: insErr} = await supabaseUser
            .from("submissions")
            .insert(insertRow)
            .select("*")
            .single();

        if (insErr) return next(insErr);

        return res.status(201).json({
            submission: inserted,
            computed: {
                totalCO2eKg,
                evidenceRequired,
                scoring: scoringObj,
            },
            challenge: {
                challenge_id: challenge.challenge_id,
                title: challenge.title,
            },
        });
    } catch (err) {
        next(err);
    }
}