// ()
const express = require("express")                                                            
const cors = require( 'cors' )
const fs = require("fs").promises
const path = require("path")

const app = express()

//cors is enabled through out the entire app                                                                                  
app.use( cors() );

// getting the data from json
const dataFile = path.join(__dirname, "data.json")

// allowing receiving data from post request with url encoded
app.use(express.urlencoded({ extended: true }))

app.get("/poll", async (req,res)=>{
    // res.send("Hello")
    let data = JSON.parse(await fs.readFile(dataFile, "utf-8"))

    const totalVotes = Object.values(data).reduce((total, n)=>total+=n, 0)

    let result = {total: 0, data: []}
    Object.entries(data).map(([label, votes], _)=>{
        result.data.push(votes)
    })
    result.total = totalVotes

    res.json(result)
})

app.post("/poll", async (req,res)=>{
    let data = JSON.parse(await fs.readFile(dataFile, "utf-8"))

    console.log(req.body.add)
    data[req.body.add]++

    await fs.writeFile(dataFile, JSON.stringify(data))

    res.end()
})



app.listen(3000, ()=>console.log("Server is running!"))