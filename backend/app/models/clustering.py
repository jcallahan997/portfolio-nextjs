from pydantic import BaseModel, Field


class ClusteringRequest(BaseModel):
    state: str = Field(..., description="Two-letter state abbreviation")
    sample_size: int = Field(1000, ge=100, le=10000)
    distance_threshold: float = Field(20.0, ge=0, le=100)


class ClusteringResponse(BaseModel):
    correlation_figure: dict
    dendrogram_figure: dict
    cluster_averages: list[dict]
    clustered_sample: list[dict]
    raw_sample: list[dict]
    n_clusters: int
