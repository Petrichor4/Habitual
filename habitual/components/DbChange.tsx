import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function useDbChange({table}:{table: string}) {
    
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: `${table}` },
        () => {
          console.log(`Detected change in ${table} table!`);
          setChanged(true); // just flag it
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table]);

  return { changed, setChanged };
}
