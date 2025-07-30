import { GeoMap } from "@/components/visualizations/GeoMap";
import { HeatmapChart } from "@/components/visualizations/HeatmapChart";
import { CustomChartBuilder } from "@/components/visualizations/CustomChartBuilder";
import { AnomalyDetection } from "@/components/visualizations/AnomalyDetection";
import { ClusteringAnalysis } from "@/components/visualizations/ClusteringAnalysis";

export const AdvancedVisualizations = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Advanced Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Explore geographic data, detect anomalies, perform clustering, and build custom charts
        </p>
      </div>

      {/* Custom Chart Builder */}
      <div className="grid grid-cols-1 gap-6">
        <CustomChartBuilder />
      </div>

      {/* Geographic and Heatmap Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GeoMap
          title="Global Sales Data"
          description="Revenue distribution across major cities"
        />
        
        <HeatmapChart
          title="Weekly Activity"
          description="User engagement by day and hour"
          colorScheme="blue"
        />
      </div>

      {/* AI/ML Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnomalyDetection />
        <ClusteringAnalysis />
      </div>

      {/* Additional Heatmaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HeatmapChart
          title="Performance Metrics"
          description="System performance across different time periods"
          colorScheme="green"
        />
        
        <HeatmapChart
          title="Error Tracking"
          description="Error frequency analysis"
          colorScheme="red"
        />
      </div>
    </div>
  );
};