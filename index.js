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


            res.send(result)
        })


        app.get('/properties/:id', async (req, res) => {
            const { id } = req.params;
            try {
                const property = await propertiesCollection.findOne({ _id: new ObjectId(id) });
                if (!property) {
                    return res.status(404).send({ message: "Property not found" });
                }
                res.send(property);
            } catch (err) {
                res.status(500).send({ message: "Invalid property ID" });
            }
        });

        app.post("/properties", async (req, res) => {
            try {
                const property = req.body;
                property.PostedDate = new Date().toISOString();
                const result = await propertiesCollection.insertOne(property);
                res.status(201).json(result);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        app.get("/properties", async (req, res) => {
            try {
                const { userEmail } = req.query;
                const query = userEmail ? { userEmail } : {};
                const properties = await propertiesCollection.find(query).toArray();
                res.json(properties);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        app.get("/properties", async (req, res) => {
            try {
                const { userEmail } = req.query; 
                const query = userEmail ? { "PostedBy.Email": userEmail } : {}; 
                const properties = await propertiesCollection.find(query).toArray();
                res.json(properties);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });


        // Delete property
        app.delete("/properties/:id", async (req, res) => {
            try {
                const { id } = req.params;
                await propertiesCollection.deleteOne({ _id: new ObjectId(id) });
                res.json({ message: "Deleted successfully" });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {



    }
}


run().catch(console.error);

app.listen(port, () => {
    console.log(`HomeNest server is running on port: ${port}`)
})