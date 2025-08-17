import { motion, AnimatePresence } from "framer-motion";
import { IoCreateOutline } from "react-icons/io5";
import { Category, Action } from "@/lib/definitions";
import ActionForm from "../ActionForm";
import ActionCard from "./ActionCard";

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
  const isOpen = openCategory === category.name;

  return (
    <motion.div
      key={category.id}
      className="bg-gray-100 rounded-md shadow"
      style={{ margin: "8px", padding: "4px" }}
    >
      {/* Category header */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() =>
          setOpenCategory(isOpen ? null : category.name)
        }
        style={{ padding: "12px", marginBlock: "8px" }}
      >
        <h2 className="font-semibold text-lg">{category.name}</h2>
        <motion.span
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▶
        </motion.span>
      </div>

      {isOpen && (
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
        {addAction === category.name && isOpen && (
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
        {isOpen && (
          <div>
            {actions
              .filter((action) => action.type === category.name)
              .sort((a, b) => a.reward - b.reward)
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
