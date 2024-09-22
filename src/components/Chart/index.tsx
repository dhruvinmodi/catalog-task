import {
  createChart,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  Time,
  TimeChartOptions,
} from "lightweight-charts";
import React, {
  FC,
  LegacyRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { TimeFrame } from "./mocks/data";
import { DataContext } from "../../contexts/DataProvider";
import { clsx } from "clsx";

interface IChartProps {
  config: DeepPartial<TimeChartOptions>;
  lineColor: string;
  areaTopColor: string;
  areaBottomColor: string;
}

const Chart: FC<IChartProps> = ({
  config,
  lineColor,
  areaTopColor,
  areaBottomColor,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>();
  const [intervalOption, setIntervalOption] = useState<TimeFrame>("1d");
  const { realTimeData, isLoading, dataFetched, getPastData } =
    useContext(DataContext);
  const chartRef = useRef<IChartApi | null>(null);
  const areaSeriesRef = useRef<ISeriesApi<"Area", Time> | null>(null);
  const histogramSeriesRef = useRef<ISeriesApi<"Histogram", Time> | null>(null);
  const [fullScreen, setFullScreen] = useState<boolean>(false);

  // chart initialization
  useEffect(() => {
    if (!dataFetched) return;

    // Resize
    const handleResize = () => {
      chartRef.current?.applyOptions({
        width: chartContainerRef.current?.clientWidth,
      });
    };

    // Create chart
    chartRef.current = createChart(chartContainerRef.current!, config);
    chartRef.current.timeScale().fitContent();

    // area series
    areaSeriesRef.current = chartRef.current.addAreaSeries({
      lineColor,
      topColor: areaTopColor,
      bottomColor: areaBottomColor,
      lineWidth: 2,
    });
    // histogram series
    histogramSeriesRef.current = chartRef.current.addHistogramSeries({
      color: "#e7e9ec",
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "", // set as an overlay by setting a blank priceScaleId
    });
    histogramSeriesRef.current.priceScale().applyOptions({
      // set the positioning of the volume series
      scaleMargins: {
        top: 0.7, // highest point of the series will be 70% away from the top
        bottom: 0,
      },
    });

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartRef.current?.remove();
    };
  }, [
    config,
    lineColor,
    areaTopColor,
    areaBottomColor,
    intervalOption,
    dataFetched,
  ]);

  useEffect(() => {
    chartRef.current?.applyOptions({
      width: document.getElementById("chart-container")?.clientWidth,
      height: document.getElementById("chart-container")?.clientHeight,
    });
  }, [fullScreen]);

  // chart data initialization
  useEffect(() => {
    getPastData(intervalOption).then((response) => {
      const { areaSeriesData, histogramSeriesData } = response;
      areaSeriesRef.current?.setData(areaSeriesData);
      histogramSeriesRef.current?.setData(histogramSeriesData);
      chartRef.current?.timeScale().fitContent();
    });
  }, [intervalOption, dataFetched]);

  // adding realtime series data
  useEffect(() => {
    if (!isLoading && dataFetched) {
      areaSeriesRef.current?.update(realTimeData!);
    }
  }, [realTimeData, isLoading, dataFetched]);

  const timeFrameOptions = ["1d", "3d", "1w", "1m", "6m", "1y"] as TimeFrame[];

  const style = clsx({
    "flex flex-col gap-16 relative w-[1000px] h-[500px]": true,
    "!fixed !w-[calc(100vw-90px)] !h-[calc(100vh-90px)] !top-0 !left-0 bg-white m-10":
      fullScreen,
  });

  return (
    <div id="chart-container" className={style}>
      <div className="flex justify-between w-3/4">
        <div className="flex gap-2">
          <button
            className="text-neutral-500 hover:bg-neutral-50 rounded p-2 hover:shadow flex gap-4"
            onClick={() => setFullScreen(!fullScreen)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 3H21V9"
                stroke="#6F7177"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9 21H3V15"
                stroke="#6F7177"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M21 3L14 10"
                stroke="#6F7177"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M3 21L10 14"
                stroke="#6F7177"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {fullScreen ? "Minimize" : "Fullscreen"}
          </button>
          <button className="text-neutral-500 hover:bg-neutral-50 rounded p-2 hover:shadow flex gap-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="#6F7177"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 8V16"
                stroke="#6F7177"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8 12H16"
                stroke="#6F7177"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Compare
          </button>
        </div>

        <ul className="flex gap-4">
          {timeFrameOptions.map((value) => (
            <li
              key={value}
              className={`text-neutral-500 px-4 py-2 rounded-lg ${
                value === intervalOption
                  ? "bg-[#4b40ee] text-white"
                  : "cursor-pointer hover:bg-neutral-50 hover:shadow"
              }`}
              onClick={() => setIntervalOption(value)}
            >
              {value}
            </li>
          ))}
        </ul>
      </div>
      <div
        className={`${dataFetched || !isLoading ? "opacity-100" : "opacity-0"}`}
        ref={chartContainerRef as LegacyRef<HTMLDivElement>}
      />
      {(!dataFetched || isLoading) && (
        <div className="absolute top-16 text-center w-full">loading...</div>
      )}
    </div>
  );
};

export default Chart;
