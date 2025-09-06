"use client";

import { Button, Input } from "@chakra-ui/react";
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
import { supabase } from "@/lib/supabaseClient";

const OPEN_X = 108;

export default function RewardCard({
  onRedeem,
  item,
  points,
}: {
  onRedeem: () => void;
  item: Incentives;
  points: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [rewardTitle, setRewardTitle] = useState("");
  const [rewardCost, setRewardCost] = useState<number>();
  const [edit, setEdit] = useState(false);
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

  const handleEdit = async (id: number) => {
    const { error } = await supabase
      .from("incentives")
      .update({ title: rewardTitle, cost: rewardCost })
      .eq("id", id)
      .select();

    if (error) {
      console.error("There was an error editing this reward", error);
    }
    setEdit(false);
    setIsOpen(false);
  };

  const handleDelete = async (id: number) => {

    const { error } = await supabase
    .from('incentives')
    .delete()
    .eq('id', id)

    if (error) {
      console.error('there was an error deleting this reward', error)
    }
  }

  return (
    <div
      className="relative overflow-hidden w-full snap-x rounded-md"
      style={{ marginInline: "8px" }}
    >
      {/* Background buttons */}
      {isOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ bounce: 0.5 }}
            className="absolute top-0 right-0 flex items-center gap-2 h-full"
          >
            <Button
              size="sm"
              colorPalette="blue"
              h={"80%"}
              className="cursor-pointer"
              onClick={() => {
                setEdit(true);
                setIsOpen(false);
              }}
            >
              <IoPencilOutline />
            </Button>
            <Button size="sm" colorPalette="red" h={"80%"} w={46} p={1}
            onClick={() => {
                handleDelete(item.id);
                setIsOpen(false);
              }}>
              <IoTrashOutline />
            </Button>
          </motion.div>
        </AnimatePresence>
      )}
      <motion.div
        drag="x"
        style={{ x, paddingInline: "8px" }}
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
        } w-full ${edit ? 'h-40' : 'h-16'} rounded-sm flex justify-between items-center shadow z-10`}
      >
        {edit ? (
          <div
            className="flex flex-wrap gap-2 w-full justify-end"
            style={{ fontSize: "small", paddingInline: 8 }}
          >
            <div className="flex flex-wrap gap-2">
              <Input
                variant={"subtle"}
                onChange={(e) => setRewardTitle(e.currentTarget.value)}
                placeholder="Title"
              ></Input>
              <Input
                variant={"subtle"}
                onChange={(e) => setRewardCost(Number(e.currentTarget.value))}
                placeholder="Cost"
              ></Input>
            </div>
            <Button onClick={() => handleEdit(item.id)} colorPalette={"green"}>
              Confirm
            </Button>
            <Button onClick={() => setEdit(false)} colorPalette={"red"}>
              Cancel
            </Button>
          </div>
        ) : (
          <div
            className="flex flex-wrap gap-2 w-full justify-between"
            style={{ fontSize: "small", paddingInline: 8 }}
          >
            <div
              className="flex flex-wrap"
              style={{ fontSize: "small", color: "gray" }}
            >
              <h3
                className="w-full"
                style={{ fontSize: "medium", color: "black" }}
              >
                {item.title}
              </h3>
              {item.cost}pts
            </div>
            <RedeemButton
              item={item}
              onRedeem={onRedeem}
              disabled={points < item.cost}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}
