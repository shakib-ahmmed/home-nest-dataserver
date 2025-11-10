const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');


const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://homenestDBUSer:oXM0V2Eg9Hwdc010@cluster0.ovreryk.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/', (req, res) => {
    res.send('HomeNest API is running');


});



async function run() {
    try {
        await client.connect();

        const db = client.db('homenestDBUser')
        const propertiesCollection = db.collection('properties');


        app.get('/properties', async (req, res) => {

            const result = await propertiesCollection.find().toArray()

            console.log(hello)
            res.send(result)
        })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {



    }
}


run().catch(console.error);

app.listen(port, () => {
    console.log(`HomeNest server is running on port: ${port}`)
})