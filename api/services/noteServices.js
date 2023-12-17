const noteModel = require('../models/note')

const findNoteById = async (labelId) =>{
    try{
    const label = await noteModel.findById(labelId)
    if(label){
        console.log('consoled in labelServices.js')
        console.log(label)
        return label
    } else{
        return new Error("Note not found")
    }



    } catch(err){
        return err
    }
}

module.exports = {findNoteById}