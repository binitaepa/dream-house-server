const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const jwt =require('jsonwebtoken')

// dream-house
// hNOUvBEj8SddzEai



// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b2avmfb.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
    const userCollection = client.db("houseDB").collection("users");
    const propertyCollection = client.db("houseDB").collection("properties");
    const reviewCollection = client.db("houseDB").collection("reviews");
    const wishCollection = client.db("houseDB").collection("wish");
    const wishlistCollection = client.db("houseDB").collection("wishlist");
    const ratelistCollection = client.db("houseDB").collection("ratelist");

    const verifyToken = (req, res, next) => {
        console.log('inside verify token', req.headers.authorization);
        if (!req.headers.authorization) {
          return res.status(401).send({ message: 'unauthorized access' });
        }
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
          if (err) {
            return res.status(401).send({ message: 'unauthorized access' })
          }
          req.decoded = decoded;
          next();
        })
      }

      app.post('/jwt',async(req,res)=>{
        const user=req.body;
        
        const token= jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
          expiresIn:'2h'
         
        })
        res.send({ token });
      })
      app.post('/users', async (req, res) => {
        const user = req.body;
        // insert email if user doesnt exists: 
        
        const query = { email: user.email }
        const existingUser = await userCollection.findOne(query);
        if (existingUser) {
          return res.send({ message: 'user already exists', insertedId: null })
        }
        const result = await userCollection.insertOne(user);
        res.send(result);
      });
      app.get('/users', async(req, res) =>{
        const result = await userCollection.find().toArray();
        res.send(result);
    })
    // app.get('/users/:email', async (req, res) => {
    //     const email = req.params.email;
  
    //     if (email !== req.decoded.email) {
    //       return res.status(403).send({ message: 'forbidden access' })
    //     }
  
    //     const query = { email: email };
    //     const user = await userCollection.findOne(query);
       
    //     res.send(user);
    //   })
   app.post('/wish',async(req,res)=>{
    const wishItem=req.body;
    const result=await wishCollection.insertOne(wishItem)
    res.send(result);
   })
 app.get('/wish',async(req,res)=>{
    const email=req.query.email;
    const query={email: email}
    const result = await wishCollection.find().toArray();
        res.send(result);
 })
 app.post('/wishlist',async(req,res)=>{
    const rateItem=req.body;
    const result=await wishlistCollection.insertOne(rateItem)
    res.send(result);
   })
 app.post('/ratelist',async(req,res)=>{
    const rateItem=req.body;
    const result=await ratelistCollection.insertOne(rateItem)
    res.send(result);
   })
   app.get('/ratelist',async(req,res)=>{
    const email=req.query.email;
    const query={email: email}
    const result = await ratelistCollection.find().toArray();
        res.send(result);
 })
 app.delete('/ratelist/:id',async(req,res)=>{
    const id =req.params.id;
    const query ={_id:new ObjectId(id)}
    const result=await ratelistCollection.deleteOne(query);
    res.send(result)
  })
   app.get('/wishlist',async(req,res)=>{
    const email=req.query.email;
    const query={email: email}
    const result = await wishlistCollection.find().toArray();
        res.send(result);
 })
    app.get('/properties', async(req, res) =>{
        const result = await propertyCollection.find().toArray();
        res.send(result);
    })
    app.get('/properties/:id',async(req,res)=>{
        const id =req.params.id;
        const query ={_id:new ObjectId(id)}
        const result=await propertyCollection.findOne(query)
        res.send(result)
      })
    app.get('/reviews', async(req, res) =>{
        const result = await reviewCollection.find().toArray();
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });




    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('house is sitting')
})

app.listen(port, () => {
    console.log(`house is sitting on port ${port}`);
})