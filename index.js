const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;


//middle wares 
app.use(cors());
app.use(express.json());

//mongodb connect

// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASSWORD);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster.vhso9zf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster`;

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
    const serviceCollecttion = client.db('geniusCar').collection('service');
    const orderCollection = client.db('geniusCar').collection('orders');


    app.get('/services', async (req, res) => {
      const query = {}
      const cursor = serviceCollecttion.find(query);
      const srevices = await cursor.toArray();
      res.send(srevices);
    });

    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const service = await serviceCollecttion.findOne(query);
      res.send(service)
    });

    //orders API
    app.get('/orders', async(req, res) => {
      let query = {};
         if (req.query.email){
          query = {
             email: req.query.email
           }
      }
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    })
       app.post('/orders', async(req, res) => {
         const order = req.body;
         const result = await orderCollection.insertOne(order);
         res.send(result);
    })
  }
  finally {
    
  }
}
run().catch(err=>console.error(err));



app.get('/', (req, res) =>{
    res.send('Server Is Runing...')
})

app.listen(port, () => {
        console.log(`Genius car Server Running On ${port}`);
 })