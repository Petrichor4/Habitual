"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

function SortableItem({ id }: { id: string }) {
  const {
    attributes,
    listeners, // <- gives drag behavior
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "12px",
    marginBlock: "6px 0",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <button
        {...listeners}
        style={{
          cursor: "grab",
          width: "40px",
          height: "40px",
          border: "none",
          background: "transparent",
          fontSize: "24px",
          touchAction: "none", // 👈 helps with mobile drag
        }}
      >
        ☰
      </button>
      <span>{id}</span>
      {/* 👇 Drag handle — only this part is draggable */}
    </div>
  );
}

export default function DragHandleExample() {
  const [items, setItems] = useState([
    "Category A",
    "Category B",
    "Category C",
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.indexOf(active.id);
        const newIndex = prev.indexOf(over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((id) => (
          <SortableItem key={id} id={id} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
