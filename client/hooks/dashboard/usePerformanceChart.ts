import { useRef, useEffect, useCallback, useMemo } from "react";
import { DataPeriod } from "./useDashboardData";
import { formatCurrency } from "./useDashboardCalculations";

// Lazy load Highcharts
const loadHighcharts = async () => {
  const Highcharts = await import("highcharts");
  return Highcharts.default;
};

export const usePerformanceChart = (
  selectedPeriod: DataPeriod,
  isLoading: boolean,
) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>(null);

  // Memoize chart configuration to prevent recreation
  const chartConfig = useMemo(() => {
    return {
      chart: {
        type: "column",
        height: window.innerWidth < 768 ? 280 : 350,
        backgroundColor: "transparent",
      },
      title: {
        text: "",
      },
      xAxis: {
        categories: selectedPeriod.data.map((stat) =>
          selectedPeriod.type === "yearly"
            ? stat.period.split(" ")[0]
            : stat.period,
        ),
        crosshair: true,
      },
      yAxis: [
        {
          min: 0,
          title: {
            text: "Jumlah Proyek & Risiko",
            style: {
              color: "#666",
            },
          },
          labels: {
            style: {
              color: "#666",
            },
          },
        },
        {
          title: {
            text: "Revenue (Milyar IDR)",
            style: {
              color: "#f59e0b",
            },
          },
          labels: {
            formatter: function () {
              return (this.value / 1000000000).toFixed(1) + "B";
            },
            style: {
              color: "#f59e0b",
            },
          },
          opposite: true,
        },
      ],
      tooltip: {
        shared: true,
        formatter: function () {
          let tooltip = `<b>${this.x}</b><br/>`;
          this.points?.forEach((point) => {
            if (point.series.name === "Revenue") {
              tooltip += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${formatCurrency(point.y as number)}</b><br/>`;
            } else {
              tooltip += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y}</b><br/>`;
            }
          });
          return tooltip;
        },
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: [
        {
          name: "Proyek",
          data: selectedPeriod.data.map((stat) => stat.projects),
          color: "#3b82f6",
          yAxis: 0,
        },
        {
          name: "Risiko",
          data: selectedPeriod.data.map((stat) => stat.risks),
          color: "#ef4444",
          yAxis: 0,
        },
        {
          name: "Revenue",
          data: selectedPeriod.data.map((stat) => stat.revenue),
          color: "#f59e0b",
          type: "line",
          yAxis: 1,
          marker: {
            enabled: true,
            radius: 4,
          },
        },
      ],
      credits: {
        enabled: false,
      },
      legend: {
        align: "center",
        verticalAlign: "bottom",
        layout: "horizontal",
      },
    };
  }, [selectedPeriod]);

  // Memoized chart update function
  const updateChart = useCallback(async () => {
    if (!chartRef.current || isLoading) return;

    try {
      const Highcharts = await loadHighcharts();

      // Destroy existing chart instance
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Create new chart instance
      chartInstanceRef.current = Highcharts.chart(
        chartRef.current,
        chartConfig,
      );
    } catch (error) {
      console.error("Failed to load or render chart:", error);
    }
  }, [chartConfig, isLoading]);

  // Effect to update chart when data changes
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(updateChart, 100);
      return () => clearTimeout(timer);
    }
  }, [updateChart, isLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return chartRef;
};
