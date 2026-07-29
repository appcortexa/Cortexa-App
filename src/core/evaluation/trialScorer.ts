type TrialType = "GO" | "NO_GO";

export type TrialResult =
  | "HIT"
  | "MISS"
  | "FALSE_ALARM"
  | "CORRECT_REJECTION";

type ScorableTrial = {
  type: TrialType;
  response: boolean;
};

export function scoreTrial(trial: ScorableTrial): TrialResult {
  if (trial.type === "GO") {
    return trial.response ? "HIT" : "MISS";
  }

  return trial.response ? "FALSE_ALARM" : "CORRECT_REJECTION";
}