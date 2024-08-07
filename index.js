const express=require("express")
const {v4:uuid4}=require("uuid")
const methodoverride=require("method-override")
const { urlencoded } = require("body-parser")
const path=require("path")
const mongoose=require("mongoose")
const { type } = require("os")
const { StringDecoder } = require("string_decoder")
const connect=mongoose.connect("mongodb://localhost:27017/itemdb")
let counter=0

connect.then(
    ()=>{
        console.log("connected successfully")
    }
)

const itemSchema=mongoose.Schema(
    {
        id:
        {
            type:String,
            required:true
        },
        title:
        {
            type:String,
            required:true
        },
        author:
        {
            type:String,
            required:true
        }
    }
)

const collection=new mongoose.model("items",itemSchema)

const app=express()
app.use(methodoverride("_method"))

app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs")
app.use(express.static("public"))

let items=[
    {
        id:uuid4(),
        title:"Don Quixote",
        author:"Miguel"
    },
    {
        id:uuid4(),
        title:"Treasure Island",
        author:"Robert Louis"
    },
    {
        id:uuid4(),
        title:"Jane Eyre",
        author:"Charlotte"
    },
    {
        id:uuid4(),
        title:"Great Expectations",
        author:"Charles Dickens"
    } 
]

app.get("/items",async(req,res)=>
{
    const items = await collection.find({});
    items.forEach(item => {
        console.log(item);
    });
    res.render("index",{items})
})

app.get("/items/new",(req,res)=>
{
    res.render("newitem")
})

app.get("/items/:id",async(req,res)=>
{
    let {id}=req.params
    let data=await collection.findOne({id:id})
    console.log(data)
    //let data1=items.find((p)=>{ return p.id === id})
    res.render("detailed",{data})
})

app.get("/items/:id/edit",async(req,res)=>
{
    let {id}=req.params
    // let data=items.find((p)=>{ return p.id === id})
    let data=await collection.findOne({id:id})
    console.log(data)
    res.render("edit",{data})
})


app.post("/posts",(req,res)=>{

    const data=new collection(
        {
            id:uuid4(),
            title:req.body.title,
            author:req.body.author
        }
    )
    data.save()
    res.redirect("/items")

})

app.patch("/posts/:id",async(req,res)=>
{
    let {authore}=req.body
    let {id}=req.params
    // let post=items.find((p)=> p.id === id)
    // let data=await collection.findOne({id:id})
    // collection.updateOne({id:id},{author:authore}) 
    const result = await collection.updateOne(
            { id: id },
            { $set: { author: authore } }
        );
    if (result.modifiedCount > 0) {
            res.redirect("/items");
        } else {
            res.status(404).send("Item not found or no changes made");
        }
    // data.author=authore  
    // res.redirect("/items")  
})

app.delete("/posts/:id",async(req,res)=>
{
    let {id}=req.params
    filter = { 'id':id }
    const result = await collection.deleteOne(filter);
        console.log("delete");

        if (result.deletedCount === 1) {
            console.log('Successfully deleted one document.');
        } else {
            console.log('No documents matched the query. Deleted 0 documents.');
        }

    res.redirect("/items")
}
)

app.listen(3038,()=>
{
    console.log("server is running on port 3039")
})