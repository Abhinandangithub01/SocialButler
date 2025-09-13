import React, { useState } from 'react';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 p-1 bg-base-300/60 rounded-lg">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            className={`flex-1 text-center py-2 px-4 font-medium transition-all duration-300 rounded-md ${
              activeTabIndex === index
                ? 'bg-base-100 text-text-primary shadow'
                : 'text-text-secondary hover:text-text-primary'
            }`}
            onClick={() => setActiveTabIndex(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-2">
        {tabs[activeTabIndex].content}
      </div>
    </div>
  );
};

export default Tabs;
