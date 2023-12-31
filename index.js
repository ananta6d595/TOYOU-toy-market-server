const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


const corsConfig = {
    origin: '*',
    credential: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"]
}

app.use(cors(corsConfig));
// app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3umwupw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
         client.connect();

        const toysCollection = client.db('lego').collection('toys');

        // all toys
        app.get('/toys', async (req, res) => {
            const result = await toysCollection.find().toArray();
            res.send(result);
        })

        app.get('/toys/Ascending', async (req, res) => {
            const result = await toysCollection.find().sort({price:1}).toArray();
            res.send(result);
        })
        app.get('/toys/Descending', async (req, res) => {
            const result = await toysCollection.find().sort({price:-1}).toArray();
            res.send(result);
        })

        // send single toy detail
        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const toy = await toysCollection.findOne(query);
            res.send(toy);
        })

        //sub_category
        // app.get('/toys/:category', async (req, res) => {
        //     const category = req.params.category.toString();
        //     const query = { sub_category: category }
        //     const toys = await toysCollection.find(query).toArray();
        //     res.send(toys);
        // })

        app.post('/addToys', async (req, res) => {
            const toyDetails = req.body;
            console.log(toyDetails);
            const result = await toysCollection.insertOne(toyDetails);
            res.send(result);
        })


        app.patch('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const updatedToy = req.body;
            const updateDoc = {
                $set: updatedToy
            }
            const result = await toysCollection.updateOne(filter, updateDoc);
            res.send(result);
        })



        app.delete('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.deleteOne(query);
            res.send(result);
        })





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`Toys Server is running on port ${port}`)
})