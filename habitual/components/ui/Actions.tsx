import { CheckboxCard } from "@chakra-ui/react";
import { Action } from "@/lib/definitions";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";

export default function Actions() {
  const [actions, setActions] = useState<Action[]>([]);
  const [checkedMap, setCheckedMap] = useState<{ [key: number]: boolean }>({});
  const [user, setUser] = useState<User>();

  console.log(checkedMap);

  useEffect(() => {
    const fetchActions = async () => {
      const { data, error } = await supabase.from("actions").select();
      if (error) {
        console.warn();
        return;
      }
      if (data) {
        console.log(data);
        setActions(data);
        const stateMap: { [key: number]: boolean } = {};
        data.forEach((a) => (stateMap[a.id] = a.done));
        setCheckedMap(stateMap);
        return;
      }
    };
    fetchActions();
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return;
      }
      setUser(user);
    };
    getUser();
  }, []);

  const handleCheckTask = async (id: number, isChecked: boolean) => {
    const { data, error } = await supabase
      .from("actions")
      .update([{ done: isChecked }])
      .eq("id", id)
      .select();

    if (error) throw error;
    return data;
  };

  const toggleCheck = (id: number) => {
    const newChecked = !checkedMap[id];
    setCheckedMap((prev) => ({
      ...prev,
      [id]: newChecked,
    }));

    if (user) {
      handleCheckTask(id, newChecked);
    }
  };

  return (
    <div className="z-10">
      {actions.map((item) => (
        <CheckboxCard.Root
          key={item.id}
          m={2}
          variant={"surface"}
          checked={checkedMap[item.id] ?? false}
          onCheckedChange={() => toggleCheck(item.id)}
        >
          <CheckboxCard.HiddenInput />
          <CheckboxCard.Control>
            <CheckboxCard.Content>
              <CheckboxCard.Label>{item.title}</CheckboxCard.Label>
              <CheckboxCard.Description>
                {item.reward}pts
              </CheckboxCard.Description>
            </CheckboxCard.Content>
            <CheckboxCard.Indicator />
          </CheckboxCard.Control>
        </CheckboxCard.Root>
      ))}
    </div>
  );
}
