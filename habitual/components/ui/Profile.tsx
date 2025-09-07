"use client";

import { supabase } from "@/lib/supabaseClient";
import { Button } from "@chakra-ui/react";
import { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Profile({ user }: { user: User }) {
  const handleSignOut = () => {
    supabase.auth.signOut();
    window.location.assign("/");
  };

  return (
    <motion.div
      initial={{ x: "100vw" }}
      animate={{ x: 0 }}
      exit={{ x: "100vw" }}
      transition={{ duration: 0.2 }}
      className="bg-gray-100 h-[89vh] w-full absolute top-20 right-0 z-10"
    >
      <section>
        <div className="flex flex-wrap justify-center gap-2">
          {user && (
            <div
              className="flex flex-wrap w-3/4 gap-1"
              style={{ marginTop: "8px" }}
            >
              <Link href={'/schedule'} className="w-full active:scale-95">
                <Button className="w-full">Calendar</Button>
              </Link>
              <Button
                className="w-full active:scale-95"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
