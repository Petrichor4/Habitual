import { Incentives } from "@/lib/definitions";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Rewards({points}:{points: number}) {
  const [incentives, setIncentives] = useState<Incentives[]>([]);

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
    .from('rewarded_points')
    .select('points')
    .single();

  if (error) {
    console.warn('Error fetching points:', error);
    return;
  }

  const currentPoints = Number(data?.points);
  const newPoints = currentPoints - pointsToRedeem;

  const { error: updateError } = await supabase
    .from('rewarded_points')
    .update({ points: newPoints })
    .eq('id', 2);

  if (updateError) {
    console.warn('There was an error updating points:', updateError);
  }
};

  return (
    <section className="flex ">
      <div
        className="flex flex-wrap gap-2"
        style={{ marginTop: 8, marginBottom: 16 }}
      >
        {incentives.map((item) => (
          <div
            key={item.id}
            className={`${ points >= item.cost ? 'bg-gray-100' : 'bg-gray-300 opacity-50' } w-full h-16 rounded-sm flex justify-between items-center shadow`}
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
