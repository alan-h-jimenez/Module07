import mongoose from 'mongoose'

// Connecting to the database via promisses
// mongoose
//     .connect(process.env.DB)
//     .then(() => console.log('Connected to the database...'))
//     .catch((err) => console.log(err))

// Connecting to the database via Async
const connectDB = (url) => {
    return mongoose.connect(url)
}

export default connectDB