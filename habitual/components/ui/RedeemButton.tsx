'use client'

import { Incentives } from "@/lib/definitions";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function RedeemButton({
  onRedeem,
  disabled,
  item,
}: {
  onRedeem: () => void;
  disabled?: boolean;
  item: Incentives;
}) {
  const [tap, setTap] = useState(false);
  const [confirmRedemption, setConfirmRedemption] = useState(false);

  return (
    <button
      className="action-button relative hover:cursor-pointer"
      onTouchStart={() => setTap(true)}
      onTouchEnd={() => setTap(false)}
      onClick={(e) => {
        e.stopPropagation();
        setConfirmRedemption(true);
      }}
      disabled={disabled}
    >
      Redeem
      <AnimatePresence>
        {tap && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1.2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bg-gray-400/70 size-13 -bottom-[60%] left-[7%] rounded-full"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {confirmRedemption && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-1/3 -translate-y-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[160px] bg-gray-100/90 text-black z-30 rounded shadow flex flex-wrap justify-center items-center text-center gap-x-12"
          >
            Are you sure that you want to redeem {item.cost}pts for {item.title}
            ?
            <a
              style={{ fontSize: "medium", color: "red" }}
              onClick={(e) => {
                e.stopPropagation();
                setConfirmRedemption(false);
              }}
              className="hover:cursor-pointer"
            >
              Cancel
            </a>
            <a
              style={{ fontSize: "medium", color: "green" }}
              onClick={(e) => {
                e.stopPropagation();
                onRedeem();
                setConfirmRedemption(false);
              }}
              className="hover:cursor-pointer"
            >
              Confirm
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}