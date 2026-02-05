from fastapi import APIRouter, Request

from app.models.clustering import ClusteringRequest, ClusteringResponse
from app.services.clustering_service import get_states, run_clustering_analysis

router = APIRouter(tags=["clustering"])


@router.get("/states")
async def list_states():
    return get_states()


@router.post("/analyze", response_model=ClusteringResponse)
async def analyze(request: Request, params: ClusteringRequest):
    crash_data = request.app.state.crash_data
    result = run_clustering_analysis(
        crash_data=crash_data,
        state=params.state,
        sample_size=params.sample_size,
        distance_threshold=params.distance_threshold,
    )
    return result
