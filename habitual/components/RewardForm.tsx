import { supabase } from "@/lib/supabaseClient";
import { Button, Input, NumberInput, Stack } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useState } from "react";

export default function RewardForm({ onCancel }:{ onCancel: () => void }) {
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState('');

  const handleAddReward = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("incentives")
      .insert([{ title, cost }]);
    if (error) {
      console.error(error);
      if (error.code === '23502') {
        setAlert('All fields are required')
      }
      setTimeout(()=>{
        setAlert('')
      }, 3000)
      setLoading(false);
      return;
    }
    setLoading(false);
    onCancel();
  };

  return (
    <main className="flex justify-center items-center h-fit w-full relative">
        <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-2 w-[300px] h-[100px] bg-black text-white text-3xl z-20 rounded shadow flex justify-center items-center"
            style={{padding: '12px'}}
          >
            {alert}
          </motion.div>
        )}
      </AnimatePresence>
        <form onSubmit={handleAddReward} className="w-11/12" style={{marginBlock: '4px'}}>
          <Stack >
            <Input variant={'subtle'} onChange={(e) => setTitle(e.currentTarget.value)}></Input>
            <NumberInput.Root variant={'subtle'}>
              <NumberInput.Control />
              <NumberInput.Input
                onChange={(e) => setCost(Number(e.currentTarget.value))}
                placeholder="Reward"
              />
            </NumberInput.Root>
            <div className="flex gap-1">
                <Button onClick={onCancel} className="flex-1 active:scale-95">Cancel</Button>
                <Button loading={loading} loadingText={'Adding...'} type="submit" className="flex-1">Add</Button>
            </div>
          </Stack>
        </form>
    </main>
  );
}
