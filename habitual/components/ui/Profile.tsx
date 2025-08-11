"use client";

import { supabase } from "@/lib/supabaseClient";
import { Button } from "@chakra-ui/react";
import { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Profile({ user }: { user: User }) {
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
          {!user && (
            <Link href={"/login"} className="w-full text-center">
              Sign In
            </Link>
          )}
          {user && (
            <Button
              onClick={() => {
                supabase.auth.signOut();
              }}
            >
              Sign Out
            </Button>
          )}
        </div>
      </section>
    </motion.div>
  );
}
