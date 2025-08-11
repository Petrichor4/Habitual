import { Button, CheckboxCard, IconButton } from "@chakra-ui/react";
import { Action } from "@/lib/definitions";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import {
  IoCreateOutline,
  IoPencilOutline,
  IoTrashOutline,
} from "react-icons/io5";
import {
  AnimatePresence,
  motion,
  animate,
  useMotionValue,
} from "framer-motion";
import ActionForm from "../AddAction";

export default function Actions() {
  const [actions, setActions] = useState<Action[]>([]);
  const [checkedMap, setCheckedMap] = useState<{ [key: number]: boolean }>({});
  const [user, setUser] = useState<User>();
  const [addAction, setAddAction] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [edit, setEdit] = useState<number | null>();
  const x = useMotionValue(0);

  const openCard = () => {
    animate(x, -100, { type: "spring", stiffness: 300, damping: 30 });
    setIsOpen(true);
  };

  const closeCard = () => {
    animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
    setIsOpen(false);
  };

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

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("actions").delete().eq("id", id);
    if (error) return console.warn(error);
    setActions((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="z-10">
      <div
        className="w-full h-fit flex justify-end z-10"
        style={{ marginTop: 8, paddingInlineEnd: 8 }}
      >
        <IconButton
          onClick={() => setAddAction((prev) => !prev)}
          style={{ paddingInline: 6 }}
        >
          <IoCreateOutline />
          Add Action
        </IconButton>
      </div>
      <AnimatePresence>
        {addAction && (
          <motion.div
            initial={{ opacity: 0, y: -15, zIndex: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15, zIndex: -10 }}
            className="flex justify-center w-full"
          >
            <ActionForm edit={false} />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {edit && (
          <motion.div className="fixed top-20 z-20 w-full bg-white/80">
            <ActionForm
              edit={!!edit}
              action={actions.find((item) => item.id === edit)}
              onCancel={() => setEdit(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {actions.map((item) => (
        <div key={item.id} className="relative overflow-hidden w-full">
          {/* Background buttons */}
          <div className="absolute top-0 right-2 flex items-center gap-1 h-full z-0">
            <Button
              size="sm"
              colorPalette="blue"
              h={"80%"}
              onClick={() => setEdit(item.id)}
            >
              <IoPencilOutline />
              Edit
            </Button>
            <Button
              size="sm"
              colorPalette="red"
              h={"80%"}
              p={1}
              onClick={() => handleDelete(item.id)}
            >
              <IoTrashOutline />
              Delete
            </Button>
          </div>
          <motion.div
            drag={"x"}
            dragElastic={0.5}
            dragConstraints={{ left: -170, right: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.x < -50) {
                openCard();
              } else {
                closeCard();
              }
            }}
            className="relative z-10 bg-white"
          >
            <CheckboxCard.Root
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
          </motion.div>
        </div>
      ))}
    </div>
  );
}
