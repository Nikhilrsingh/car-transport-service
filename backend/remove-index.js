import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const removeIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/car-transport");
        const User = mongoose.connection.collection("users");
        
        await User.dropIndex("username_1");
        console.log("Successfully removed stale username_1 index!");
    } catch (e) {
        if (e.code === 27) {
            console.log("Index username_1 does not exist, nothing to do!");
        } else {
            console.error("Error removing index:", e);
        }
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

removeIndex();
