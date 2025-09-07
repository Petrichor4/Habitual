import {
  motion,
  useMotionValue,
  animate,
  AnimatePresence,
} from "framer-motion";
import { Button, CheckboxCard } from "@chakra-ui/react";
import { IoPencilOutline, IoTrashOutline } from "react-icons/io5";
import { Action } from "@/lib/definitions";
import { useState, useEffect } from "react";

const OPEN_X = 108;

export default function ActionRow({
  item,
  checked,
  onToggleCheck,
  onEdit,
  onDelete,
}: {
  item: Action;
  checked: boolean;
  onToggleCheck: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}) {
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

  return (
    <div className="relative overflow-hidden w-full snap-x">
      {/* Background buttons */}
      {isOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ bounce: 0.5, duration: 0.2 }}
            className="absolute top-0 right-0 flex items-center gap-2 h-full"
          >
            <Button
              size="sm"
              colorPalette="blue"
              h={"60px"}
              className="cursor-pointer"
              onClick={() => {
                onEdit(item.id);
                setIsOpen(false);
              }}
            >
              <IoPencilOutline />
            </Button>
            <Button
              size="sm"
              colorPalette="red"
              h={"60px"}
              w={46}
              p={1}
              onClick={() => {
                onDelete(item.id);
                setIsOpen(false);
              }}
            >
              <IoTrashOutline />
            </Button>
          </motion.div>
        </AnimatePresence>
      )}
      {/* Foreground card */}
      <motion.div
        drag="x"
        style={{ x }}
        dragElastic={0.5}
        dragSnapToOrigin
        dragConstraints={{ left: -OPEN_X, right: 0 }}
        onDragEnd={(e, info) => {
          const shouldOpen =
            info.offset.x < -OPEN_X / 2 || info.velocity.x < -200;
          setIsOpen(shouldOpen);
        }}
        className="relative z-10 bg-white rounded snap-center"
      >
        <CheckboxCard.Root
          colorPalette={"blue"}
          variant="surface"
          checked={checked}
          onCheckedChange={() => onToggleCheck(item.id)}
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
  );
}
