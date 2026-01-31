
export function calculatePoints(totalCO2eKg, scoringObj) {
    const pointsPerKg = typeof scoringObj?.points_per_kg === "number" ? scoringObj.points_per_kg : 10;

    return Math.round(totalCO2eKg * pointsPerKg);
}