import { Tab } from "@headlessui/react";
import { ReactNode, type Dispatch, type SetStateAction } from "react";
import { twMerge } from "tailwind-merge";

type TabsProps = {
  selectedIndex: number;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
  tabs: {
    name: string;
    content: ReactNode;
  }[];
};

const Tabs = ({ selectedIndex, setSelectedIndex, tabs }: TabsProps) => {
  return (
    <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
      <Tab.List className="mx-auto flex w-full max-w-xs space-x-2 rounded-md p-1">
        {tabs.map((tab) => (
          <Tab
            key={tab.name}
            className={twMerge(
              "w-full rounded-md bg-gray-600 py-2.5 text-sm font-medium leading-5 text-gray-100",
              "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-800 focus:outline-none focus:ring-1",
              "ui-selected:bg-blue-600 ui-selected:shadow",
              "ui-not-selected:text-blue-100 ui-not-selected:hover:bg-gray-600/80 ui-not-selected:hover:text-white"
            )}
          >
            {tab.name}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mx-auto mt-2 w-full max-w-xl">
        {tabs.map((tab) => (
          <Tab.Panel
            key={tab.name}
            className={twMerge("rounded-md p-1 focus:outline-none")}
          >
            {tab.content}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default Tabs;
