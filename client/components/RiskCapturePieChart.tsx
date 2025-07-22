import { useEffect, useRef } from "react";
import Highcharts from "highcharts";

interface RiskCaptureData {
  name: string;
  y: number;
  color: string;
}

interface RiskCapturePieChartProps {
  data: RiskCaptureData[];
  title?: string;
}

export default function RiskCapturePieChart({ 
  data, 
  title = "Risk Capture Distribution" 
}: RiskCapturePieChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<Highcharts.Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create new chart
      chartInstance.current = Highcharts.chart(chartRef.current, {
        chart: {
          type: "pie",
          backgroundColor: "transparent",
          height: 400,
        },
        title: {
          text: title,
          style: {
            fontSize: "16px",
            fontWeight: "600",
            color: "#374151",
          },
        },
        tooltip: {
          pointFormat: "<b>{point.percentage:.1f}%</b><br/>Count: <b>{point.y}</b>",
          style: {
            fontSize: "12px",
          },
        },
        accessibility: {
          point: {
            valueSuffix: "%",
          },
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
              enabled: true,
              format: "<b>{point.name}</b><br/>{point.percentage:.1f}%",
              style: {
                fontSize: "11px",
                fontWeight: "500",
                color: "#374151",
                textOutline: "none",
              },
              distance: 20,
            },
            showInLegend: true,
            borderWidth: 2,
            borderColor: "#ffffff",
            size: "80%",
            innerSize: "40%", // Creates a donut chart
          },
        },
        legend: {
          align: "right",
          verticalAlign: "middle",
          layout: "vertical",
          itemStyle: {
            fontSize: "12px",
            fontWeight: "500",
            color: "#374151",
          },
          symbolRadius: 6,
          symbolHeight: 12,
          symbolWidth: 12,
        },
        series: [
          {
            name: "Risk Level",
            type: "pie",
            data: data,
          },
        ],
        credits: {
          enabled: false,
        },
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500,
              },
              chartOptions: {
                legend: {
                  align: "center",
                  verticalAlign: "bottom",
                  layout: "horizontal",
                },
                plotOptions: {
                  pie: {
                    size: "90%",
                    dataLabels: {
                      distance: 10,
                      style: {
                        fontSize: "10px",
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data, title]);

  return (
    <div className="w-full h-full">
      <div ref={chartRef} className="w-full h-full" />
    </div>
  );
}
