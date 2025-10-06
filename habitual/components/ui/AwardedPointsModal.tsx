"use client";

import { Box, Button, Text } from "@chakra-ui/react";
import { IoCloseOutline } from "react-icons/io5";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);

export default function AwardedPointsModal({
  onClose,
  points,
}: {
  onClose: () => void;
  points: number;
}) {
  console.log(points);
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
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
      <Text
        className="flex h-3/5 items-center justify-center"
        style={{ fontSize: "24px", textAlign: "center" }}
      >
        Congratulations you have earned {points} points! Keep up the good work!
      </Text>
      <div className="flex justify-center items-end">
        <Button
          variant={"plain"}
          _active={{ color: "white" }}
          onClick={onClose}
          style={{ marginBottom: 32, fontSize: "large" }}
        >
          Dismiss
        </Button>
      </div>
    </MotionBox>
  );
}
