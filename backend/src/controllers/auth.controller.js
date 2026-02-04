import { supabaseAdmin } from "../lib/supabaseClient.js";

export async function login(req, res, next) {
    try {
        const { username, password } = req.body || {};

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required." });
        }

        const { data: user, error } = await supabaseAdmin
            .from("users")
            .select("user_id, username, display_name, role, group_id")
            .eq("username", username)
            .eq("password", password)
            .single();

        if (error) {
            if (error.code === "PGRST116") {
                return res.status(401).json({ error: "Invalid credentials." });
            }
            return next(error);
        }

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        return res.status(200).json({ user });
    } catch (err) {
        next(err);
    }
}
