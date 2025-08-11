import { Incentives } from "@/lib/definitions";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Rewards({ points }: { points: number }) {
  const [incentives, setIncentives] = useState<Incentives[]>([]);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    const fetchIncentives = async () => {
      const { data, error } = await supabase.from("incentives").select();
      if (error) {
        console.error(error);
      }
      if (data) setIncentives(data);
    };
    fetchIncentives();
  }, []);

  const handleRedeem = async (pointsToRedeem: number) => {
    // fetch current points (assuming single row)
    const { data, error } = await supabase
      .from("rewarded_points")
      .select("points")
      .single();

    if (error) {
      console.warn("Error fetching points:", error);
      return;
    }

    const currentPoints = Number(data?.points);
    const newPoints = currentPoints - pointsToRedeem;

    if (currentPoints < pointsToRedeem) {
      setAlert("You do not have enough points for this reward");
      setTimeout(() => {
        setAlert("");
      }, 3000);
      return;
    }

    const { error: updateError } = await supabase
      .from("rewarded_points")
      .update({ points: newPoints })
      .eq("id", 2);

    if (updateError) {
      console.warn("There was an error updating points:", updateError);
    }
  };

  return (
    <section className="flex justify-center">
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-2 w-[300px] h-[100px] bg-black text-white z-10 rounded shadow flex justify-center items-center text-center"
          >
            {alert}
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className="flex flex-wrap gap-2"
        style={{ marginTop: 8, marginBottom: 16 }}
      >
        {incentives.map((item) => (
          <div
            key={item.id}
            className={`${
              points >= item.cost ? "bg-gray-100" : "bg-gray-300 opacity-50"
            } w-full h-16 rounded-sm flex justify-between items-center shadow`}
            style={{ marginInline: 8, paddingInline: 8 }}
          >
            {item.title}
            <Button
              variant={"plain"}
              colorPalette={"green"}
              onClick={() => handleRedeem(item.cost)}
            >
              Redeem
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
