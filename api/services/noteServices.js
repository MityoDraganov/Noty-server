const noteModel = require('../models/note')

const findNoteById = async (labelId) =>{
    try{
    const note = await noteModel.findById(labelId)
    if(note){
        console.log('consoled in noteSerives.js')
        console.log(note)
        return note
    } else{
        return new Error("Note not found")
    }

    } catch(err){
        return err
    }
}

module.exports = {findNoteById}