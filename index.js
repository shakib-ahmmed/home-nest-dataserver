const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');


const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://<db_username>:<db_password>@cluster0.ovreryk.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


app.get('/', (req, res) => {
    res.send('smart server is running')
})

async function run() {
    try {
        await client.connect();
        const db = client.db('homenestDBUSers')
        const propertiesCollection = db.collection('properties')

        app.get('/properties', async (req, res) => {

            const result = await propertiesCollection.find().toArray()

            console.log(result)








            res.send('result')
        })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}


run().catch(console.dr)

app.listen(port, () => {
    console.log(`smart server is running on port: ${port}`)
})