import { Action, Category } from "@/lib/definitions";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { IoCreateOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import ActionForm from "../ActionForm";
import AddCat from "./AddCat";
import useDbChange from "../DbChange";
import CategoryCard from "./CategoryCard";

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
  const { changed: actionsChanged, setChanged: resetActions } = useDbChange({
    table: "actions",
  });
  const { changed: categoriesChanged, setChanged: resetCategories } =
    useDbChange({ table: "categories" });

  //   console.log(categories);

  useEffect(() => {
    const getUserAndData = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

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
      setLoading(false);
    };

    getUserAndData();
    if (actionsChanged || categoriesChanged) {
      console.log("DB change detected, refreshing data...");
      resetActions(false);
      resetCategories(false);
      getUserAndData(); // refetch
    }
  }, [actionsChanged, categoriesChanged, resetActions, resetCategories]);

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
      {categories.length === 0 && !loading ? (
        <div
          className="flex justify-center text-gray-500"
          style={{ marginTop: "8px" }}
        >
          <h4>Add a category to begin</h4>
        </div>
      ) : (
        <div>
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              actions={actions}
              openCategory={openCategory}
              setOpenCategory={setOpenCategory}
              addAction={addAction}
              setAddAction={setAddAction}
              checkedMap={checkedMap}
              toggleCheck={toggleCheck}
              onEdit={(id) => setEdit(id)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
