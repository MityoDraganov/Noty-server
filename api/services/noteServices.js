const labelModel = require('../models/note')

const findNoteById = async (labelId) =>{
    try{
    const label = await labelModel.findById(labelId)
    if(label){
        console.log('consoled in labelServices.js')
        console.log(label)
        return label
    } else{
        return new Error("label not found")
    }



    } catch(err){
        return err
    }
}

module.exports = {findNoteById}