const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
const { query } = require('express');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j095x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db('travel-db')
        const packageCollection = database.collection('packages')

        const bookingPackageCollection = database.collection('bookingPackageList')
        const myEventCollection = database.collection('MyEventCollection')

        app.post('/packages', async (req, res) => {
            const cursor = req.body
            const result = await packageCollection.insertOne(cursor)
            res.json(result)
        })
        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({})
            const result = await cursor.toArray()
            res.json(result)
        })

        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await packageCollection.findOne(query)
            res.json(result)
        })

        app.delete('/packages/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await packageCollection.deleteOne(query)
            res.json(result)
        })

        app.post('/bookingPackage', async (req, res) => {
            const cursor = req.body
            const result = await bookingPackageCollection.insertOne(cursor)
            res.json(result)
        })
        app.get('/bookingPackage', async (req, res) => {
            const query = bookingPackageCollection.find({})
            const result = await query.toArray()
            res.json(result)
        })

        app.get('/bookingPackage/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await bookingPackageCollection.findOne(query)
            res.json(result)
        })

        app.put('/bookingPackage/:id', async (req, res) => {
            const id = req.params.id
            const updateUser = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    status: updateUser.status = "Approve",

                }
            }
            const result = await bookingPackageCollection.updateOne(filter, updateDoc, options)
            res.json(result)
        })
        app.delete('/bookingPackage/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await bookingPackageCollection.deleteOne(query)
            res.json(result)
        })

        app.post('/myPackage', async (req, res) => {
            const cursor = req.body
            const result = await myEventCollection.insertOne(cursor)
            res.json(result)
        })
        app.get('/myPackage', async (req, res) => {
            const query = myEventCollection.find({})
            const result = await query.toArray()
            res.json(result)
        })



    }
    finally {
        // await client.close()
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('hello')
})
app.listen(port, () => {
    console.log('success', port)
})