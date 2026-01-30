import { supabaseUser } from '../lib/supabaseClient.js';
import { calculateCarbonFromFactor } from '../services/carbon.service.js';

export async function createActionLog(req, res, next) {
    try {
        const {action_type_key, quantity, user_id} = req.body;

        const demoUserId = req.header("x-user-id") || user_id;
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