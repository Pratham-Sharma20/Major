const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"./public")));

main().then(()=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.get("/",(req,res)=>{
    res.send("hi");
});

//Index route 
app.get("/listings",async(req,res)=>{
    const allListings = await Listing.find({})
    // console.log(allListings);
    res.render("./listings/index.ejs", { allListings });
});

//New Route
app.get("/listings/new", (req,res) =>{
    res.render("./listings/new.ejs");
});

//Create Route
app.post("/listings", async(req,res) =>{
    const newListing = new Listing(req.body.Listing);
    await newListing.save();
    res.redirect("/listings");
});

//show route
app.get("/listings/:id", async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
});

//Edit Route
app.get("/listings/:id/edit", async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing}); 
});

//Update Route
app.put("/listings/:id", async(req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async(req,res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

// app.get("/testListing", async(req,res)=>{
//     let sampleListing = new Listing ({
//         title : "my new Villa",
//         description : "by the beach",
//         price : 1200,
//         location : "Calangute, Goa",
//         country : "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("succesfull testing");
// });

app.listen(port, ()=>{
    console.log("listening to port 8080");
});