const { Schema, model } = require("mongoose");
const moment = require("moment");
const PlansSchema = new Schema(
    {
        user:{type: Schema.Types.ObjectId, ref: 'users'},
        plan:{type: Schema.Types.ObjectId, ref: 'plans'}
    }
);
module.exports = model("user_plans", PlansSchema);
