const noteModel = require("../models/noteModels");

const getAllNotes = async (req, res) => {
  try {
    const allNotes = await noteModel.findAll();
    res.status(200).json(allNotes); // Frontend lu nerima raw array
  } catch (error) {
    res.status(500).json({ message: "Error retrieving notes", error: error.message });
  }
};

const createNote = async (req, res) => {
  const { judul, isi } = req.body;
  if (!judul || !isi) return res.status(400).json({ message: "Judul dan isi wajib diisi" });

  try {
    await noteModel.create({ judul, isi });
    res.status(201).json({ message: "Note added" });
  } catch (error) {
    res.status(500).json({ message: "Error creating note", error: error.message });
  }
};

const getNoteById = async (req, res) => {
  try {
    const note = await noteModel.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving note", error: error.message });
  }
};

const updateNote = async (req, res) => {
  const { judul, isi } = req.body;
  if (!judul || !isi) return res.status(400).json({ message: "Judul dan isi wajib diisi" });

  try {
    const note = await noteModel.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    await noteModel.updateById(req.params.id, { judul, isi });
    res.status(200).json({ message: "Note updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating note", error: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await noteModel.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    await noteModel.deleteById(req.params.id);
    res.status(200).json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note", error: error.message });
  }
};

module.exports = { getAllNotes, createNote, getNoteById, updateNote, deleteNote };