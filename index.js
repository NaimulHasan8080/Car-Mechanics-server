const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId
const cors = require("cors");
require('dotenv').config()
const app = express();
const port = 4000;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nsqce.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        console.log("connect to db")
        const database = client.db("carMechanics");
        const servicesCollection = database.collection("services");

        //GET API full
        app.get('/userService', async (req, res) => {
            const cursor = servicesCollection.find({});
            const service = await cursor.toArray();
            res.json(service)
        })

        //GET Single API
        app.get('/userService/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.findOne(query);
            res.json(result)
        })


        //POST API
        app.post('/userService', async (req, res) => {
            const userData = req.body;
            const result = await servicesCollection.insertOne(userData);
            res.json(result)
        });

        //DELETE API
        app.delete('/userService/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.deleteOne(query);
            res.json(service)
        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

console.log(uri)
app.get('/', (req, res) => {
    res.send("get server site successfully")
})

app.listen(port, () => {
    console.log("running", port)
})