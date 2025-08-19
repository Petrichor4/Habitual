import { Incentives } from "@/lib/definitions";
import { supabase } from "@/lib/supabaseClient";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IoCreateOutline } from "react-icons/io5";
import RewardForm from "../RewardForm";
import RedeemButton from "./RedeemButton";
import { User } from "@supabase/supabase-js";

export default function Rewards({
  points,
  refresh,
}: {
  points: number;
  refresh: () => void;
}) {
  const [incentives, setIncentives] = useState<Incentives[]>([]);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState("");
  const [addReward, setAddReward] = useState(false);


  useEffect(() => {
    setLoading(true)
    const fetchUserAndIncentives = async () => {
      // Get user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error fetching user:", userError);
        setLoading(false)
        return;
      }
      if (!user) {
        setLoading(false)
        return
      };

      setUser(user)

      // Get incentives for that user
      const { data: incentivesData, error: incentivesError } = await supabase
        .from("incentives")
        .select()
        .eq("user_id", user.id);

      if (incentivesError) {
        console.error("Error fetching incentives:", incentivesError);
        setLoading(false)
        return;
      }

      if (incentivesData) setIncentives(incentivesData);
      setLoading(false)
    };
    fetchUserAndIncentives();
  }, []); // runs once on mount

  const handleRedeem = async (pointsToRedeem: number) => {
    // fetch current points (assuming single row)
    const { data, error } = await supabase
      .from("rewarded_points")
      .select("points")
      .eq('user_id', user?.id)
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
      .eq('user_id', user?.id);

    if (updateError) {
      console.warn("There was an error updating points:", updateError);
    }
    refresh();
  };

  return (
    <section className="flex flex-wrap justify-center">
      <div
        className="w-full h-fit flex justify-end z-10"
        style={{ marginTop: 8, paddingInlineEnd: 8 }}
      >
        <button
          style={{ paddingInline: 6, fontSize: "small" }}
          className="flex items-center gap-1"
          onClick={() => setAddReward((prev) => !prev)}
        >
          <IoCreateOutline />
          Add Reward
        </button>
      </div>
      {addReward && <RewardForm onCancel={() => setAddReward(false)} />}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-2 w-[300px] h-[100px] bg-black text-white z-20 rounded shadow flex justify-center items-center text-center"
          >
            {alert}
          </motion.div>
        )}
      </AnimatePresence>
      {incentives.length === 0 && !loading ? (
        <div
          className="flex justify-center text-gray-500"
          style={{ marginTop: "8px" }}
        >
          <h4>Add a reward to begin</h4>
        </div>
      ) : (
        <div
          className="flex flex-wrap gap-2 w-full"
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
                onRedeem={() => handleRedeem(item.cost)}
                disabled={points < item.cost}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
