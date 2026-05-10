import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../utils";
import { Pencil, Trash2, Clock, StickyNote, Plus, X, ArrowUpRight } from "lucide-react";

/* ── Skeleton loader ── */
const SkeletonCard = () => (
  <div className="bg-white/[0.025] border border-white/[0.05] rounded-2xl p-5 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="w-16 h-3 bg-white/[0.06] rounded-full" />
      <div className="w-20 h-3 bg-white/[0.06] rounded-full" />
    </div>
    <div className="w-3/4 h-4 bg-white/[0.06] rounded-full mb-3" />
    <div className="space-y-2 mb-5">
      <div className="w-full h-3 bg-white/[0.04] rounded-full" />
      <div className="w-5/6 h-3 bg-white/[0.04] rounded-full" />
      <div className="w-2/3 h-3 bg-white/[0.04] rounded-full" />
    </div>
    <div className="flex gap-2">
      <div className="flex-1 h-8 bg-white/[0.04] rounded-xl" />
      <div className="flex-1 h-8 bg-white/[0.04] rounded-xl" />
    </div>
  </div>
);

/* ── Empty state ── */
const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-24 px-6 text-center">
    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-5">
      <StickyNote size={24} className="text-white/15" />
    </div>
    <h3 className="text-[15px] font-semibold text-white/40 mb-2 tracking-tight">
      Belum ada catatan
    </h3>
    <p className="text-[13px] text-white/20 max-w-[240px] leading-relaxed">
      Mulai tulis catatan pertamamu dari panel di sebelah kiri.
    </p>
    <div className="mt-5 flex items-center gap-1.5 text-[11px] text-amber-400/40">
      <Plus size={11} />
      <span>Tambah catatan baru</span>
    </div>
  </div>
);

/* ── Note card ── */
const NoteCard = ({ note, index, onEdit, onDelete, onClick, isActive }) => {
  const formattedDate = note.created_at
    ? new Date(note.created_at).toLocaleDateString("id-ID", {
        day: "numeric", month: "short", year: "numeric",
      })
    : null;

  return (
    <div
      onClick={() => onClick(note)}
      className={`
        group relative bg-[#0f0f0f] border rounded-2xl p-5 cursor-pointer overflow-hidden
        hover:-translate-y-0.5 transition-all duration-300 ease-out
        ${isActive
          ? "border-amber-400/30 ring-2 ring-amber-400/10"
          : "border-white/[0.06] hover:border-white/[0.14]"
        }
      `}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-amber-400/0 via-amber-400/30 to-amber-400/0 transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />

      {/* Open indicator */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <ArrowUpRight size={13} className="text-white/20" />
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-[10px] font-mono text-white/15 tracking-wider uppercase">
          #{String(note.id).padStart(3, "0")}
        </span>
        {formattedDate && (
          <div className="flex items-center gap-1.5 text-[10px] text-white/20 mr-5">
            <Clock size={9} />
            {formattedDate}
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-bold text-white/90 leading-snug mb-2.5 line-clamp-2 tracking-[-0.3px]">
        {note.judul}
      </h3>

      {/* Preview */}
      <p className="text-[13px] text-white/35 leading-relaxed line-clamp-3 mb-4">
        {note.isi}
      </p>

      {/* Actions — stop propagation */}
      <div
        className="flex gap-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onEdit(note)}
          className="
            flex-1 flex items-center justify-center gap-1.5
            border border-white/[0.07] bg-white/[0.03] hover:bg-amber-400/10 hover:border-amber-400/25
            text-white/35 hover:text-amber-400
            rounded-xl py-2 text-[12px] font-medium
            transition-all duration-200 active:scale-[0.97]
          "
        >
          <Pencil size={11} strokeWidth={2.5} />
          Edit
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="
            flex-1 flex items-center justify-center gap-1.5
            border border-white/[0.07] bg-white/[0.03] hover:bg-red-500/10 hover:border-red-500/25
            text-white/35 hover:text-red-400
            rounded-xl py-2 text-[12px] font-medium
            transition-all duration-200 active:scale-[0.97]
          "
        >
          <Trash2 size={11} strokeWidth={2.5} />
          Hapus
        </button>
      </div>
    </div>
  );
};

/* ── Detail Panel ── */
const DetailPanel = ({ note, onClose, onEdit, onDelete }) => {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!note) return null;

  const formattedDate = note.created_at
    ? new Date(note.created_at).toLocaleDateString("id-ID", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    : null;

  const wordCount = note.isi.trim().split(/\s+/).filter(Boolean).length;
  const charCount = note.isi.length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-40"
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-[460px] bg-[#0d0d0d] border-l border-white/[0.07] z-50 flex flex-col shadow-2xl shadow-black/70"
        style={{ animation: "slideInRight 0.28s cubic-bezier(0.4,0,0.2,1) both" }}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-7 pt-7 pb-5 border-b border-white/[0.05]">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-[10px] font-mono text-white/20 tracking-widest uppercase flex-shrink-0">
              #{String(note.id).padStart(3, "0")}
            </span>
            {formattedDate && (
              <>
                <span className="text-white/10 flex-shrink-0">·</span>
                <div className="flex items-center gap-1.5 text-[11px] text-white/25 truncate">
                  <Clock size={10} className="flex-shrink-0" />
                  <span className="truncate">{formattedDate}</span>
                </div>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className="
              flex-shrink-0 ml-3 w-8 h-8 rounded-xl
              bg-white/[0.04] border border-white/[0.06]
              flex items-center justify-center
              text-white/30 hover:text-white/70 hover:bg-white/[0.08]
              transition-all duration-200 active:scale-95
            "
            aria-label="Tutup panel"
          >
            <X size={14} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          {/* Title */}
          <h2 className="text-[24px] font-bold text-white leading-tight tracking-[-0.6px] mb-5">
            {note.judul}
          </h2>

          {/* Stats */}
          <div className="flex items-center gap-2 mb-7">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] text-white/30">
              {wordCount} kata
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] text-white/30">
              {charCount} karakter
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-400/[0.08] border border-amber-400/[0.15] text-[11px] text-amber-400/60">
              ~{readTime} mnt baca
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-white/[0.07] to-transparent mb-7" />

          {/* Body */}
          <p className="text-[14px] text-white/55 leading-[1.9] whitespace-pre-wrap break-words">
            {note.isi}
          </p>
        </div>

        {/* Footer actions */}
        <div className="flex-shrink-0 px-7 py-5 border-t border-white/[0.05] flex gap-3">
          <button
            onClick={() => { onEdit(note); onClose(); }}
            className="
              flex-1 flex items-center justify-center gap-2
              bg-amber-400 hover:bg-amber-300 text-[#0a0a0a]
              font-semibold text-[13px] rounded-xl py-3
              transition-all duration-200 active:scale-[0.98]
              shadow-lg shadow-amber-500/15
            "
          >
            <Pencil size={13} strokeWidth={2.5} />
            Edit Catatan
          </button>
          <button
            onClick={() => { onDelete(note.id); onClose(); }}
            className="
              flex items-center justify-center gap-2
              bg-white/[0.04] hover:bg-red-500/10 border border-white/[0.07] hover:border-red-500/25
              text-white/35 hover:text-red-400 font-medium text-[13px]
              rounded-xl py-3 px-5 transition-all duration-200 active:scale-[0.98]
            "
          >
            <Trash2 size={13} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0.5; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
};

/* ── Main NoteList ── */
const NoteList = ({ notes, loading, setEditingNote, refresh }) => {
  const [selectedNote, setSelectedNote] = useState(null);

  const deleteNote = async (id) => {
    if (window.confirm("Yakin ingin menghapus catatan ini?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        refresh();
        if (selectedNote?.id === id) setSelectedNote(null);
      } catch (error) {
        console.error("Gagal menghapus note", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="grid grid-cols-1">
        <EmptyState />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {notes.map((note, index) => (
          <NoteCard
            key={note.id}
            note={note}
            index={index}
            onEdit={setEditingNote}
            onDelete={deleteNote}
            onClick={setSelectedNote}
            isActive={selectedNote?.id === note.id}
          />
        ))}
      </div>

      {selectedNote && (
        <DetailPanel
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onEdit={setEditingNote}
          onDelete={deleteNote}
        />
      )}
    </>
  );
};

export default NoteList;