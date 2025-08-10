"use client";

import { addAction } from "@/lib/actions";
import {
  Button,
  Input,
  NumberInput,
  Stack,
  Select,
  createListCollection,
  Portal,
} from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const categories = createListCollection({
  items: [
    { label: "Workouts", value: "Workouts" },
    { label: "Chores", value: "Chores" },
    { label: "Writings", value: "Writings" },
    { label: "Crafts", value: "Crafts" },
    { label: "Good Habits", value: "Good Habits" },
  ],
});

export default function AddData() {
  const [type, setType] = useState(categories.items[0].value);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState("");

  console.log(type);

  const handleAddAction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const action = formData.get("action")?.toString().trim();
    const reward = Number(formData.get("reward"));

    if (!type || !action || Number.isNaN(reward)) {
      return;
    }

    try {
      await addAction(type, action, reward);
      setAlert("Action added successfully");
      setTimeout(() => {
        setAlert("");
      }, 3000);
      setLoading(false);
    } catch (error) {
      console.warn(error);
      setAlert(`There was an error adding this action: ${error}`);
      setTimeout(() => {
        setAlert("");
      });
      setLoading(false);
      return;
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen h-full w-full relative">
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
      <form onSubmit={handleAddAction} className="w-11/12 h-1/2">
        <Stack>
          <Select.Root
            collection={categories}
            variant={"subtle"}
            onValueChange={(e) => setType(e.value[0])}
          >
            <Select.HiddenSelect />
            <Select.Label />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select category" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {categories.items.map((item) => (
                    <Select.Item item={item} key={item.value}>
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
          <Input variant={"subtle"} name="action" placeholder="Action" />
          <NumberInput.Root step={5}>
            <NumberInput.Control />
            <NumberInput.Input name="reward" placeholder="Reward" />
          </NumberInput.Root>
          <Button type="submit" loading={loading} loadingText="Adding action">
            Add Action
          </Button>
        </Stack>
      </form>
    </main>
  );
}
