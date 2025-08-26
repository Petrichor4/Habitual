"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Actions from "./Actions";
import Rewards from "./Rewards";

const tabs = ['Actions','Rewards'];
const sessionStorageKey = "selected-tab";

export default function Tab({points, refresh}:{points: number, refresh: () => void}) {
  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  useEffect(() => {
    const savedTab = sessionStorage.getItem(sessionStorageKey);
    if (savedTab && tabs.includes(savedTab)) {
      setSelectedTab(savedTab);
    } else {
      setSelectedTab("Actions");
    }
  }, []);

  useEffect(() => {
    if (selectedTab && tabs.includes(selectedTab)) {
      sessionStorage.setItem(sessionStorageKey, selectedTab);
    }
  }, [selectedTab]);

  if (!selectedTab) return null;

  return (
    <>
      <main className="flex justify-center">
        <section className="content flex flex-wrap justify-center w-full max-w-[600px]">
          <ul className="flex justify-around items-center h-10 w-4/5">
            {tabs.map((tab) => (
              <motion.li
                key={tab}
                className="relative cursor-pointer flex-1 text-center text-sm lg:text-xl"
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
                {tab === selectedTab ? (
                  <motion.div
                    className="absolute -bottom-[8px] left-0 right-0 h-[3px] bg-black dark:bg-white"
                    layoutId="underline"
                  />
                ) : null}
              </motion.li>
            ))}
          </ul>
          <span className="h-[1px] w-4/5 bg-black dark:bg-white rounded"></span>
          <div className="w-full">
            {selectedTab === 'Actions' && <Actions />}
            {selectedTab === 'Rewards' && <Rewards refresh={refresh} points={points} /> }
          </div>
        </section>
      </main>
    </>
  );
}
