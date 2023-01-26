const User=require('../models/User')
const bcrypt= require('bcrypt')
const jwt= require('jsonwebtoken')



    async function register (req, res){
        const user= User.find({login: req.body.login})
        if((await user).length >=1 ){
            return res.json({message : "login already used"})
            } else {
                
                bcrypt.hash(req.body.password, 10, async(error, hash)=>{
                    if(error){
                        return res.json({message: "error in password"});
                    } else {
                        const auth= await new User({
                            login: req.body.login ,
                            password: hash
                        }).save();
                        res.json({
                            message: "Success",
                            
                        })
                    }
                })
            }
    }

    async function login(req, res) {
        const {login, password} = req.body
        const user= await User.findOne({login});
        if(!user){
            return res.json({message : "user not exist"});
        } else {
            bcrypt.compare(password, user.password, async (error, result)=>{
                if(error) {
                    return res.json({message: "password not exist"});
                } 
                if(result){
                   const token=jwt.sign({id: user._id}, process.env.JWT_SECRET,{expiresIn:'30d'})
                   return res.json({
                    message: "Success",
                    data: {
                        login: user.login,
                        token: token,
                        balance: user.balance 
                    }
                   })
                } else {
                    return res.json({
                        message: "problem with login",
                        
                       })
                }
            })
        }
    }
    
module.exports= ({
    register,
    login
})