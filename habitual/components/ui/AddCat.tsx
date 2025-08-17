import { supabase } from "@/lib/supabaseClient";
import { Button, Input } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import GetUser from "../GetUser";

export default function AddCat({ onClose }: { onClose: () => void}) {
  const [category, setCategory] = useState("");
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = GetUser()

  const handleAddCat = async () => {
    if (!category) {
      setAlert("Category name required");
      setTimeout(() => {
        setAlert("");
      }, 3000);
      setLoading(false)
      return;
    }
    setLoading(true)
    const { data: newCategory, error: categoryError } = await supabase
      .from("categories")
      .insert({user_id: user?.id ,name: category})
      .select()
    if (categoryError) console.error(categoryError);
    console.log("Created category:", newCategory);
    setLoading(false)
    onClose()
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -15, zIndex: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15, zIndex: -10 }}
      className="flex flex-wrap justify-center"
    >
      {alert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-2 w-[300px] h-[100px] bg-black text-white text-3xl z-20 rounded shadow flex justify-center items-center"
        >
          {alert}
        </motion.div>
      )}
      <Input
        variant={"subtle"}
        style={{ marginInline: "8px", marginBlock: "4px" }}
        onChange={(e) => setCategory(e.currentTarget.value)}
        placeholder="Category name"
      />
      <div className="flex gap-1 w-full" style={{ marginInline: "8px" }}>
        <Button onClick={onClose} className="flex-1 active:scale-95">
          Cancel
        </Button>
        <Button
          onClick={() => handleAddCat()}
          className="flex-1 active:scale-95"
          loading={loading}
          loadingText={'Adding Category...'}
        >
          Add Category
        </Button>
      </div>
    </motion.div>
  );
}
