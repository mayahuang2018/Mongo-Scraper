//"Note" Model

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  
  body: String

});

//创建Note类；
var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;