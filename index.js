const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');

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
        const db = client.db('homenestDBUser');
        const propertiesCollection = db.collection('properties');
        const reviewsCollection = db.collection('reviews');





        app.get('/properties', async (req, res) => {
            try {
                const { userEmail } = req.query;
                const query = userEmail ? { "PostedBy.Email": userEmail } : {};
                const properties = await propertiesCollection.find(query).toArray();
                res.json(properties);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });




        app.get('/properties/:id', async (req, res) => {
            const { id } = req.params;
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Invalid property ID" });
            }
            try {
                const property = await propertiesCollection.findOne({ _id: new ObjectId(id) });
                if (!property) return res.status(404).json({ message: "Property not found" });
                res.json(property);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });



        app.post('/properties', async (req, res) => {
            try {
                const property = req.body;
                property.PostedDate = new Date().toISOString();
                const result = await propertiesCollection.insertOne(property);
                res.status(201).json(result);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });



        app.delete('/properties/:id', async (req, res) => {
            const { id } = req.params;
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Invalid property ID" });
            }
            try {
                await propertiesCollection.deleteOne({ _id: new ObjectId(id) });
                res.json({ message: "Deleted successfully" });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });



        app.get('/reviews/:propertyId', async (req, res) => {
            const { propertyId } = req.params;
            try {
                const reviews = await reviewsCollection.find({ propertyId }).toArray();
                res.json(reviews);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });



        app.post('/reviews', async (req, res) => {
            try {
                const review = req.body;
                review.createdAt = new Date().toISOString();
                const result = await reviewsCollection.insertOne(review);
                res.status(201).json(result);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        app.get("/ratings", async (req, res) => {
            const email = req.query.email;

            if (!email) {
                return res.status(400).json({ message: "Email query is required" });
            }

            try {
                const ratings = await reviewsCollection.find({ email }).toArray();
                res.json(ratings);
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });

        app.put('/properties/:id', async (req, res) => {
            const { id } = req.params;
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Invalid property ID" });
            }

            try {
                const { _id, ...updateData } = req.body; 
                updateData.Price = Number(updateData.Price); 

                console.log("Updating property:", id, updateData);

                const result = await propertiesCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updateData }
                );

                if (result.matchedCount === 0) {
                    return res.status(404).json({ message: "Property not found" });
                }

                res.json({ message: "Property updated successfully" });
            } catch (err) {
                console.error("PUT /properties/:id error:", err);
                res.status(500).json({ error: err.message });
            }
        });




        console.log("MongoDB connected and backend routes are ready!");
    } catch (err) {
        console.error(err);
    }
}

run().catch(console.error);

app.listen(port, () => {
    console.log(`HomeNest server is running on port: ${port}`);
});
