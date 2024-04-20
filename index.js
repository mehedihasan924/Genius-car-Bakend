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

    app.get('/services', async (req, res) => {
      const query = {}
      const cursor = serviceCollecttion.find(query);
      const srevices = await cursor.toArray();
      res.send(srevices);
    });

    app.get('/services/:id', async(req, res) =>{
      const id=req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollecttion.findOne(query);
      res.send(service)    
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