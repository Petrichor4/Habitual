"use client";

import { Button, Input, NumberInput, Stack } from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Action, Category } from "@/lib/definitions";
import { supabase } from "@/lib/supabaseClient";
import GetUser from "./GetUser";

export default function ActionForm({
  edit,
  action,
  onCancel,
  category,
}: {
  edit: boolean;
  action?: Action;
  onCancel?: () => void;
  category?: Category;
}) {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState("");
  const [actionTitle, setActionTitle] = useState(action?.title ?? "");
  const [reward, setReward] = useState(action?.reward ?? 0);
  const categoryId = category?.id;
  const { user } = GetUser();

  const handleAddAction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!actionTitle || Number.isNaN(reward)) {
      setAlert("All feilds are required");
      setTimeout(() => {
        setAlert("");
      }, 3000);
      setLoading(false);
      return;
    }

    // Step 1: Create the action
    const { data: newAction } = await supabase
      .from("actions")
      .insert([{ user_id: user?.id, category_id: categoryId, title: actionTitle, reward }])
      .select()
      .single();
    console.log(newAction);
    if (Error) {
      console.error(Error);
      setLoading(false);
    }

    console.log(newAction);

    setLoading(false);
    if (onCancel) {
      onCancel();
    }
  };

  const handleEdit = async () => {
    const { error } = await supabase
      .from("actions")
      .update({ categoryId, title: actionTitle, reward })
      .eq("id", action?.id);
    if (error) return console.warn(error);
    if (onCancel) onCancel();
  };

  return (
    <main className="flex justify-center items-center h-fit w-full">
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-2 w-[300px] h-[100px] bg-black text-white text-3xl z-10 rounded shadow flex justify-center items-center"
          >
            {alert}
          </motion.div>
        )}
      </AnimatePresence>
      <form
        onSubmit={handleAddAction}
        className={`w-full h-fit sm:w-[600px] sm:[position-inherit] bg-[#17171b] `}
        style={{ padding: "8px" }}
      >
        <Stack>
          <Input
            variant={"flushed"}
            onChange={(e) => setActionTitle(e.currentTarget.value)}
            placeholder="Action"
            defaultValue={action?.title}
          />
          <NumberInput.Root step={5} variant={"flushed"}>
            <NumberInput.Control />
            <NumberInput.Input
              onChange={(e) => setReward(Number(e.currentTarget.value))}
              placeholder="Reward"
              defaultValue={action?.reward}
            />
          </NumberInput.Root>
          <div className="flex gap-2">
            <Button type="button" className="flex-1" onClick={onCancel}>
              Cancel
            </Button>
            {edit ? (
              <Button
                type="button"
                className="flex-1"
                loading={loading}
                loadingText="Submitting edit"
                onClick={handleEdit}
              >
                Edit Action
              </Button>
            ) : (
              <Button
                className="flex-1"
                type="submit"
                loading={loading}
                loadingText="Adding action"
              >
                Add Action
              </Button>
            )}
          </div>
        </Stack>
      </form>
    </main>
  );
}
