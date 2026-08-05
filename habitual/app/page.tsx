"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Profile from "@/components/ui/Profile";
import Tab from "@/components/ui/Tab";
import { Heading, Spinner, Text, VStack } from "@chakra-ui/react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import LoginPage from "@/components/LoginForm";
import AwardedPointsModal from "@/components/ui/AwardedPointsModal";
import { RxHamburgerMenu } from "react-icons/rx";

export default function Home() {
  const [popout, setPopout] = useState(false);
  const [points, setPoints] = useState<number>();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [award, setAward] = useState(false);
  const [gainedPoints, setGainedPoints] = useState<number>(0);

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
  }, [update]);

  useEffect(() => {
    if (points === undefined) return;

    const prev = Number(localStorage.getItem("prevPoints")) || 0;

    if (points > prev) {
      setGainedPoints(points - prev);
      setAward(true);
    }

    localStorage.setItem("prevPoints", points.toString());
  }, [points]);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setLoading(false);
        setUser(user);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);


  if (loading && !user) {
    return (
      <VStack className="w-full h-screen flex justify-center items-center">
        <Spinner animationDuration={"0.8s"} />
        <Text>Loading...</Text>
      </VStack>
    );
  }

  return (
    <>
      {user ? (
        <main className="relative dark:bg-gray-600">
          <AnimatePresence>
            {award && (
              <AwardedPointsModal
                points={gainedPoints}
                onClose={() => setAward(false)}
              />
            )}
          </AnimatePresence>
          <div className="h-20 w-full"></div>
          <header className="h-20 w-full flex justify-center items-center fixed top-0 z-20">
            {user && (
              <Text className="absolute left-10">{points ?? 0} Pts</Text>
            )}
            <Heading as={'h1'} className="text-3xl h-fit relative w-[50%] text-center" style={{ fontSize: 30 }}>
              Habitual
            </Heading>
            <RxHamburgerMenu
              className="absolute right-8"
              size={20}
              onClick={() => setPopout((prev) => !prev)}
            />
            <AnimatePresence>
              {popout && <Profile user={user!} />}
            </AnimatePresence>
          </header>
          <Tab
            refresh={() => setUpdate((prev) => !prev)}
            points={points ?? 0}
          />
        </main>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <LoginPage />
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}
