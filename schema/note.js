const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Note = sequelize.define(
  "Note",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    judul: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "notes",
    // Otomatis bikin field 'tanggal_dibuat' sesuai ketentuan tugas 2 lu
    createdAt: "tanggal_dibuat", 
    updatedAt: false, 
  }
);

module.exports = Note;