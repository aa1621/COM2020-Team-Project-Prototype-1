import { supabaseUser } from '../lib/supabaseClient.js';
import { calculateCarbonFromFactor } from '../services/carbon.service.js';

const DEMO_USER_ID =
    process.env.DEMO_USER_ID || "c1aae9c3-5157-4a26-a7b3-28d8905cfef0";

function normalizeUserId(raw) {
    if (!raw) return null;
    const uuidV4ish =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidV4ish.test(raw)) return raw;
    if (raw === "demo-flynn" || raw === "demo") return DEMO_USER_ID;
    return raw;
}

export async function createActionLog(req, res, next) {
    try {
        const {action_type_key, quantity, user_id} = req.body;

        const demoUserId = normalizeUserId(req.header("x-user-id") || user_id);
        if (!demoUserId) {
            return res.status(400).json({
                error: 'Missing user id. For now pass header "x-user-id" (or body user_id)',
            });
        }

        if (!action_type_key) {
            return res.status(400).json({error: "Missing action_type_key"});
        }

        const {data: actionType, error: atErr} = await supabaseUser
            .from("action_types")
            .select(`
                action_type_id,
                key,
                category,
                name,
                unit,
                default_factor_id,
                default_factor:conversion_factors!action_types_default_factor_fk (
                    factor_id,
                    source,
                    unit_in,
                    unit_out,
                    value,
                    uncertainty,
                    notes
                )
            `)
            .eq("key", action_type_key)
            .single();

        if (atErr) return next(atErr);
        if (!actionType) return res.status(404).json({error: "Action type not found"});
        if (!actionType.default_factor) return res.status(500).json({error: "Action type has no default factor configured"});

        const factor = actionType.default_factor;

        if (actionType.unit !== factor.unit_in) {
            return res.status(400).json({
                error: `Unit mismatch: action type unit is "${actionType.unit}" but factor expects "${factor.unit_in}`,
            });
        }
        if (factor.unit_out !== "kg CO2e") {
            return res.status(400).json({
                error: `Unexpected factor output unit "${factor.unit_out}" (expected "kg CO2e")`,
            });
        }

        const calc = calculateCarbonFromFactor(quantity, factor);
        if (calc.error) return res.status(400).json({error: calc.error});

        const insertRow = {
            user_id: demoUserId,
            action_type_id: actionType.action_type_id,
            quantity: Number(quantity),
            action_date: new Date().toISOString().slice(0, 10),
            evidence_required: false,
            calculated_co2e: calc.estimateKgCO2e,
            score: Math.round(calc.estimateKgCO2e * 10),
        };

        const {data: inserted, error: insErr} = await supabaseUser
            .from("action_logs")
            .insert(insertRow)
            .select("*")
            .single();

        if (insErr) return next(insErr);

        return res.status(201).json({
            log: inserted,
            calculation: calc,
            actionType: {
                key: actionType.key,
                name: actionType.name,
                category: actionType.category,
                unit: actionType.unit,
            },
        });
    } catch (err) {
        next(err);
    }
}
