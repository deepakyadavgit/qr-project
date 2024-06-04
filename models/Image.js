import mongoose, { Schema } from "mongoose";

var imageSchema = new Schema({
    img: {
        data: Buffer,
        contentType: String
    }
});

export default mongoose.model("Image", imageSchema);