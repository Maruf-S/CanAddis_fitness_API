const router = require('express').Router();
const roles = require('../utils/roles');
const {user_auth,role_auth} = require("../utils/auth");
const Plan = require("../models/Plans");
const UserPlan = require("../models/UserPlans");
//Create
router.post('/',user_auth,role_auth([roles.TRAINER]), async(req, res,next) => {
    try {
        let plan = new Plan({...req.body});
        plan.creator = req.user._id;
        await plan.save();
        await plan.populate('creator','_id email last_name first_name verified date_created bio age gender rating profile_image').execPopulate();
        return res.status(201).json({
            message: "Plan created successfully.",
            success:true,
            plan:plan
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Couldn't crete your plan.",
            success:false
        });
    }
});

//GET
router.get('/:id',user_auth,role_auth([roles.TRAINER,roles.TRAINEE]), async(req, res,next) => {
    try {
        let plan = await Plan.findOne({_id:req.params.id}).populate('creator','_id email last_name first_name verified date_created bio age gender rating profile_image');
        if(plan==null){
            return res.status(404).json({
                message: "Plan doesn't exist.",
                success:false
            });
        }
        return res.status(200).json({
            plan:plan
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Couldn't find the plan.",
            success:false
        });
    }
});
//!GET Personalized plans for feed
router.get('/',user_auth,role_auth([roles.TRAINER,roles.TRAINEE]), async(req, res,next) => {
    //!!!TODO Some personalization logic
    let plans;
    try {
        if(req.query.title){
            plans = await Plan.find({'title':{ "$regex": req.query.title, "$options": "i" }}).populate('creator','_id email last_name first_name verified date_created bio age gender rating profile_image');
        }
        else{
            plans = await Plan.find().populate('creator','_id email last_name first_name verified date_created bio age gender rating profile_image');
        }
        if(plans.length==0){
            return res.status(404).json({
                message: "You have no plans.",
                success:true,
                plans:[]
            });
            //! What if we found 0 because we filtered stuff
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

//Delete
router.delete("/:id",user_auth,role_auth([roles.TRAINER]), async (req,res,next) =>{
    let x = await Plan.deleteOne({_id:req.params.id});
    console.log(x);
    return res.status(200).json({
        message: "Plan deleted successfully.",
        success:true
    });
});
module.exports = router;