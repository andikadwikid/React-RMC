import React, { useEffect, useRef, useState } from "react";

// Define types for the component
interface MapDataPoint {
  0: string; // region code
  1: number; // value
}

interface TopologyData {
  [key: string]: any;
}

declare global {
  interface Window {
    Highcharts: any;
  }
}

const IndonesiaMapChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load Highcharts scripts dynamically
    const loadHighchartsScripts = async () => {
      // Load main Highmaps library
      if (!window.Highcharts) {
        const highmapsScript = document.createElement("script");
        highmapsScript.src = "https://code.highcharts.com/maps/highmaps.js";
        highmapsScript.async = true;
        document.head.appendChild(highmapsScript);

        await new Promise((resolve) => {
          highmapsScript.onload = resolve;
        });
      }

      // Load exporting module
      if (!window.Highcharts.exporting) {
        const exportingScript = document.createElement("script");
        exportingScript.src =
          "https://code.highcharts.com/maps/modules/exporting.js";
        exportingScript.async = true;
        document.head.appendChild(exportingScript);

        await new Promise((resolve) => {
          exportingScript.onload = resolve;
        });
      }

      return window.Highcharts;
    };

    const initializeChart = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load Highcharts
        const Highcharts = await loadHighchartsScripts();

        // Fetch topology data with error handling
        let topology: TopologyData;
        try {
          const response = await fetch(
            "https://code.highcharts.com/mapdata/countries/id/id-all.topo.json",
            {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          topology = await response.json();
        } catch (fetchError) {
          console.error("Failed to fetch map topology data:", fetchError);
          // Use a simple fallback topology that will allow the chart to render with basic data
          topology = {
            type: "Topology",
            objects: {
              "id-all": {
                type: "GeometryCollection",
                geometries: data.map((item, index) => ({
                  type: "Polygon",
                  properties: {
                    "hc-key": item[0],
                    "hc-a2": item[0].toUpperCase(),
                    name: `Province ${index + 1}`
                  },
                  coordinates: [[[100 + index * 2, -5 + index * 0.5], [101 + index * 2, -5 + index * 0.5], [101 + index * 2, -4 + index * 0.5], [100 + index * 2, -4 + index * 0.5], [100 + index * 2, -5 + index * 0.5]]]
                }))
              }
            },
            arcs: [],
            bbox: [95, -11, 141, 6],
            transform: {
              scale: [0.001, 0.001],
              translate: [95, -11]
            }
          };
        }

        // Prepare demo data
        const data: MapDataPoint[] = [
          ["id-3700", 10],
          ["id-ac", 11],
          ["id-jt", 12],
          ["id-be", 13],
          ["id-bt", 14],
          ["id-kb", 15],
          ["id-bb", 16],
          ["id-ba", 17],
          ["id-ji", 18],
          ["id-ks", 19],
          ["id-nt", 20],
          ["id-se", 21],
          ["id-kr", 22],
          ["id-ib", 23],
          ["id-su", 24],
          ["id-ri", 25],
          ["id-sw", 26],
          ["id-ku", 27],
          ["id-la", 28],
          ["id-sb", 29],
          ["id-ma", 30],
          ["id-nb", 31],
          ["id-sg", 32],
          ["id-st", 33],
          ["id-pa", 34],
          ["id-jr", 35],
          ["id-ki", 36],
          ["id-1024", 37],
          ["id-jk", 38],
          ["id-go", 39],
          ["id-yo", 40],
          ["id-sl", 41],
          ["id-sr", 42],
          ["id-ja", 43],
          ["id-kt", 44],
        ];

        // Create the chart
        if (chartRef.current) {
          chartInstance.current = Highcharts.mapChart(chartRef.current, {
            chart: {
              map: topology,
            },

            title: {
              text: "Distribusi Project Data di Indonesia",
            },

            mapNavigation: {
              enabled: true,
              buttonOptions: {
                verticalAlign: "bottom",
              },
            },

            colorAxis: {
              min: 0,
            },

            series: [
              {
                data: data,
                name: "Project Data",
                states: {
                  hover: {
                    color: "#BADA55",
                  },
                },
                dataLabels: {
                  enabled: true,
                  format: "{point.name}",
                },
              },
            ],
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing chart:", error);
        // Still set loading to false so the chart container is visible
        setIsLoading(false);
        // Try to show a basic chart or message in the chart container
        if (chartRef.current) {
          chartRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full bg-gray-50 rounded border border-gray-200">
              <div class="text-center p-4">
                <p class="text-gray-600 mb-2">Peta Indonesia tidak dapat dimuat</p>
                <p class="text-sm text-gray-500">Gagal memuat library atau data peta</p>
              </div>
            </div>
          `;
        }
      }
    };

    initializeChart();

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full h-full">
      {isLoading && (
        <div className="flex items-center justify-center h-96 min-h-96 absolute inset-0 bg-white bg-opacity-80 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Memuat peta Indonesia...</p>
          </div>
        </div>
      )}
      <div
        ref={chartRef}
        className="w-full h-96 min-h-96"
        style={{ minHeight: "400px" }}
      />
    </div>
  );
};

export default IndonesiaMapChart;
