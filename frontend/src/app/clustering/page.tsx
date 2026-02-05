"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { GlassCard } from "@/components/glass/GlassCard";
import { useStates, useClusteringAnalysis } from "@/hooks/useClusteringData";
import { motion } from "framer-motion";
import { BarChart3, RefreshCw } from "lucide-react";

// Dynamic import for Plotly (SSR-incompatible)
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const SAMPLE_SIZES = [500, 1000, 2500, 5000, 7500, 10000];

export default function ClusteringPage() {
  const [state, setState] = useState("CA");
  const [sampleSize, setSampleSize] = useState(1000);
  const [distanceThreshold, setDistanceThreshold] = useState(20);
  const [queryKey, setQueryKey] = useState(0);

  const { data: states } = useStates();
  const { data, isLoading, isFetching, refetch } = useClusteringAnalysis({
    state,
    sample_size: sampleSize,
    distance_threshold: distanceThreshold,
  });

  const handleResample = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-6 h-6 text-burgundy" />
          <h1 className="text-3xl font-bold text-foreground">
            Agglomerative Clustering
          </h1>
        </div>
        <p className="text-foreground-muted">
          Hierarchical clustering on US car crash data.{" "}
          <a
            href="https://www.kaggle.com/datasets/sobhanmoosavi/us-accidents/data"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cerulean-light hover:underline"
          >
            Data source (Kaggle)
          </a>{" "}
          &middot;{" "}
          <a
            href="https://github.com/jcallahan997/Unsup_ML_Dockerized_App"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cerulean-light hover:underline"
          >
            GitHub
          </a>
        </p>
      </motion.div>

      {/* Controls */}
      <GlassCard className="flex flex-wrap gap-6 items-end">
        {/* State selector */}
        <div className="flex flex-col gap-1.5 min-w-[180px]">
          <label className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
            State
          </label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-cerulean/50 transition-colors"
          >
            {states?.map((s) => (
              <option key={s.abbr} value={s.abbr} className="bg-bg-card">
                {s.name} ({s.abbr})
              </option>
            ))}
          </select>
        </div>

        {/* Sample size */}
        <div className="flex flex-col gap-1.5 min-w-[140px]">
          <label className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
            Sample Size
          </label>
          <select
            value={sampleSize}
            onChange={(e) => setSampleSize(Number(e.target.value))}
            className="bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-cerulean/50 transition-colors"
          >
            {SAMPLE_SIZES.map((size) => (
              <option key={size} value={size} className="bg-bg-card">
                {size.toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        {/* Distance threshold */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
          <label className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
            Distance Threshold: {distanceThreshold}
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={distanceThreshold}
            onChange={(e) => setDistanceThreshold(Number(e.target.value))}
            className="w-full accent-cerulean h-2 rounded-lg appearance-none bg-white/[0.08]"
          />
        </div>

        {/* Resample button */}
        <button
          onClick={handleResample}
          disabled={isFetching}
          className="btn-burgundy flex items-center gap-2 whitespace-nowrap"
        >
          <RefreshCw
            className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Resample
        </button>
      </GlassCard>

      {/* Loading state */}
      {isLoading && (
        <GlassCard className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-foreground-muted">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Running analysis...</span>
          </div>
        </GlassCard>
      )}

      {/* Results */}
      {data && !isLoading && (
        <>
          {/* Raw data sample */}
          <GlassCard>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Data Sample (100 rows)
            </h2>
            <div className="overflow-x-auto rounded-lg border border-white/[0.06]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-burgundy/10">
                    {data.raw_sample[0] &&
                      Object.keys(data.raw_sample[0]).map((key) => (
                        <th
                          key={key}
                          className="text-left px-3 py-2 text-xs font-medium text-foreground-muted uppercase"
                        >
                          {key}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {data.raw_sample.slice(0, 20).map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                    >
                      {Object.values(row).map((val, j) => (
                        <td
                          key={j}
                          className="px-3 py-1.5 text-foreground-muted"
                        >
                          {typeof val === "number" ? val.toFixed(2) : String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* Correlation Heatmap */}
          <GlassCard>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Correlation Heatmap
            </h2>
            <div className="rounded-xl overflow-hidden">
              <Plot
                data={data.correlation_figure.data as Plotly.Data[]}
                layout={{
                  ...(data.correlation_figure.layout as Partial<Plotly.Layout>),
                  autosize: true,
                }}
                config={{ responsive: true, displayModeBar: false }}
                className="w-full"
                style={{ width: "100%", height: "500px" }}
              />
            </div>
            <div className="mt-4 text-sm text-foreground-muted space-y-1">
              <p>
                <em>
                  Note: The heatmap uses unscaled data. Scaling does not affect
                  Pearson correlation as it is invariant to linear
                  transformations.
                </em>
              </p>
            </div>
          </GlassCard>

          {/* Dendrogram */}
          <GlassCard>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Dendrogram ({data.n_clusters} clusters)
            </h2>
            <div className="rounded-xl overflow-hidden">
              <Plot
                data={data.dendrogram_figure.data as Plotly.Data[]}
                layout={{
                  ...(data.dendrogram_figure.layout as Partial<Plotly.Layout>),
                  autosize: true,
                }}
                config={{ responsive: true, displayModeBar: false }}
                className="w-full"
                style={{ width: "100%", height: "500px" }}
              />
            </div>
            <p className="mt-4 text-sm text-foreground-muted">
              <em>
                No minimum cluster size is set, allowing outlier clusters to
                form and preserving data integrity in remaining clusters.
              </em>
            </p>
          </GlassCard>

          {/* Cluster Averages */}
          <GlassCard>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Cluster Averages
            </h2>
            <div className="overflow-x-auto rounded-lg border border-white/[0.06]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-burgundy/10">
                    {data.cluster_averages[0] &&
                      Object.keys(data.cluster_averages[0]).map((key) => (
                        <th
                          key={key}
                          className="text-left px-3 py-2 text-xs font-medium text-foreground-muted uppercase"
                        >
                          {key}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {data.cluster_averages.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                    >
                      {Object.values(row).map((val, j) => (
                        <td
                          key={j}
                          className="px-3 py-1.5 text-foreground-muted"
                        >
                          {typeof val === "number" ? val.toFixed(2) : String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* Clustered Data */}
          <GlassCard>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Clustered Data (Sample of 100)
            </h2>
            <div className="overflow-x-auto rounded-lg border border-white/[0.06]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-burgundy/10">
                    {data.clustered_sample[0] &&
                      Object.keys(data.clustered_sample[0]).map((key) => (
                        <th
                          key={key}
                          className="text-left px-3 py-2 text-xs font-medium text-foreground-muted uppercase"
                        >
                          {key}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {data.clustered_sample.slice(0, 20).map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                    >
                      {Object.values(row).map((val, j) => (
                        <td
                          key={j}
                          className="px-3 py-1.5 text-foreground-muted"
                        >
                          {typeof val === "number" ? val.toFixed(2) : String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
}
