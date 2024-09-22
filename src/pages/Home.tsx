import React, { FC, useContext } from "react";
import Tab, { ITab } from "../components/Tab";
import { ColorType, DeepPartial, TimeChartOptions } from "lightweight-charts";
import { DataContext } from "../contexts/DataProvider";
import Chart from "../components/Chart";

interface IHomeProps {}

const Home: FC<IHomeProps> = ({}) => {
  const { realTimeData } = useContext(DataContext);

  const chartConfig: DeepPartial<TimeChartOptions> = {
    width: 1000,
    height: 500,
    watermark: { visible: false },
    grid: {
      horzLines: { visible: false },
    },
    crosshair: {
      mode: 1,
    },
    layout: {
      background: { type: ColorType.Solid, color: "#FFFFFF" },
      textColor: "#FFFFFF",
      fontSize: 24,
      fontFamily: "Roboto",
    },
  };

  const tabs: ITab[] = [
    {
      key: "summary",
      title: "Summary",
      content: () => <div>Summary tab content</div>,
    },
    {
      key: "chart",
      title: "Chart",
      content: () => (
        <Chart
          config={chartConfig}
          lineColor="#4b40ee"
          areaTopColor="rgba(75, 64, 238, 0.2)"
          areaBottomColor="rgba(75, 64, 238, 0)"
        />
      ),
    },
    {
      key: "statistic",
      title: "Statistic",
      content: () => <div>Statistic tab content</div>,
    },
    {
      key: "anlytics",
      title: "Analytics",
      content: () => <div>Analytics tab content</div>,
    },
    {
      key: "settings",
      title: "Settings",
      content: () => <div>Settings tab content</div>,
    },
  ];
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col">
        <div className="flex flex-col pt-12 px-6 pb-3 gap-4">
          <div className="flex">
            <p className="flex text-6xl font-medium">
              {realTimeData?.value || 0}
            </p>
            <p className="flex mt-1 text-[#BDBEBF] font-bold">USD</p>
          </div>
          <div className="text-[#67BF6B] text-lg">+ 2,161.42 (3.54%)</div>
        </div>
        <div className="flex px-6 pb-6 pt-3">
          <Tab tabs={tabs} activeTabKey={"chart"} />
        </div>
      </div>
    </div>
  );
};

export default Home;
