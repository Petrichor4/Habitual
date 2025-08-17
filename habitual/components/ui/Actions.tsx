import { Action, Category } from "@/lib/definitions";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { IoCreateOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import ActionForm from "../ActionForm";
import ActionCard from "./ActionCard";
import AddCat from "./AddCat";
import useDbChange from "../DbChange";

export default function Actions() {
  const [loading, setLoading] = useState(false);
  const [actions, setActions] = useState<Action[]>([]);
  const [checkedMap, setCheckedMap] = useState<{ [key: number]: boolean }>({});
  const [user, setUser] = useState<User>();
  const [addCat, setAddCat] = useState(false);
  const [addAction, setAddAction] = useState<string | null>(null);
  const [edit, setEdit] = useState<number | null>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const { changed, setChanged } = useDbChange({ table: "actions" });

  const toggleCategory = (category: string) => {
    setOpenCategory((prev) => (prev === category ? null : category));
  };

  console.log(actions);

  useEffect(() => {
    if (changed) {
      console.log("Something changed in actions → refresh!");
      setChanged(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changed]);

  useEffect(() => {
    const getUserAndData = async () => {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false)
        return
      };

      setUser(user);

      // fetch actions for this user
      const { data: actionData, error: actionError } = await supabase
        .from("actions")
        .select()
        .eq("user_id", user.id);

      if (actionError) console.error(actionError);
      if (actionData) {
        setActions(actionData);
        const stateMap: { [key: number]: boolean } = {};
        actionData.forEach((a) => (stateMap[a.id] = a.done));
        setCheckedMap(stateMap);
      }

      // fetch categories
      const { data: catData, error: catError } = await supabase
        .from("categories")
        .select()
        .eq("user_id", user.id);

      if (catError) console.error(catError);
      if (catData) setCategories(catData);
      setLoading(false)
    };

    getUserAndData();
  }, [changed]);

  useEffect(() => {
    const channel = supabase
      .channel("categories-changes") // Choose a unique channel name
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories" }, // Listen to all events on 'your_table_name'
        (payload) => {
          console.log("Category change received!", payload);
          // Update your component's state based on the payload
          if (payload.eventType === "INSERT") {
            setCategories((prevData) => [
              ...prevData,
              {
                id: payload.new.id,
                name: payload.new.name,
                actions: payload.new.actions ?? [],
              } as Category,
            ]);
          } else if (payload.eventType === "UPDATE") {
            setCategories((prevData) =>
              prevData.map((item) =>
                item.id === payload.old.id
                  ? ({
                      id: payload.new.id,
                      name: payload.new.name,
                      actions: payload.new.actions ?? [],
                    } as Category)
                  : item
              )
            );
          } else if (payload.eventType === "DELETE") {
            setCategories((prevData) =>
              prevData.filter((item) => item.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
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
        <button
          onClick={() => setAddCat((prev) => !prev)}
          style={{ paddingInline: 6, fontSize: "small" }}
          className="flex items-center gap-1"
        >
          <IoCreateOutline />
          Add Category
        </button>
      </div>
      <AnimatePresence>
        {addCat && <AddCat onClose={() => setAddCat(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {edit && (
          <motion.div className="fixed top-20 z-20 w-full bg-gray-100/90">
            <ActionForm
              edit={!!edit}
              action={actions.find((item) => item.id === edit)}
              onCancel={() => setEdit(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {actions.length === 0 && !loading ? (
        <div
          className="flex justify-center text-gray-500"
          style={{ marginTop: "8px" }}
        >
          <h4>Add a category to begin</h4>
        </div>
      ) : (
        <div>
          {categories.map((type) => (
            <motion.div
              key={type.id}
              className="bg-gray-100 rounded-md shadow"
              style={{ margin: "8px", padding: "4px" }}
            >
              {/* Category header */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleCategory(type.name)}
                style={{ padding: "12px", marginBlock: "8px" }}
              >
                <h2 className="font-semibold text-lg">{type.name}</h2>
                <motion.span
                  animate={{ rotate: openCategory === type.name ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  ▶
                </motion.span>
              </div>
              {openCategory === type.name && (
                <div
                  className="w-full h-fit flex justify-end z-10"
                  style={{ marginTop: 8, paddingInlineEnd: 8 }}
                >
                  <button
                    onClick={() =>
                      setAddAction(addAction === type.name ? null : type.name)
                    }
                    style={{ paddingInline: 6, fontSize: "small" }}
                    className="flex items-center gap-1"
                  >
                    <IoCreateOutline />
                    Add action
                  </button>
                </div>
              )}
              <AnimatePresence>
                {addAction === type.name && openCategory === type.name && (
                  <motion.div
                    initial={{ opacity: 0, y: -15, zIndex: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15, zIndex: -10 }}
                  >
                    <ActionForm
                      onCancel={() => setAddAction(null)}
                      category={type}
                      edit={false}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {openCategory === type.name && (
                  <div>
                    {actions
                      .filter((action) => action.type === type.name)
                      .map((item) => (
                        <ActionCard
                          key={item.id}
                          item={item}
                          checked={checkedMap[item.id] ?? false}
                          onToggleCheck={toggleCheck}
                          onEdit={(id) => setEdit(id)}
                          onDelete={handleDelete}
                        />
                      ))}
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
