import mongoose from 'mongoose';

const Connection = async(username, password) => {
    const URL = `mongodb+srv://user:user@cluster0.hunicli.mongodb.net/blogging?retryWrites=true&w=majority&appName=Cluster0`;
    try {
        mongoose.connect(URL, { useNewUrlParser: true })
        console.log('Database connected successfully');
    } catch (error) {
        console.log('Error while connecting to the database ', error);
    }
};

export default Connection;