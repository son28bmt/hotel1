const express = require('express')
const cors = require('cors')
const {graphqlHTTP} = require('express-graphql')
const mongoose = require('mongoose')
const schema = require("./schemas/Schema.js")
const isAuth = require('./middlewares/isAuth.js')
const dotenv = require('dotenv')

const app = express()
app.use(cors())
app.use(express.json())
app.use(isAuth)
dotenv.config()

const mongoURL = process.env.MONGO_URL
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.error("MongoDB connection error:", err));

mongoose.connection.once('open', () => console.log("DB Connected..."))
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
})

app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
}))
const port = process.env.PORT || 3001;
app.listen(port, () => console.log("Sever is running on port", port))
app.get('/', (req,res) => res.send("Auth system..."))