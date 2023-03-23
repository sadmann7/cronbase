import { Tab } from "@headlessui/react";
import { type Dispatch, type SetStateAction } from "react";
import { twMerge } from "tailwind-merge";

type TabsProps = {
  selectedIndex: number;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
  tabs: {
    name: string;
    content: JSX.Element;
  }[];
};

const Tabs = ({ selectedIndex, setSelectedIndex, tabs }: TabsProps) => {
  return (
    <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
      <Tab.List className="mx-auto flex w-full max-w-[250px] space-x-1 rounded-md bg-gray-700 p-1">
        {tabs.map((tab) => (
          <Tab
            key={tab.name}
            className={twMerge(
              "w-full rounded-sm py-2 px-2 text-sm font-medium leading-5 text-gray-100",
              "ring-gray-400 ring-offset-1 ring-offset-gray-800 focus:outline-none focus:ring-1",
              "ui-selected:bg-gray-900 ui-selected:shadow",
              "ui-not-selected:text-blue-100 ui-not-selected:hover:bg-white/[0.12] ui-not-selected:hover:text-white"
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
            className={twMerge(
              "w-full rounded-md p-1",
              "ring-gray-900/5 ring-offset-1 ring-offset-gray-900/5 focus:outline-none focus:ring-1"
            )}
          >
            {tab.content}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default Tabs;
