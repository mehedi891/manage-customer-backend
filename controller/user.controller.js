const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const jwt_privateKey = 'djakdjkajdkjakdjkajdkjakdj%ksdjksj%';


const getAllUsers = async(req,res) =>{
    try {
        const allUsers = await userModel.find({})
        res.status(200).json(allUsers)
    } catch (error) {
        res.status(404).json({
            error: error.message,
            message: 'Something missing'
        })
    }
    
}


const getAUserByEmail = async(req,res) =>{
    const email = req.params.email
    try {
        const aUser = await userModel.findOne({email})
        res.status(200).json(aUser)
    } catch (error) {
        res.status(404).json({
            message: 'Email not found'
        })
    }
}

const updateUserByEmailOrID = async(req,res) =>{
    const emailOrId = req.params.emailOrId;
    
    let updatedUser = req.body;
    try {
        
        if (updatedUser.password){
            const encryptedPass =  bcrypt.hashSync(req.body.password, saltRounds);
             updatedUser = {...updatedUser,password:encryptedPass}
        }
        
        const oneUserFindByEmail = await userModel.find({email:emailOrId});

        if(oneUserFindByEmail.length > 0){
            const oneUserFindByEmailUpdate = await userModel.updateOne({email: emailOrId},{
                $set:updatedUser
            });
            res.status(200).send(oneUserFindByEmailUpdate);
        }else{
            const oneUserFindByIdUpdate = await userModel.updateOne({_id: emailOrId},{
                $set: updatedUser
            });
            res.status(200).send(oneUserFindByIdUpdate);
        }
    } catch (error) {
        res.status(404).json({
            message: 'User not found',
        });
    }
}

const deleteAUser = async(req,res) =>{
    const id = req.params.id
    try {
         await userModel.findByIdAndDelete({_id:id})
        const existsUser = await userModel.find({})
        res.status(200).json(existsUser)
    } catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }

}

const createAUser = async(req,res) =>{
  try {
    const existUser = await userModel.find({email:req.body.email});
    if(existUser.length > 0){
        res.status(200).json({
            message: `Email is already use`
        })
    }
    else{
        const password = bcrypt.hashSync(req.body.password, saltRounds);
        const newUser = new userModel({
            name: req.body.name,
            email: req.body.email,
            password,
            img: req.body.img,
        });
    await newUser.save();
    res.status(200).json({
        message:'User created Successfully',
        newUser
    })
    }
    
  } catch (error) {
    res.status(404).json({
        error: error.message,
        message: 'Something missing'
    })
  }

   
}

const loginUser = async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

   try {
    const user = await userModel.findOne({email});
    if (!user){
        res.status(404).json({
            message: 'Email not found'
        })
    }else{
        const checkPass =  bcrypt.compareSync(password, user.password);
        if (checkPass){
            const token = jwt.sign({name:user.name,email:user.email,img:user.img,role:user.role,loggedIn:true,}, jwt_privateKey,{
                expiresIn: '10000'
            });
            res.status(200).json({token})
        }
        else{
            res.status(404).json({
                message:`Authentication failed`
            })
        }
        
    }
    
   } catch (error) {
    res.status(404).json({
        message:error.message
    })
   }
}

const getUsersOnlineStatus = async(req,res) =>{
    try {
        const online = await userModel.find({onlineStatus:true});
        console.log(online);
        if(online.length === 0){
            res.status(404).json({
                message: 'No one is online'
            })
        }else{
            res.status(200).json(online)
        }
        
    } catch (error) {
        res.status(404).json({
            message:error.message
        })
    }
}


module.exports = {
    getAllUsers,
    createAUser,
    loginUser,
    getAUserByEmail,
    updateUserByEmailOrID,
    deleteAUser,
    getUsersOnlineStatus
}