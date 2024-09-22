import { AreaData, HistogramData, Time } from "lightweight-charts";
import React, {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useState,
} from "react";
import {
  generateSingleData,
  TimeFrame,
  toArea,
  toHistogram,
} from "../components/Chart/mocks/data";
import axios from "axios";

interface IDataContext {
  dataFetched: boolean;
  isLoading: boolean;
  realTimeData?: AreaData<Time>;
  setRealTimeData?: (data: AreaData<Time>) => void;
  getPastData: (intervalOption: TimeFrame) => Promise<{
    areaSeriesData: AreaData<Time>[];
    histogramSeriesData: HistogramData<Time>[];
  }>;
}

export const DataContext = createContext<IDataContext>({
  dataFetched: false,
  isLoading: false,
  getPastData: (intervalOption: TimeFrame) =>
    new Promise(() => ({ areaSeriesData: [], histogramSeriesData: [] })),
});

interface IDataProviderProps {
  children: ReactNode;
}

const DataProvider: FC<IDataProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const realTimeDataGenerator = generateSingleData(61000, 62000);
  const [realTimeData, setRealTimeData] = useState<AreaData<Time>>(
    realTimeDataGenerator.next().value
  );

  const getPastData = async (intervalOption: TimeFrame) => {
    setIsLoading(true);
    let areaSeriesData: AreaData<Time>[] = [];
    let histogramSeriesData: HistogramData<Time>[] = [];
    const functionsMppings: Record<TimeFrame, string> = {
      "1d": "DIGITAL_CURRENCY_DAILY",
      "3d": "DIGITAL_CURRENCY_DAILY",
      "1w": "DIGITAL_CURRENCY_WEEKLY",
      "1m": "DIGITAL_CURRENCY_WEEKLY",
      "6m": "DIGITAL_CURRENCY_MONTHLY",
      "1y": "DIGITAL_CURRENCY_MONTHLY",
    };
    const response = await axios.get("https://www.alphavantage.co/query", {
      params: {
        function: functionsMppings[intervalOption],
        symbol: "BTC",
        market: "EUR",
        apikey: "demo",
      },
    });

    let data = [];
    if (intervalOption === "1d" || intervalOption === "3d") {
      data = response.data["Time Series (Digital Currency Daily)"];
    } else if (intervalOption === "1w" || intervalOption === "1m") {
      data = response.data["Time Series (Digital Currency Weekly)"];
    } else if (intervalOption === "6m" || intervalOption === "1y") {
      data = response.data["Time Series (Digital Currency Monthly)"];
    }

    if (data) {
      areaSeriesData = toArea(data);
      histogramSeriesData = toHistogram(data);
    }

    setIsLoading(false);
    setDataFetched(true);

    return { areaSeriesData, histogramSeriesData };
  };

  useEffect(() => {
    // Real time update
    const interval = setInterval(() => {
      setRealTimeData(realTimeDataGenerator.next().value);
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  return (
    <DataContext.Provider
      value={{
        isLoading,
        dataFetched,
        realTimeData,
        setRealTimeData,
        getPastData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
