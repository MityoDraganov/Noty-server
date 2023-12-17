const userModel = require('../models/user')

const findUserById = async (userId) =>{
    try{
    const user = await userModel.findById(userId)
    if(user){
        console.log('consoled in userServices.js')
        console.log(user)
        return user
    } else{
        return new Error("User not found")
    }



    } catch(err){
        return err
    }
}

module.exports = {findUserById}