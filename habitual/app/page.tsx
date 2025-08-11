"use client";

import { useEffect, useState } from "react";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { AnimatePresence, motion } from "framer-motion";
import Profile from "@/components/ui/Profile";
import Tab from "@/components/ui/Tab";
import { Spinner, Text, VStack } from "@chakra-ui/react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import LoginPage from "@/components/LoginForm";
// import { User } from "@supabase/supabase-js";

export default function Home() {
  const [popout, setPopout] = useState(false);
  const [points, setPoints] = useState();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false)

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

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setLoading(false)
        setUser(user);
      }
    };
    fetchUser();
  });

  if (loading && !user) {
    return (
    <VStack className="w-full h-screen flex justify-center items-center">
      <Spinner animationDuration={'0.8s'} />
      <Text>loading...</Text>
    </VStack>
  )
  }

  return (
    <>
      {user ? (
        <main>
          <div className="h-20 w-full"></div>
          <header className="h-20 w-full flex justify-center items-center bg-gray-100/80 shadow fixed top-0 z-10">
            {user && (
              <Text className="absolute left-10">{points ?? 0} Pts</Text>
            )}
            <h1 className="text-3xl h-fit" style={{ fontSize: 30 }}>
              Habitual
            </h1>
            <HiOutlineMenuAlt4
              className="absolute right-8"
              size={20}
              onClick={() => setPopout((prev) => !prev)}
            />
            <AnimatePresence>
              {popout && <Profile user={user!} />}
            </AnimatePresence>
          </header>
          <Tab points={points ?? 0} />
        </main>
      ) : (
        <AnimatePresence>
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 1}}>
            <LoginPage />
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}
