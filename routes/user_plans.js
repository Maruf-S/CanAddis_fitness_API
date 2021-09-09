const router = require('express').Router();
const roles = require('../utils/roles');
const {user_auth,role_auth} = require("../utils/auth");
const Plan = require("../models/Plans");
const UserPlan = require("../models/UserPlans");


//! Trainee(user) adding and removing plans from here on
//! Repeat
// Add a user plan
//! RETURNS 409 IF A PLAN IS ALREADY SAVED 
router.post('/:plan_id',user_auth,role_auth([roles.TRAINEE]), async(req, res,next) => {
    try {
        let check_dup  = await UserPlan.find({user:req.user._id,plan:req.params.plan_id});
        if(check_dup!=null){
            return res.status(409).json({
                message: "Plan is already saved.",
                success:false,
            });
        }
        let user_plan = new UserPlan({user:req.user._id,plan:req.params.plan_id});
        await user_plan.save();
        await user_plan.populate('user','_id email last_name first_name verified date_created bio age gender rating').populate("plan").execPopulate();
        return res.status(201).json({
            message: "Plan created successfully.",
            success:true,
            user_plan
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Couldn't crete your plan(Referenced plan could't be found).",
            success:false
        });
    }
});
// get saved plans user
router.get('/',user_auth,role_auth([roles.TRAINER]), async(req, res,next) => {
    try {
        let user_plans = await UserPlan.find({user:req.user._id}).populate('user','_id email last_name first_name verified date_created bio age gender rating').populate("plan");
        if(user_plans.length==0){
            return res.status(204).json({
                message: "You have no plans added.",
                success:true
            });
        }
        return res.status(200).json({
            user_plans
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "No plans in db 500",
            success:false
        });
    }
});
// delete saved plans user
router.delete('/:id',user_auth,role_auth([roles.TRAINEE]), async(req, res,next) => {
    try {
        let x = UserPlan.deleteOne({user:req.user.id});
        console.log(x);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error deleting.",
            success:false
        });
    }
});
module.exports = router;