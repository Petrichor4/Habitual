"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Actions from "./Actions";
import Rewards from "./Rewards";
import { Box, Span } from "@chakra-ui/react";

const tabIds = ["actions", "rewards"] as const;
type TabId = (typeof tabIds)[number];

let tabs: { id: TabId; label: string }[] = [
  { id: "actions", label: "Actions" },
  { id: "rewards", label: "Rewards" },
];

const sessionStorageKey = "selected-tab";

export default function Tab({
  points,
  refresh,
}: {
  points: number;
  refresh: () => void;
}) {
  const [selectedTab, setSelectedTab] = useState<TabId>("actions");
  const MotionBox = motion.create(Box);
  const MotionSpan = motion.create(Span);

  useEffect(() => {
    const savedTab = sessionStorage.getItem(sessionStorageKey);
    if (savedTab === "actions" || savedTab === "rewards") {
      setSelectedTab(savedTab);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(sessionStorageKey, selectedTab);
    console.log(selectedTab)
  }, [selectedTab]);

  if (!selectedTab) return null;

  return (
    <>
      <main className="flex justify-center">
        <section className="content flex flex-wrap justify-center w-full max-w-[600px]">
          <div className="flex justify-center w-[80%]">
            {tabs.map((tab) => (
              <button 
              key={tab.id} 
              onClick={() => setSelectedTab(tab.id)} 
              style={{paddingInline: 16, paddingBlock: 6}}
              className={`${selectedTab === tab.id ? "" : "hover:cursor-pointer" } relative rounded-full w-40`}>
                {selectedTab === tab.id && (
                  <motion.div layoutId="pill" className="absolute inset-0 bg-[#17171b]" style={{borderRadius: 9999}} />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
          <div className="w-full">
            {selectedTab === "actions" && <Actions />}
            {selectedTab === "rewards" && (
              <Rewards refresh={refresh} points={points} />
            )}
          </div>
        </section>
      </main>
    </>
  );
}
