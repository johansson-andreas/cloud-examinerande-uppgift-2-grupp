"use client";
import { Entry } from "@/types/database.types";
import { EditIcon } from "./icons/Edit";
import { RemoveIcon } from "./icons/Remove";
import { ConfirmModal } from "./ConfirmModal";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { supabase } from "@/app/page";

interface EntryCardProps {
  entry: Entry;
  onDelete?: () => void;
}

export default function EntryCard({ entry, onDelete }: EntryCardProps) {
  const [open, setOpen] = useState(false);
  const formattedDate = new Date(entry.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const handleDelete = async (id: string) => {
    try {
      const { data } = await supabase.auth.getSession();
      const accessToken = data.session?.access_token;
      const res = await fetch(
        `https://${process.env.NEXT_PUBLIC_PROJECT_REF}.functions.supabase.co/delete-entry?id=${id}`,
        {
          method: "DELETE",
          headers: {
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        },
      );

      onDelete?.();
    } catch (_err: unknown) {
      console.error("Failed to delete entry");
    }
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="mb-4">
          <div className="text-xs text-warm-gray mb-2 tracking-wide uppercase">
            {formattedDate}
          </div>
          <h2 className="text-2xl font-serif text-dark-brown mb-3">
            {entry.title}
          </h2>
        </div>

        <div>
          <Link href={`/edit-entry/${entry.id}`} title="Edit entry">
            <button className="btn-icon">
              <EditIcon className="w-6 h-6" />
            </button>
          </Link>
          <button
            className="btn-icon"
            onClick={() => setOpen(true)}
            title="Delete entry"
          >
            <RemoveIcon className="w-6 h-6" />
          </button>
          <ConfirmModal
            open={open}
            onClose={() => setOpen(false)}
            onConfirm={() => {
              handleDelete(entry.id);
              setOpen(false);
            }}
          />
        </div>
      </div>

      <div className="prose max-w-none text-dark-brown/80">
        <div
          className="overflow-x-auto scrollbar-thin"
          tabIndex={0}
          aria-label="Scrollable table container"
        >
          <Markdown remarkPlugins={[remarkGfm]}>{entry.content}</Markdown>
        </div>
      </div>
    </div>
  );
}
