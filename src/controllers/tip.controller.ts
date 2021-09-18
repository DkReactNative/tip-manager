
import DB from "../models";
import Dayjs  from "dayjs"
const { ObjectId } = DB.mongoose.Types
const  Tip  = DB.Tip

const calculate = (req, res) => {
    const tip = new Tip({
      place: req.body.place,
      totalAmount: req.body.totalAmount,
      tipPercentage: req.body.tipPercentage,
      tipAmount:0
    });
  
    tip.save((err, data) => {
      if (err) {
        return res.status(500).send({ message: err.message || "Something went wrong" });
      }    
      return res.status(200).send({ tip:data.tipAmount});
    });
  };
  
  const analytics = async (req, res) => {
    let conditions: any | object = {};
    if (req.query.startDate && req.query.endDate) {
        let start_date = Dayjs(req.query.user_start_date).format('YYYY-MM-DD HH:mm:ss');
        let end_date = Dayjs(req.query.user_end_date).format('YYYY-MM-DD 23:59:59');
        conditions.createdAt = { $gte: new Date(start_date), $lte: new Date(end_date) };
    } else if(req.query.startDate) {
        let start_date = Dayjs(req.query.user_start_date).format('YYYY-MM-DD HH:mm:ss');
        conditions.createdAt = { $gte: new Date(start_date) };
    } else if(req.query.endDate) {
        let end_date = Dayjs(req.query.user_end_date).format('YYYY-MM-DD 23:59:59');
        conditions.createdAt = { $lte: new Date(end_date) };
    }
    let analyticsType = req.query?.analyticsType;
    var finalResponse;
    if(!analyticsType) {
        finalResponse = await Tip.aggregate([
            { 
                $match:conditions
            }, 
            {
                $group: {
                spentAt: "$place",
                totalAmount: { $sum: "$totalAmount" },
                tipAmount: { $sum: "$tipAmount" },
                }
            }
          ]);
    } else if(analyticsType ==="tipPercentage") {
        conditions.tipPercentage = req.query.tipPercentage || 15
        finalResponse = await Tip.find().count();
        finalResponse= { 
            tipPercentage: conditions.tipPercentage, 
            noOfTimes:finalResponse
            } 
    }
     else if(analyticsType ==="mostVisited") {
        finalResponse = await Tip.aggregate([
            { 
                $match:conditions
            }, 
            {
                $group: {
                place: "$place",
                noOfTimes:{"count" : {$sum : 1}}
                }
            },
            {$sort : {"noOfTimes" : -1}},
            {$limit : 1}
          ]);
  }
  return res.status(200).send(finalResponse);
};
export default {calculate,analytics}