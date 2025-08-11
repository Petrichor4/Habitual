"use client";

import { Input, Stack, Button, Alert, Text } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log(user?.id);
    };
    getUser();
  }, []);

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString().trim();
    const passwordConfirm = formData.get("confirm-password")?.toString().trim();

    if (!email || !password) {
      return;
    }

    if (password !== passwordConfirm) {
      setAlert("Passwords do not match");
      setLoading(false)
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    console.log(data.user);

    if (error) {
      console.warn("There was an error signing you up:", error);
    }

    setLoading(false);
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString().trim();

    if (!email || !password) {
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.warn("There was an error logging in:", error);
      return;
    }
    setLoading(false);
    window.location.assign('/')
  };

  return (
    <main className="flex flex-wrap justify-center items-center h-screen">
      <div className="w-4/5 text-center">
        <h1>Welcome to Habitual</h1>
        <Text className="">Create an account or log in to start your motivation journey.</Text>
      </div>
      {signUp ? (
        <form onSubmit={handleSignUp} className="w-4/5 h-fit">
          <Stack>
            <h1 className="text-current text-5xl">Sign Up</h1>
            <Input variant={"subtle"} name="email" placeholder="Email" />
            <PasswordInput
              variant={"subtle"}
              name="password"
              placeholder="Password"
            />
            <PasswordInput
              variant={"subtle"}
              name="confirm-password"
              placeholder="Confirm Password"
            />
            <div className="flex justify-end gap-2">
              <Button variant={"subtle"} className="flex-1">
                Cancel
              </Button>
              <Button
                variant={"subtle"}
                loading={loading}
                loadingText="Signing Up"
                type="submit"
                className="flex-1"
              >
                Sign Up
              </Button>
            </div>
            {alert && <Alert.Root variant={"outline"}>{alert}</Alert.Root>}
            <h2 className="max-w-[300px]">
              Have an account?
              <a
                className="hover:cursor-pointer"
                onClick={() => setSignUp(false)}
              >
                {" "}
                Click here to sign in
              </a>
            </h2>
          </Stack>
        </form>
      ) : (
        <form onSubmit={handleLogin}>
          <Stack>
            <h1 className="text-current text-5xl">Sign In</h1>
            <Input variant={"subtle"} name="email" placeholder="Email" />
            <PasswordInput
              variant={"subtle"}
              name="password"
              placeholder="Password"
            />
            <div className="flex justify-end gap-2">
              <Button variant={"subtle"} className="flex-1">
                Cancel
              </Button>
              <Button
                variant={"subtle"}
                loading={loading}
                loadingText="Signing In"
                type="submit"
                className="flex-1"
              >
                Sign In
              </Button>
            </div>
            {alert && <Alert.Root variant={"outline"}>{alert}</Alert.Root>}
            <h2>
              Dont have an account?
              <a
                className="hover:cursor-pointer"
                onClick={() => setSignUp(true)}
              >
                {" "}
                Click here to sign up
              </a>
            </h2>
          </Stack>
        </form>
      )}
    </main>
  );
}
