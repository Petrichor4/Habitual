import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function GetUser() {

    const [user,setUser] = useState<User>()

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: {user} } = await supabase.auth.getUser();
            if (!user) {
                return
            }
            setUser(user)
        }
        fetchUserData()
    },[])
    return { user }
}