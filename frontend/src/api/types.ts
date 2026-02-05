export type ConversionFactor = {
  factor_id: string | number;
  source: string | null;
  unit_in: string;     // e.g. km
  unit_out: string;    // kg CO2e
  value: number;       // factor value
  uncertainty: number | null;
  notes: string | null;
};

export type ActionType = {
  action_type_id: string | number;
  key: string;         // this is what is sent back
  category: string;
  name: string;
  unit: string;        // e.g. km
  default_factor_id: string | number | null;
  factor: ConversionFactor | null;
};

export type CarbonCalculation = {
  estimateKgCO2e: number;
  rangeKgCO2e: { min: number; max: number };
  factor: {
    name?: string; // may or may not exist depending on service
    value: number;
    unit: string;
  };
  confidence: "Low" | "Medium" | "High";
  caveat: string;
};

export type ActionLog = {
  action_log_id?: string | number;
  user_id: string;
  action_type_id: string | number;
  quantity: number;
  action_date: string; // "YYYY-MM-DD"
  evidence_required: boolean;
  calculated_co2e: number;
  score: number;
};

export type GetActionTypesResponse = {
  actionTypes: Array<{
    action_type_id: string | number;
    key: string;
    category: string;
    name: string;
    unit: string;
    default_factor_id: string | number | null;
    factor: any | null;
  }>;
};

export type CreateActionLogRequest = {
  action_type_key: string;
  quantity: number;
  user_id?: string;
};

export type CreateActionLogResponse = {
  log: {
    user_id: string;
    action_type_id: string | number;
    quantity: number;
    action_date: string;
    evidence_required: boolean;
    calculated_co2e: number;
    score: number;
  };
  calculation: {
    estimateKgCO2e: number;
    rangeKgCO2e: { min: number; max: number };
    factor: { value: number; unit: string };
    confidence: "Low" | "Medium" | "High";
    caveat: string;
  };
  actionType: {
    key: string;
    name: string;
    category: string;
    unit: string;
  };
};

export type ActionLogListResponse = {
  logs: Array<{
    log_id: string | number;
    user_id: string;
    action_type_id: string | number;
    quantity: number;
    action_date: string;
    calculated_co2e: number;
    score: number;
  }>;
};
