import json

import numpy as np
import pandas as pd
import plotly.express as px
import plotly.figure_factory as ff
import plotly.graph_objects as go
from scipy.cluster.hierarchy import linkage
from sklearn.cluster import AgglomerativeClustering
from sklearn.preprocessing import StandardScaler

STATE_DICT = {
    "AL": "Alabama", "AR": "Arkansas", "AZ": "Arizona", "CA": "California",
    "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida",
    "GA": "Georgia", "IA": "Iowa", "ID": "Idaho", "IL": "Illinois",
    "IN": "Indiana", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana",
    "MA": "Massachusetts", "MD": "Maryland", "ME": "Maine", "MI": "Michigan",
    "MN": "Minnesota", "MO": "Missouri", "MS": "Mississippi", "MT": "Montana",
    "NC": "North Carolina", "ND": "North Dakota", "NE": "Nebraska",
    "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico",
    "NV": "Nevada", "NY": "New York", "OH": "Ohio", "OK": "Oklahoma",
    "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island",
    "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee",
    "TX": "Texas", "UT": "Utah", "VA": "Virginia", "VT": "Vermont",
    "WA": "Washington", "WI": "Wisconsin", "WV": "West Virginia",
    "WY": "Wyoming",
}

FEATURE_COLS = [
    "Severity",
    "Temperature(F)",
    "Humidity(%)",
    "Visibility(mi)",
    "Wind_Speed(mph)",
    "Precipitation(in)",
]

# Dark theme layout for Plotly figures
DARK_LAYOUT = dict(
    paper_bgcolor="rgba(0,0,0,0)",
    plot_bgcolor="rgba(0,0,0,0)",
    font=dict(color="#e6edf3", family="DM Sans, Inter, system-ui, sans-serif"),
    margin=dict(l=60, r=20, t=40, b=60),
)


def get_states() -> list[dict]:
    return [{"abbr": k, "name": v} for k, v in STATE_DICT.items()]


def run_clustering_analysis(
    crash_data: pd.DataFrame,
    state: str,
    sample_size: int,
    distance_threshold: float,
) -> dict:
    # Filter by state
    state_data = crash_data[crash_data["State"] == state]

    # Random sample
    n = min(sample_size, len(state_data))
    if n == 0:
        return {
            "correlation_figure": {},
            "dendrogram_figure": {},
            "cluster_averages": [],
            "clustered_sample": [],
            "raw_sample": [],
            "n_clusters": 0,
        }

    sampled = state_data.sample(n=n)

    # Select feature columns + ID
    working = sampled[["ID"] + FEATURE_COLS].copy()

    # Median imputation
    for col in FEATURE_COLS:
        median_val = working[col].median()
        working[col] = working[col].fillna(median_val)

    # Raw sample for display (first 100 rows, unscaled)
    raw_sample = working.head(100).to_dict(orient="records")

    # Correlation heatmap (on unscaled data)
    corr_matrix = working[FEATURE_COLS].corr()
    corr_fig = px.imshow(
        corr_matrix,
        text_auto=".2f",
        color_continuous_scale="RdBu_r",
        zmin=-1,
        zmax=1,
        labels=dict(color="Correlation"),
    )
    corr_fig.update_layout(
        title="Correlation Heatmap",
        **DARK_LAYOUT,
    )

    # Scale features
    scaler = StandardScaler()
    scaled_values = scaler.fit_transform(working[FEATURE_COLS])
    scaled_df = pd.DataFrame(scaled_values, columns=FEATURE_COLS, index=working.index)

    # Agglomerative clustering
    model = AgglomerativeClustering(
        distance_threshold=distance_threshold,
        n_clusters=None,
        compute_distances=True,
    )
    cluster_labels = model.fit_predict(scaled_df)

    # Build dendrogram using scipy linkage from sklearn model
    # Reconstruct linkage matrix from the sklearn model
    children = model.children_
    n_samples = len(scaled_df)
    distances = model.distances_

    # Create linkage matrix
    counts = np.zeros(children.shape[0])
    for i, merge in enumerate(children):
        current_count = 0
        for child_idx in merge:
            if child_idx < n_samples:
                current_count += 1
            else:
                current_count += counts[child_idx - n_samples]
        counts[i] = current_count

    linkage_matrix = np.column_stack(
        [children, distances, counts]
    ).astype(float)

    # Create dendrogram figure using plotly
    dendro_fig = ff.create_dendrogram(
        scaled_df.values,
        linkagefun=lambda x: linkage_matrix,
        color_threshold=distance_threshold,
    )
    dendro_fig.update_layout(
        title="Hierarchical Clustering Dendrogram",
        xaxis_title="Sample Index",
        yaxis_title="Distance",
        height=500,
        **DARK_LAYOUT,
    )
    dendro_fig.update_xaxes(showticklabels=False, gridcolor="rgba(255,255,255,0.05)")
    dendro_fig.update_yaxes(gridcolor="rgba(255,255,255,0.05)")

    # Cluster averages
    working["Cluster"] = cluster_labels
    joined = working.copy()
    agg_dict = {col: "mean" for col in FEATURE_COLS}
    agg_dict["ID"] = "count"
    cluster_avgs = (
        joined.groupby("Cluster", as_index=False)
        .agg(agg_dict)
        .rename(columns={"ID": "Count"})
    )
    # Round for display
    for col in FEATURE_COLS:
        cluster_avgs[col] = cluster_avgs[col].round(2)

    # Clustered data sample
    clustered_sample = joined.head(100).to_dict(orient="records")

    return {
        "correlation_figure": json.loads(corr_fig.to_json()),
        "dendrogram_figure": json.loads(dendro_fig.to_json()),
        "cluster_averages": cluster_avgs.to_dict(orient="records"),
        "clustered_sample": clustered_sample,
        "raw_sample": raw_sample,
        "n_clusters": int(cluster_avgs.shape[0]),
    }
