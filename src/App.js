import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "./utils";
import NoteList from "./components/NoteList";
import AddNote from "./components/AddNote";
import EditNote from "./components/EditNote";
import { PenLine, BookOpen, Sparkles, Search, Menu, X } from "lucide-react";

function App() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(API_URL);
      console.log("Data dari backend:", response.data);
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes = Array.isArray(notes) 
    ? notes.filter(
        (note) =>
          note.judul?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.isi?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleEdit = (note) => {
    setEditingNote(note);
    setSidebarOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setSidebarOpen(false);
  };

  const handleSaveAdd = () => {
    fetchNotes();
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#e8e4dc] font-sans flex overflow-hidden">

      {/* ── Sidebar overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={handleCancelEdit}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[340px] bg-[#0f0f0f] border-r border-white/[0.06]
          flex flex-col z-50 transition-transform duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative lg:flex-shrink-0
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-7 pt-8 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400/90 to-amber-600/80 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <BookOpen size={15} className="text-[#0a0a0a]" strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-semibold tracking-[-0.3px] text-white">
              noted<span className="text-amber-400">.</span>
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/70 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Divider */}
        <div className="mx-7 h-px bg-white/[0.05] mb-6" />

        {/* Form label */}
        <div className="px-7 mb-4">
          <span className="text-[10px] tracking-[0.12em] uppercase text-white/20 font-medium">
            {editingNote ? "Edit Catatan" : "Catatan Baru"}
          </span>
        </div>

        {/* Form */}
        <div className="px-7 flex-1 overflow-y-auto">
          {editingNote ? (
            <EditNote
              note={editingNote}
              setEditingNote={handleCancelEdit}
              refresh={fetchNotes}
            />
          ) : (
            <AddNote refresh={handleSaveAdd} />
          )}
        </div>

        {/* Footer */}
        <div className="px-7 pb-7 pt-5 border-t border-white/[0.05]">
          <div className="flex items-center gap-2">
            <Sparkles size={11} className="text-amber-400/60" />
            <span className="text-[11px] text-white/20 tracking-wide">
              {notes.length} catatan tersimpan
            </span>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* Topbar */}
        <header className="flex-shrink-0 flex items-center justify-between px-6 lg:px-10 py-5 border-b border-white/[0.05] bg-[#080808]/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white/70 transition-colors"
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 className="text-[22px] font-bold tracking-[-0.6px] text-white leading-none">
                Semua Catatan
              </h1>
              <p className="text-[12px] text-white/30 mt-0.5 tracking-wide">
                {filteredNotes.length} catatan ditemukan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search bar */}
            <div className="relative group hidden sm:block">
              <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 group-focus-within:text-amber-400/60 transition-colors" />
              <input
                type="text"
                placeholder="Cari catatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  bg-white/[0.04] border border-white/[0.07] rounded-xl
                  pl-9 pr-4 py-2.5 text-[13px] text-white/70 placeholder-white/20
                  outline-none w-48 focus:w-64 transition-all duration-300
                  focus:border-amber-400/30 focus:bg-white/[0.06] focus:ring-2 focus:ring-amber-400/10
                "
              />
            </div>

            {/* New note button (mobile) */}
            <button
              onClick={() => { setEditingNote(null); setSidebarOpen(true); }}
              className="lg:hidden flex items-center gap-2 bg-amber-400 text-[#0a0a0a] px-4 py-2 rounded-xl text-[13px] font-semibold hover:bg-amber-300 active:scale-95 transition-all"
            >
              <PenLine size={14} strokeWidth={2.5} />
            </button>
          </div>
        </header>

        {/* Mobile search */}
        <div className="sm:hidden px-6 pt-4 pb-0">
          <div className="relative">
            <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
            <input
              type="text"
              placeholder="Cari catatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-white/70 placeholder-white/20 outline-none focus:border-amber-400/30 focus:ring-2 focus:ring-amber-400/10"
            />
          </div>
        </div>

        {/* Notes area */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-7">
          <NoteList
            notes={filteredNotes}
            loading={loading}
            setEditingNote={handleEdit}
            refresh={fetchNotes}
          />
        </div>
      </main>
    </div>
  );
}

export default App;