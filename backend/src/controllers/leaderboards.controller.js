import { supabaseUser } from "../lib/supabaseClient.js";

export async function listUserLeaderboards(req, res, next) {
    try {
        const groupId = req.query?.group_id || null;

        const { data: groups, error: groupError } = await supabaseUser
            .from("groups")
            .select("group_id, name");

        if (groupError) return next(groupError);

        const groupNameById = new Map();
        for (const group of groups ?? []) {
            groupNameById.set(group.group_id, group.name);
        }

        const { data: users, error: userError } = await supabaseUser
            .from("users")
            .select("user_id, username, display_name, group_id");

        if (userError) return next(userError);

        const filteredUsers = (users ?? []).filter((user) => {
            if (!groupId) return true;
            return user.group_id === groupId;
        });

        const userIds = filteredUsers.map((user) => user.user_id);

        let logs = [];
        if (userIds.length > 0) {
            const { data: actionLogs, error: logError } = await supabaseUser
                .from("action_logs")
                .select("user_id, score")
                .in("user_id", userIds);

            if (logError) return next(logError);
            logs = actionLogs ?? [];
        }

        const totals = new Map();
        for (const log of logs) {
            const points = Number(log.score || 0);
            totals.set(log.user_id, (totals.get(log.user_id) || 0) + points);
        }

        const leaderboard = filteredUsers
            .map((user) => ({
                user_id: user.user_id,
                username: user.username,
                display_name: user.display_name,
                group_id: user.group_id,
                group_name: user.group_id ? groupNameById.get(user.group_id) || null : null,
                points: totals.get(user.user_id) || 0,
            }))
            .sort((a, b) => {
                if (b.points !== a.points) return b.points - a.points;
                const nameA = (a.display_name || a.username || "").toLowerCase();
                const nameB = (b.display_name || b.username || "").toLowerCase();
                return nameA.localeCompare(nameB);
            });

        return res.status(200).json({ leaderboards: leaderboard });
    } catch (err) {
        next(err);
    }
}
