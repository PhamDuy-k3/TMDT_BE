import mongoose from "mongoose";

export const connect = () => {
    mongoose.connect(
        'mongodb://127.0.0.1:27017/shopee',{}
    ).then(
        () => {
            console.log('Mongodb connected');
        }
    )
}