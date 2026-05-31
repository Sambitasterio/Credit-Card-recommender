"""
K-Means clustering for the FreechargeBiz Credit Card Recommendation Engine.

Runs ONCE, offline. Groups credit-card customers into 4 spending personas and
writes the result to src/data/clusters.json, which is baked into the Next.js app
(the live site never runs this script).

Usage (from the project root, i.e. the freecharge-cc-recommender/ folder):
    python ml/cluster.py

Data source:
    Primary  -> ml/CC GENERAL.csv  (Kaggle: "Credit Card Dataset for Clustering")
    Fallback -> a synthetic dataset generated here if the CSV is missing, so the
                pipeline always runs and produces a valid clusters.json.
"""

import json
import os

import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler

FEATURES = [
    "BALANCE", "PURCHASES", "CASH_ADVANCE", "CREDIT_LIMIT",
    "PAYMENTS", "MINIMUM_PAYMENTS", "PRC_FULL_PAYMENT", "TENURE",
]

CSV_PATH = "ml/CC GENERAL.csv"
OUT_PATH = "src/data/clusters.json"
N_CLUSTERS = 4
RANDOM_STATE = 42


def load_dataset() -> tuple[pd.DataFrame, str]:
    """Load the Kaggle CSV if present, else generate a synthetic stand-in."""
    if os.path.exists(CSV_PATH):
        df = pd.read_csv(CSV_PATH)
        return df[FEATURES].copy(), "kaggle"
    return synthetic_dataset(), "synthetic"


def synthetic_dataset(n_per_cluster: int = 2200, seed: int = RANDOM_STATE) -> pd.DataFrame:
    """
    Build a dataset with 4 well-separated spending archetypes so K-Means recovers
    meaningful groups. Columns mirror the Kaggle CC GENERAL schema.

    Archetype means (BALANCE, PURCHASES, CASH_ADVANCE, CREDIT_LIMIT,
                      PAYMENTS, MINIMUM_PAYMENTS, PRC_FULL_PAYMENT, TENURE):
      - Digital Native        : high purchases, low cash advance, mid limit
      - Bill Payer            : high balance, high min payments, low purchases
      - On-the-Go Professional: high credit limit, high payments
      - First-Timer           : low everything, short tenure
    """
    rng = np.random.default_rng(seed)
    archetypes = {
        "digital_native":  [1200,  9000,  300, 9000,  8500, 600, 0.55, 11.5],
        "bill_payer":      [2600,  1800, 1500, 6000,  2200, 1400, 0.10, 11.8],
        "professional":    [3000, 14000,  800, 22000, 15000, 1200, 0.45, 12.0],
        "first_timer":     [400,   1200,  150, 2500,  1300, 350, 0.25, 7.0],
    }
    spreads = [0.35, 0.4, 0.5, 0.3, 0.4, 0.45, 0.3, 0.08]

    frames = []
    for means in archetypes.values():
        cols = {}
        for j, feat in enumerate(FEATURES):
            mu = means[j]
            sigma = abs(mu) * spreads[j] + 1e-6
            vals = rng.normal(mu, sigma, n_per_cluster)
            if feat == "PRC_FULL_PAYMENT":
                vals = np.clip(vals, 0, 1)
            elif feat == "TENURE":
                vals = np.clip(np.round(vals), 6, 12)
            else:
                vals = np.clip(vals, 0, None)
            cols[feat] = vals
        frames.append(pd.DataFrame(cols))

    df = pd.concat(frames, ignore_index=True)
    return df.sample(frac=1.0, random_state=seed).reset_index(drop=True)


def assign_personas(profiles: pd.DataFrame) -> dict[int, str]:
    """
    Map each cluster id -> persona name using the cluster feature means.
    Deterministic, 1:1 assignment (no manual review needed), but the printed
    profiles let you sanity-check the mapping.

      1. Highest CREDIT_LIMIT            -> On-the-Go Professional
      2. Highest PURCHASES (of the rest) -> Digital Native
      3. Lowest CREDIT_LIMIT (of rest)   -> First-Timer
      4. Remaining                        -> Bill Payer
    """
    remaining = list(profiles.index)
    mapping: dict[int, str] = {}

    professional = profiles.loc[remaining, "CREDIT_LIMIT"].idxmax()
    mapping[professional] = "On-the-Go Professional"
    remaining.remove(professional)

    digital = profiles.loc[remaining, "PURCHASES"].idxmax()
    mapping[digital] = "Digital Native"
    remaining.remove(digital)

    first_timer = profiles.loc[remaining, "CREDIT_LIMIT"].idxmin()
    mapping[first_timer] = "First-Timer"
    remaining.remove(first_timer)

    mapping[remaining[0]] = "Bill Payer"
    return mapping


def main() -> None:
    df, source = load_dataset()
    print(f"Data source: {source}  ({len(df):,} rows)")

    imputer = SimpleImputer(strategy="median")
    X_imputed = imputer.fit_transform(df[FEATURES])

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_imputed)

    kmeans = KMeans(n_clusters=N_CLUSTERS, random_state=RANDOM_STATE, n_init=10)
    labels = kmeans.fit_predict(X_scaled)

    work = df[FEATURES].copy()
    work["cluster"] = labels
    profiles = work.groupby("cluster")[FEATURES].mean().round(2)

    cluster_to_persona = assign_personas(profiles)
    counts = work["cluster"].value_counts(normalize=True).round(4)

    output = {
        "source": source,
        "n_rows": int(len(df)),
        "features": FEATURES,
        "cluster_sizes": {
            cluster_to_persona[int(k)]: float(v) for k, v in counts.items()
        },
        "cluster_profiles": {
            cluster_to_persona[int(idx)]: row.to_dict()
            for idx, row in profiles.iterrows()
        },
        "scaler_mean": scaler.mean_.tolist(),
        "scaler_scale": scaler.scale_.tolist(),
        "centroids": kmeans.cluster_centers_.tolist(),
    }

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w") as f:
        json.dump(output, f, indent=2)

    print(f"Wrote {OUT_PATH}")
    print("Cluster sizes:")
    for persona, pct in sorted(output["cluster_sizes"].items(), key=lambda kv: -kv[1]):
        print(f"  {persona:<24} {pct * 100:5.1f}%")


if __name__ == "__main__":
    main()
