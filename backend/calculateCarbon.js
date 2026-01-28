const CAR_EMISSION_FACTOR = 0.171; 
const FOOD_EMISSION_FACTOR = 2.5; 
const ENERGY_EMISSION_FACTOR = 0.233; 

const UNCERTAINTY = 0.20; // +-20%

function calculateCarbon(category, amountString) {
  const amount = parseFloat(amountString);

  if (isNaN(amount) || amount <= 0) {
    return { error: "Amount must be a positive number" };
  }

  // Travel
  if (category === "Travel") {
    const estimate = amount * CAR_EMISSION_FACTOR;

    return buildResult(
      estimate,
      "Average car travel",
      CAR_EMISSION_FACTOR,
      "kg CO2e per km",
      "Estimate assumes car travel avoided"
    );
  }

  // Food
  if (category === "Food") {
    const estimate = amount * FOOD_EMISSION_FACTOR;

    return buildResult(
      estimate,
      "Average meal emissions",
      FOOD_EMISSION_FACTOR,
      "kg CO2e per meal",
      "Estimate varies widely by diet and food source"
    );
  }

  // Energy
  if (category === "Energy") {
    const estimate = amount * ENERGY_EMISSION_FACTOR;

    return buildResult(
      estimate,
      "UK electricity average",
      ENERGY_EMISSION_FACTOR,
      "kg CO2e per kWh",
      "Estimate depends on energy mix and time of use"
    );
  }

  return { error: "Category not supported yet" };
}

function buildResult(estimate, factorName, factorValue, unit, caveatText) {
  const min = estimate * (1 - UNCERTAINTY);
  const max = estimate * (1 + UNCERTAINTY);

  return {
    estimateKgCO2e: estimate,
    rangeKgCO2e: {
      min: min,
      max: max
    },
    factor: {
      name: factorName,
      value: factorValue,
      unit: unit
    },
    confidence: "Medium",
    caveat:
      caveatText +
      "This is a simplified estimate using average values"
  };
}

module.exports = { calculateCarbon };