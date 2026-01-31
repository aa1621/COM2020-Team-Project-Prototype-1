import { supabaseAdmin } from "../lib/supabaseClient.js";

// TEMPORARY GUARD (because we haven't set up authorisation yet)
function requireModerator(req, res) {
    const role = req.header("x-user-role");
    if (role !== "moderator" && role !== "maintainer") {
        res.status(403).json({error: 'Forbidden. Set header "x-user-role: moderator" for dev.'});
        return false;
    }
    return true;
}

export async function getModerationQueue(req, res, next) {
    try {
        if(!requireModerator(req, res)) return;

        const status = req.query.status || "pending_review";
        const limit = Math.min(Number(req.query.limit ?? 50), 200);

        const {data, error} = await supabaseAdmin
            .from("submissions")
            .select("submission_id, challenge_id, user_id, group_id, points, status")
            .eq("status", status)
            .order("points", {ascending: false})
            .limit(limit);

        if (error) return next(error);

        res.json({submissions: data ?? []});
    } catch (err) {
        next(err);
    }
}

export async function decideSubmission(req, res, next) {
    try {
        if (!requireModerator(req, res)) return;

        const {submissionId} = req.params;
        const decision = req.body?.decision;

        if (!decision || !["approve", "reject"].includes(decision)) {
            return res.status(400).json({error: 'decision must be "approve" or "reject"'});
        }

        const newStatus = decision === "approve" ? "approved" : "rejected";

        const {data: existing, error: getErr} = await supabaseAdmin
            .from("submissions")
            .select("submission_id, status")
            .eq("submission_id", submissionId)
            .single();

        if (getErr) return next(getErr);
        if (!existing) return res.status(404).json({error: "Submission not found"});

        // Only allow decisions to be made on submissions that are pending review (We can easily comment this out if need be)
        if(existing.status !== "pending_review") {
            return res.status(400).json({error: `Cannot decide submissions with status "${existing.status}". Expected "pending_review`,});
        }

        const {data: updated, error: updErr} = await supabaseAdmin
            .from("submissions")
            .update({status: newStatus})
            .eq("submission_id", submissionId)
            .select("*")
            .single();

        if (updErr) return next(updErr);

        res.json({submission: updated});
    } catch (err) {
        next(err);
    }
}