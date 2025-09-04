"use client";

import { Button } from "@chakra-ui/react";
import {
  useMotionValue,
  animate,
  AnimatePresence,
  motion,
} from "framer-motion";
import { useState, useEffect } from "react";
import { IoPencilOutline, IoTrashOutline } from "react-icons/io5";
import RedeemButton from "./RedeemButton";
import { Incentives } from "@/lib/definitions";

const OPEN_X = 105;

export default function RewardCard({onRedeem, item, points}:{onRedeem: () => void; item: Incentives, points: number}) {
  const [isOpen, setIsOpen] = useState(false);
  const x = useMotionValue(0);

  // Snap animation whenever isOpen changes
  useEffect(() => {
    animate(x, isOpen ? -OPEN_X : 0, {
      type: "spring",
      stiffness: 300,
      damping: 28,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <div
      className="relative overflow-hidden w-full snap-x "
      style={{ marginInline: "8px" }}
    >
      {/* Background buttons */}
      {isOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ bounce: .5}}
            className="absolute top-0 right-0 flex items-center gap-1 h-full -z-10"
          >
            <Button size="sm" colorPalette="blue" h={"80%"}>
              <IoPencilOutline />
            </Button>
            <Button size="sm" colorPalette="red" h={"80%"} w={46} p={1}>
              <IoTrashOutline />
            </Button>
          </motion.div>
        </AnimatePresence>
      )}
      <motion.div
        drag="x"
        style={{ x, paddingInline: '8px' }}
        dragElastic={0.5}
        dragSnapToOrigin
        dragConstraints={{ left: -OPEN_X, right: 0 }}
        onDragEnd={(e, info) => {
          const shouldOpen =
            info.offset.x < -OPEN_X / 2 || info.velocity.x < -200;
          setIsOpen(shouldOpen);
        }}
        className={`${
          points >= item.cost ? "bg-gray-100" : "bg-gray-300 opacity-50"
        } w-full h-16 rounded-sm flex justify-between items-center shadow z-10`}
      >
        <div
          className="flex flex-wrap"
          style={{ fontSize: "small", color: "gray" }}
        >
          <h3 className="w-full" style={{ fontSize: "medium", color: "black" }}>
            {item.title}
          </h3>
          {item.cost}pts
        </div>
        <RedeemButton
          item={item}
          onRedeem={onRedeem}
          disabled={points < item.cost}
        />
      </motion.div>
    </div>
  );
}
