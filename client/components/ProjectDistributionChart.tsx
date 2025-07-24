import { useEffect, useRef } from "react";
import * as Highcharts from "highcharts";

import type { ProvinceData, ProjectDistributionChartProps } from "@/types";

// Extended props for this specific implementation
interface ExtendedProjectDistributionChartProps
  extends ProjectDistributionChartProps {
  title?: string;
}

export default function ProjectDistributionChart({
  data,
  title = "Distribusi Project per Provinsi",
}: ExtendedProjectDistributionChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<Highcharts.Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chartOptions: Highcharts.Options = {
      chart: {
        type: "column",
        backgroundColor: "transparent",
        height: 400,
        style: {
          fontFamily: "Inter, system-ui, sans-serif",
        },
      },
      title: {
        text: title,
        style: {
          fontSize: "18px",
          fontWeight: "600",
          color: "#1f2937",
        },
      },
      subtitle: {
        text: "Sebaran proyek berdasarkan provinsi di Indonesia",
        style: {
          fontSize: "14px",
          color: "#6b7280",
        },
      },
      xAxis: {
        categories: data.map((item) => item.name),
        labels: {
          rotation: -45,
          style: {
            fontSize: "12px",
            color: "#6b7280",
          },
        },
        lineColor: "#e5e7eb",
      },
      yAxis: {
        min: 0,
        title: {
          text: "Jumlah Project",
          style: {
            fontSize: "14px",
            color: "#6b7280",
          },
        },
        labels: {
          style: {
            fontSize: "12px",
            color: "#6b7280",
          },
        },
        gridLineColor: "#f3f4f6",
      },
      tooltip: {
        backgroundColor: "#ffffff",
        borderColor: "#e5e7eb",
        borderRadius: 8,
        shadow: {
          color: "rgba(0, 0, 0, 0.1)",
          offsetX: 0,
          offsetY: 2,
          opacity: 0.1,
          width: 4,
        },
        useHTML: true,
        formatter: function () {
          const point = this.point as any;
          const projects = point.projects || [];
          const projectList = projects
            .slice(0, 3)
            .map((p: string) => `• ${p}`)
            .join("<br/>");
          const moreText =
            projects.length > 3 ? `<br/>• +${projects.length - 3} lainnya` : "";

          return `
            <div style="padding: 8px;">
              <div style="font-weight: 600; color: #1f2937; margin-bottom: 4px;">
                ${point.category}
              </div>
              <div style="color: #3b82f6; font-weight: 600; margin-bottom: 8px;">
                ${point.y} Project${point.y !== 1 ? "s" : ""}
              </div>
              ${
                projects.length > 0
                  ? `
                <div style="color: #6b7280; font-size: 12px; line-height: 1.4;">
                  <strong>Projects:</strong><br/>
                  ${projectList}${moreText}
                </div>
              `
                  : ""
              }
            </div>
          `;
        },
      },
      plotOptions: {
        column: {
          borderRadius: 4,
          dataLabels: {
            enabled: true,
            style: {
              fontSize: "12px",
              fontWeight: "600",
              color: "#1f2937",
            },
          },
          states: {
            hover: {
              brightness: 0.1,
            },
          },
        },
      },
      series: [
        {
          type: "column",
          name: "Jumlah Project",
          colorByPoint: true,
          data: data.map((item, index) => ({
            name: item.name,
            y: item.value,
            projects: item.projects,
            color:
              item.color ||
              [
                "#3b82f6",
                "#10b981",
                "#f59e0b",
                "#ef4444",
                "#8b5cf6",
                "#06b6d4",
                "#84cc16",
                "#f97316",
                "#ec4899",
                "#6366f1",
              ][index % 10],
          })),
        },
      ],
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              xAxis: {
                labels: {
                  rotation: -90,
                  style: {
                    fontSize: "10px",
                  },
                },
              },
              yAxis: {
                title: {
                  text: "",
                },
              },
            },
          },
        ],
      },
    };

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    chartInstance.current = Highcharts.chart(chartRef.current, chartOptions);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data, title]);

  return (
    <div className="w-full">
      <div ref={chartRef} className="w-full" />
    </div>
  );
}
