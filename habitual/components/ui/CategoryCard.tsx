import {
  motion,
  AnimatePresence,
  animate,
  useMotionValue,
} from "framer-motion";
import {
  IoClose,
  IoCreateOutline,
  IoPencilOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { Category, Action } from "@/lib/definitions";
import ActionForm from "../ActionForm";
import ActionCard from "./ActionCard";
import { Button, Input } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FaCheck } from "react-icons/fa6";

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
  const [edit, setEdit] = useState(false);
  const [catName, setCatName] = useState(category.name || "");
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

  const handleEdit = async (id: number) => {
    const { error } = await supabase
      .from("categories")
      .update({ name: catName })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error editing category:", error);
      return;
    }

    setEdit(false);
  };

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
      layout
      className={`relative ${
        OpenCat ? "rounded-[40px]" : "rounded-full"
      } shadow-sm z-0`}
      style={{ margin: "8px", paddingInline: "8px" }}
    >
      {isOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ bounce: 0.5, duration: 0.2 }}
            className="absolute top-1 right-2 flex items-center gap-2 h-[55px]"
          >
            <Button
              size="sm"
              h={"48px"}
              colorPalette="blue"
              className="cursor-pointer"
              onClick={() => {
                setEdit(true);
                setIsOpen(false);
              }}
            >
              <IoPencilOutline />
            </Button>
            <Button
              size="sm"
              h={"48px"}
              colorPalette="red"
              className="cursor-pointer"
              onClick={() => {
                handleDelete(category.id);
                setIsOpen(false);
              }}
            >
              <IoTrashOutline />
            </Button>
          </motion.div>
        </AnimatePresence>
      )}
      {/* Category header */}
      <motion.div
        className="flex justify-between items-center cursor-pointer z-10 rounded-md h-16"
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
        {edit ? (
          <div className="flex flex-nowrap gap-2">
            <Input
              onClickCapture={(e) => e.stopPropagation()}
              value={catName}
              onChange={(e) => setCatName(e.currentTarget.value)}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(category.id);
              }}
            >
              <FaCheck size={20} color="green" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEdit(false);
              }}
            >
              <IoClose size={25} color="red" />
            </button>
          </div>
        ) : (
          <h2 className="font-semibold text-lg">{category.name}</h2>
        )}
      </motion.div>

      <AnimatePresence>
        {OpenCat && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-fit flex justify-end z-10"
            style={{ marginTop: 8, paddingInlineEnd: 8, overflow: "hidden" }}
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
          </motion.div>
        )}
      </AnimatePresence>

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
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap"
            style={{ paddingBlock: 8 }}
          >
            {actions
              .filter((action) => action.category_id === category.id)
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
