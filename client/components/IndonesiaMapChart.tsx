import { useEffect, useRef } from "react";
import * as Highcharts from "highcharts";
import HighchartsMap from "highcharts/modules/map";

// Initialize the map module
if (typeof Highcharts === "object") {
  HighchartsMap(Highcharts);
}

import type { RegionData, IndonesiaMapChartProps } from "@/types";

// Extended props for this specific implementation
interface ExtendedIndonesiaMapChartProps extends IndonesiaMapChartProps {
  title?: string;
}

export default function IndonesiaMapChart({
  data,
  title = "Distribusi Project per Provinsi",
}: IndonesiaMapChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<Highcharts.Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Simplified Indonesia map data (major provinces)
    const indonesiaMapData = [
      {
        "hc-key": "id-jk",
        name: "DKI Jakarta",
        path: "M 400 200 L 420 200 L 420 220 L 400 220 Z",
      },
      {
        "hc-key": "id-jr",
        name: "Jawa Barat",
        path: "M 380 210 L 430 210 L 430 240 L 380 240 Z",
      },
      {
        "hc-key": "id-jt",
        name: "Jawa Tengah",
        path: "M 430 210 L 480 210 L 480 240 L 430 240 Z",
      },
      {
        "hc-key": "id-ji",
        name: "Jawa Timur",
        path: "M 480 210 L 530 210 L 530 240 L 480 240 Z",
      },
      {
        "hc-key": "id-su",
        name: "Sumatera Utara",
        path: "M 200 100 L 250 100 L 250 150 L 200 150 Z",
      },
      {
        "hc-key": "id-sb",
        name: "Sumatera Barat",
        path: "M 180 150 L 230 150 L 230 200 L 180 200 Z",
      },
      {
        "hc-key": "id-ri",
        name: "Riau",
        path: "M 230 120 L 280 120 L 280 170 L 230 170 Z",
      },
      {
        "hc-key": "id-ss",
        name: "Sumatera Selatan",
        path: "M 200 200 L 250 200 L 250 250 L 200 250 Z",
      },
      {
        "hc-key": "id-kb",
        name: "Kalimantan Barat",
        path: "M 300 150 L 350 150 L 350 200 L 300 200 Z",
      },
      {
        "hc-key": "id-kt",
        name: "Kalimantan Tengah",
        path: "M 350 150 L 400 150 L 400 200 L 350 200 Z",
      },
      {
        "hc-key": "id-ks",
        name: "Kalimantan Selatan",
        path: "M 350 200 L 400 200 L 400 250 L 350 250 Z",
      },
      {
        "hc-key": "id-ki",
        name: "Kalimantan Timur",
        path: "M 400 120 L 450 120 L 450 180 L 400 180 Z",
      },
      {
        "hc-key": "id-sl",
        name: "Sulawesi",
        path: "M 500 150 L 580 150 L 580 250 L 500 250 Z",
      },
      {
        "hc-key": "id-ba",
        name: "Bali",
        path: "M 530 240 L 560 240 L 560 260 L 530 260 Z",
      },
      {
        "hc-key": "id-nb",
        name: "Nusa Tenggara Barat",
        path: "M 560 240 L 590 240 L 590 260 L 560 260 Z",
      },
      {
        "hc-key": "id-nt",
        name: "Nusa Tenggara Timur",
        path: "M 590 240 L 620 240 L 620 260 L 590 260 Z",
      },
      {
        "hc-key": "id-pa",
        name: "Papua",
        path: "M 650 200 L 750 200 L 750 300 L 650 300 Z",
      },
      {
        "hc-key": "id-ma",
        name: "Maluku",
        path: "M 600 150 L 650 150 L 650 200 L 600 200 Z",
      },
    ];

    const chartOptions: Highcharts.Options = {
      chart: {
        map: indonesiaMapData as any,
        backgroundColor: "transparent",
        height: 400,
      },
      title: {
        text: title,
        style: {
          fontSize: "16px",
          fontWeight: "600",
          color: "#1f2937",
        },
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: "bottom",
        },
      },
      colorAxis: {
        min: 0,
        minColor: "#e0f2fe",
        maxColor: "#0369a1",
        labels: {
          style: {
            color: "#6b7280",
            fontSize: "12px",
          },
        },
      },
      legend: {
        align: "right",
        verticalAlign: "middle",
        layout: "vertical",
        itemStyle: {
          fontSize: "12px",
          color: "#6b7280",
        },
      },
      series: [
        {
          type: "map",
          name: "Jumlah Project",
          data: data,
          borderColor: "#e5e7eb",
          borderWidth: 1,
          states: {
            hover: {
              color: "#1d4ed8",
              borderColor: "#1e40af",
              borderWidth: 2,
            },
          },
          dataLabels: {
            enabled: true,
            format: "{point.value}",
            style: {
              fontSize: "10px",
              fontWeight: "bold",
              color: "#ffffff",
              textOutline: "1px contrast",
            },
          },
          tooltip: {
            pointFormat:
              "<b>{point.name}</b><br/>Jumlah Project: <b>{point.value}</b><br/>Projects: {point.projects}",
          },
        } as any,
      ],
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
    };

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    chartInstance.current = Highcharts.mapChart(chartRef.current, chartOptions);

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
