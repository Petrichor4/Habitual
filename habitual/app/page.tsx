"use client";

import { useEffect, useState } from "react";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { AnimatePresence } from "framer-motion";
import Profile from "@/components/ui/Profile";
import Tab from "@/components/ui/Tab";
import { Text } from "@chakra-ui/react";
import { supabase } from "@/lib/supabaseClient";
// import { User } from "@supabase/supabase-js";

export default function Home() {
  const [popout, setPopout] = useState(false);
  const [points, setPoints] = useState();
  // const [user, setUser] = useState<User>();

  // const channelA = supabase
  // .channel('schema-db-changes')
  // .on(
  //   'postgres_changes',
  //   {
  //     event: '*',
  //     schema: 'public',
  //   },
  //   (payload) => console.log(payload)
  // )
  // .subscribe()

  console.log(points);

  useEffect(() => {
    const fetchPoints = async () => {
      const { data, error } = await supabase.rpc("get_total_points");
      if (error) {
        console.error(error);
        return;
      }
      if (data) {
        setPoints(data);
      }
    };
    fetchPoints();
  }, []);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const {data: { user }} = await supabase.auth.getUser();
  //     if (user) {
  //       setUser(user);
  //     }
  //   }
  //   fetchUser()
  // })

  return (
    <>
      <main>
        <header className="h-20 flex justify-center items-center bg-gray-100 shadow relative">
          <Text className="absolute left-10">{points} Pts</Text>
          <h1 className="text-3xl h-fit" style={{ fontSize: 30 }}>
            Habitual
          </h1>
          <HiOutlineMenuAlt4
            className="absolute right-8"
            size={20}
            onClick={() => setPopout((prev) => !prev)}
          />
          <AnimatePresence>{popout && <Profile />}</AnimatePresence>
        </header>
        <Tab points={points ?? 0} />
      </main>
    </>
  );
}
