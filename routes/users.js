const router = require('express').Router();
const roles = require('../utils/roles')
const {user_register,user_login,user_auth,serialize_user,role_auth,update_user,change_password} = require("../utils/auth");
const User = require("../models/User");
const Plan = require("../models/Plans");
router.post("/register-trainer",async (req,res) =>{
    return await user_register(req.body,roles.TRAINER,res);
})

router.post("/register-trainee",async (req,res) =>{
    return await user_register(req.body,roles.TRAINEE,res);
})

router.post("/login",async (req,res) =>{
    return await user_login(req.body,res);
})

router.get("/profile",user_auth,role_auth([roles.TRAINEE,roles.TRAINER]),async (req,res) =>{
    return res.json(await User.findOne({_id:req.user._id}).select(["-password"]));
})
router.get("/current",user_auth, async(req,res,next) =>{
    let user = await User.findById(req.user_id).select(["-password"]);
    return res.json(user);
})
router.put('/update',user_auth,role_auth([roles.TRAINER,roles.TRAINEE]), async(req, res,next) => {
    return await update_user(req.user._id,req.body,res);
})
router.put("/update-password",user_auth,role_auth([roles.TRAINER,roles.TRAINEE]), async (req,res,next) =>{
    return await change_password(req.user._id,req.body.old_password,req.body.new_password,res);
})
//!GET Plans THE TRAINER created
router.get('/plans-created',user_auth,role_auth([roles.TRAINER]), async(req, res,next) => {
    try {
        let plans = await Plan.find({creator:req.user._id}).populate('creator','_id email last_name first_name verified date_created bio age gender rating');
        if(plans.length==0){
            return res.status(204).json({
                message: "You have no plans.",
                success:true,
                plans:[]
            });
        }
        return res.status(200).json({
            plans
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "No plans in db",
            success:false
        });
    }
});

module.exports = router;