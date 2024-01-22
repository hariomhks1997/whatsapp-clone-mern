import mongoose from 'mongoose';

const Connection = async (username, password) => {
    const URL = "mongodb+srv://hariomhks088:987654321@cluster0.exgkj.mongodb.net/"
    try {
        await mongoose.connect(URL);
        console.log('Database Connected Succesfully');
    } catch(error) {
        console.log('Error: ', error.message);
    }

};

export default Connection;