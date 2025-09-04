"use client";

import { Box } from "@chakra-ui/react";
import { IoCloseOutline } from "react-icons/io5";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box)

export default function AwardedPointsModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <MotionBox
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        exit={{opacity: 0, y: 20}}
        transition={{duration: .5}}
      className="fixed top-1/3 -translate-x-1/2 left-1/2 -translate-y-1/3 rounded-2xl bg-blue-100 h-[280px] w-[93%] z-20"
      style={{ border: "solid 1px #c4dafb" }}
    >
      <div className="flex justify-end">
        <button onClick={onClose} style={{ padding: "16px" }}>
          <IoCloseOutline
            className="hover:cursor-pointer"
            size={30}
            color="darkblue"
          />
        </button>
      </div>
    </MotionBox>
  );
}
