

function confidenceFromUncertainty(u) {
    if (u == null) return "Medium";
    if (u <= 0.10) return "High";
    if (u <= 0.25) return "Medium";
    return "Low";
}

export function calculateCarbonFromFactor(quantityInput, factorRow) {
    const quantity = typeof quantityInput === "string" ? parseFloat(quantityInput) : quantityInput;

    if (Number.isNaN(quantity) || quantity <= 0) {
        return {error: "Quantity must be a positive number"};
    }

    const value = Number(factorRow.value);
    if (Number.isNaN(value)) {
        return {error: "Factor value is invalid"};
    }

    const uncertainty = factorRow.uncertainty == null ? 0 : Number(factorRow.uncertainty);
    const estimate = quantity * value;

    const min = estimate * (1 - uncertainty);
    const max = estimate * (1 + uncertainty);

    return {
        estimateKgCO2e: estimate,
        rangeKgCO2e: {min, max},
        factor: {
            id: factorRow.factor_id,
            source: factorRow.source,
            value: value,
            unit_in: factorRow.unit_in,
            unit_out: factorRow.unit_out,
            uncertainty: uncertainty,
            notes: factorRow.notes,
        },
        confidence: confidenceFromUncertainty(uncertainty),
        caveat: `${factorRow.notes || ""}${factorRow.notes ? " " : ""}This is a simplified estimate using average values.`,
    };
}