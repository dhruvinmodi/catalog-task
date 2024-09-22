import { clsx } from "clsx";
import React, { FC, ReactNode, useState } from "react";

export interface ITab {
  key: string;
  title: string;
  content: () => ReactNode;
}

interface ITabProps {
  tabs: ITab[];
  activeTabKey: string;
  onChange?: () => {};
}

const Tab: FC<ITabProps> = ({ tabs, activeTabKey }) => {
  const [activeTab, setActiveTab] = useState(
    tabs.find((tab) => tab.key === activeTabKey) || tabs[0]
  );
  const style = clsx({
    "inline-block p-4 border-b-2 border-transparent rounded-t-lg pb-4": true,
  });
  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-start items-start text-sm font-medium text-center text-gray-500 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          {tabs.map((tab) => (
            <li onClick={() => setActiveTab(tab)} key={tab.key}>
              <div
                className={`${style} ${
                  tab.key === activeTab.key
                    ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                    : "hover:text-gray-600 hover:border-gray-300 cursor-pointer"
                }`}
              >
                {tab.title}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>{activeTab.content()}</div>
    </div>
  );
};

export default Tab;
