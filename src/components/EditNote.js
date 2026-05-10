import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../utils";
import { PenLine, FileText, Check, X, AlertCircle } from "lucide-react";

const EditNote = ({ note, setEditingNote, refresh }) => {
  const [judul, setJudul] = useState(note.judul);
  const [isi, setIsi] = useState(note.isi);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!judul.trim() || !isi.trim()) {
      setError("Judul dan isi catatan wajib diisi.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await axios.put(`${API_URL}/${note.id}`, { judul, isi });
      setEditingNote(null);
      refresh();
    } catch (err) {
      console.error("Gagal mengupdate note", err);
      setError("Gagal memperbarui. Cek koneksi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* Edit indicator */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-400/8 border border-amber-400/15">
        <PenLine size={12} className="text-amber-400/70" />
        <span className="text-[11px] text-amber-400/70 font-medium tracking-wide">Mode Edit Aktif</span>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[12px]">
          <AlertCircle size={13} />
          {error}
        </div>
      )}

      {/* Judul input */}
      <div className="relative group">
        <div className="absolute left-3.5 top-3.5 text-white/20 group-focus-within:text-amber-400/50 transition-colors">
          <PenLine size={14} />
        </div>
        <input
          type="text"
          placeholder="Judul catatan..."
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          className="
            w-full bg-white/[0.03] border border-white/[0.07]
            rounded-xl pl-9 pr-4 py-3 text-[13px] text-white/80
            placeholder-white/20 outline-none transition-all duration-200
            focus:border-amber-400/30 focus:bg-white/[0.05] focus:ring-2 focus:ring-amber-400/10
          "
        />
      </div>

      {/* Isi textarea */}
      <div className="relative group">
        <div className="absolute left-3.5 top-3.5 text-white/20 group-focus-within:text-amber-400/50 transition-colors">
          <FileText size={14} />
        </div>
        <textarea
          placeholder="Tulis isi catatan di sini..."
          value={isi}
          onChange={(e) => setIsi(e.target.value)}
          rows={7}
          className="
            w-full bg-white/[0.03] border border-white/[0.07]
            rounded-xl pl-9 pr-4 py-3 text-[13px] text-white/80
            placeholder-white/20 outline-none transition-all duration-200
            focus:border-amber-400/30 focus:bg-white/[0.05] focus:ring-2 focus:ring-amber-400/10
            resize-none leading-relaxed
          "
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="
            flex-1 flex items-center justify-center gap-2
            bg-amber-400 hover:bg-amber-300 text-[#0a0a0a]
            font-semibold text-[13px] rounded-xl py-3 px-5
            transition-all duration-200 active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-lg shadow-amber-500/15
          "
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
          ) : (
            <Check size={14} strokeWidth={2.5} />
          )}
          {loading ? "Menyimpan..." : "Perbarui"}
        </button>

        <button
          type="button"
          onClick={() => setEditingNote(null)}
          className="
            flex items-center justify-center gap-2
            bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] hover:border-red-400/30
            text-white/40 hover:text-red-400 font-medium text-[13px]
            rounded-xl py-3 px-4 transition-all duration-200 active:scale-[0.98]
          "
        >
          <X size={14} />
          Batal
        </button>
      </div>
    </form>
  );
};

export default EditNote;