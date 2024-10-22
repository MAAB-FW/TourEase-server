const express = require("express")
const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb")
require("dotenv").config()
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wkufpua.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// const uri = "mongodb://localhost:27017"

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
})

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect()

        const touristsSpotCollection = client.db("touristsSpotDB").collection("touristsSpots")
        const countriesCollection = client.db("touristsSpotDB").collection("countries")

        app.get("/all-tourists-spot", async (req, res) => {
            const result = await touristsSpotCollection.find().toArray()
            res.send(result)
        })

        app.get(`/one-tourist-spot/:id`, async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await touristsSpotCollection.findOne(query)
            res.send(result)
        })

        app.get(`/my-list/:email`, async (req, res) => {
            const emailId = req.params.email
            const query = { user_email: emailId }
            const result = await touristsSpotCollection.find(query).toArray()
            res.send(result)
        })

        app.get("/countries", async (req, res) => {
            const result = await countriesCollection.find().toArray()
            res.send(result)
        })

        app.get(`/countries/:id`,async(req, res)=>{
            const id = req.params.id
            const query = {country_name: id}
            const result = await touristsSpotCollection.find(query).toArray()
            res.send(result)
        })

        app.post("/add-tourists-spot", async (req, res) => {
            const data = req.body
            const result = await touristsSpotCollection.insertOne(data)
            res.send(result)
        })

        app.patch(`/update/:id`, async (req, res) => {
            const uId = req.params.id
            const updatedData = req.body
            const filter = { _id: new ObjectId(uId) }
            const updateSpot = {
                $set: {
                    tourists_spot_name: updatedData.tourists_spot_name,
                    image: updatedData.image,
                    country_name: updatedData.country_name,
                    location: updatedData.location,
                    short_description: updatedData.short_description,
                    average_cost: updatedData.average_cost,
                    seasonality: updatedData.seasonality,
                    travel_time: updatedData.travel_time,
                    total_visitors_per_year: updatedData.total_visitors_per_year,
                },
            }
            const result = await touristsSpotCollection.updateOne(filter, updateSpot)
            res.send(result)
        })

        app.delete(`/delete/:id`, async (req, res) => {
            const spotId = req.params.id
            const query = { _id: new ObjectId(spotId) }
            const result = await touristsSpotCollection.deleteOne(query)
            res.send(result)
        })

        // app.get("/tourists-spots", (req, res) => {
        //     res.send("testing live server")
        // })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 })
        console.log("Pinged your deployment. You successfully connected to MongoDB!")
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close()
    }
}
run().catch(console.dir)

app.get("/", (req, res) => {
    res.send("server is running")
})

app.listen(port, () => {
    console.log("server running in port:", port)
})
