const { Schema, model } = require("mongoose");
const moment = require("moment");
const PlansSchema = new Schema(
    {
        creator:{type: Schema.Types.ObjectId, ref: 'users'},
        "plan": {
          "title": {
            "type": "String"
            ,required:true
          },
          "age": {
            "type": "String"
            ,required:true
          },
          "imgUrl": {
            "type": "String"
          },
          "date_created": {
            "type": "Date",
            default:moment.utc().valueOf()
          },
          "description": {
            "type": "String"
            ,required:true
          },
          "difficulty": {
            "type": "Number"
            ,required:true
          },
          "targetMuscles": {
            "type": [
              "Mixed"
            ]
            ,required:true
          },
          "weekDays": {
            "type": [
              "Number"
            ]
            ,required:true
          },
          "workouts": {
            "type": [
              "Mixed"
            ]
            ,required:true
          }
        }
      }
);
module.exports = model("plans", PlansSchema);
