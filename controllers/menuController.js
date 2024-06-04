import Item from "../models/Item";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

export const getMenu = async(req,res)=>{
    const userEmail = req.query.email;
    const userDetails = await User.findOne({
        email: userEmail
    }).select("businessName _id email");

    if(!userDetails){
        throw new ApiError(404, "User not found");
    }

    const menu = await Item.find({
        user: userDetails._id
    }).populate("category", "name _id").populate("pricing");

}