import {
  motion,
  AnimatePresence,
  animate,
  useMotionValue,
} from "framer-motion";
import {
  IoCreateOutline,
  IoPencilOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { Category, Action } from "@/lib/definitions";
import ActionForm from "../ActionForm";
import ActionCard from "./ActionCard";
import { Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const OPEN_X = 110;

interface CategoryCardProps {
  category: Category;
  actions: Action[];
  openCategory: string | null;
  setOpenCategory: (id: string | null) => void;
  addAction: string | null;
  setAddAction: (id: string | null) => void;
  checkedMap: { [key: number]: boolean };
  toggleCheck: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function CategoryCard({
  category,
  actions,
  openCategory,
  setOpenCategory,
  addAction,
  setAddAction,
  checkedMap,
  toggleCheck,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const x = useMotionValue(0);

  // Snap animation whenever isOpen changes
  useEffect(() => {
    animate(x, isOpen ? -OPEN_X : 0, {
      type: "spring",
      stiffness: 300,
      damping: 28,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleEdit = async () => {
    
  }

  const handleDelete = async (id: number) => {
    const { data, error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .select();
    if (error) {
      console.error("There was an error deleting the category");
    }
    if (data) {
      console.log("Category was deleted:", data);
    }
  };

  const OpenCat = openCategory === category.name;

  return (
    <motion.div
      key={category.id}
      className="bg-gray-100 relative rounded-md z-0"
      style={{ margin: "8px", paddingInline: "8px" }}
    >
      <div className="absolute top-2 right-2 flex items-start gap-1 h-full -z-10 bg-gray">
        <Button
          size="sm"
          colorPalette="blue"
          h={"80%"}
          maxH={"55px"}
          //   onClick={() => onEdit(category.id)}
        >
          <IoPencilOutline />
        </Button>
        <Button
          size="sm"
          colorPalette="red"
          h={"80%"}
          maxH={"55px"}
          w={46}
          p={1}
          onClick={() => handleDelete(category.id)}
        >
          <IoTrashOutline />
        </Button>
      </div>
      {/* Category header */}
      <motion.div
        className="flex justify-between items-center cursor-pointer z-10 bg-gray-100 rounded-md h-16"
        drag={"x"}
        style={{ x, padding: "8px" }}
        dragElastic={0.5}
        dragSnapToOrigin
        dragConstraints={{ left: -OPEN_X, right: 0 }}
        onDragEnd={(e, info) => {
          const shouldOpen =
            info.offset.x < -OPEN_X / 2 || info.velocity.x < -200;
          setIsOpen(shouldOpen);
        }}
        onClick={() => {
          if (Math.abs(x.get()) < 5) {
            setOpenCategory(OpenCat ? null : category.name);
          }
        }}
      >
        <h2 className="font-semibold text-lg">{category.name}</h2>
        <motion.span
          animate={{ rotate: OpenCat ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▶
        </motion.span>
      </motion.div>

      {OpenCat && (
        <div
          className="w-full h-fit flex justify-end z-10"
          style={{ marginTop: 8, paddingInlineEnd: 8 }}
        >
          <button
            onClick={() =>
              setAddAction(addAction === category.name ? null : category.name)
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
        {addAction === category.name && OpenCat && (
          <motion.div
            initial={{ opacity: 0, y: -15, zIndex: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15, zIndex: -10 }}
          >
            <ActionForm
              onCancel={() => setAddAction(null)}
              category={category}
              edit={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {OpenCat && (
          <div>
            {actions
              .filter((action) => action.type === category.name)
              .sort((a, b) => {
                if (a.reward === b.reward) {
                  return a.id - b.id; // keeps stable order for same reward
                }
                return a.reward - b.reward;
              })
              .map((item) => (
                <ActionCard
                  key={item.id}
                  item={item}
                  checked={checkedMap[item.id] ?? false}
                  onToggleCheck={toggleCheck}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
