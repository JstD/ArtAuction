const mongoose = require('mongoose')

const db = "mongodb://mongodb:27017/ArtAuction"


const connectDB = async () => {

    try {
        const response = await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useFindAndModify: false,
            // useCreateIndex: true,
        })

        if (response) { console.log('MongoDB connected...') }
    } catch (err) {
        console.log("ERROR:",err.message)
        process.exit(1)
    }
}

module.exports = connectDB