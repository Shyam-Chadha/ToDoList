//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = {
  Name:String
};

const item = mongoose.model("item",itemsSchema);

const wake = new item({
  Name: "Wake"
});

const brush = new item({
  Name:"Brush"
});

const eat = new item({
  Name: "Eat"
});

const defaultItems = [wake,brush,eat];

const listSchema = {
  name:String,
  items:[itemsSchema]
};

const List = mongoose.model("list",listSchema);


app.get("/", function(req, res) {
  
  item.find({},function (err,found) {
    if(found.length===0){
item.insertMany(defaultItems, function (err) {
  if(err){
    console.log(err);
  }
  else{
    console.log("Success");
  }
});
res.redirect("/");
}
  else{
    res.render("list", {listTitle: "Today", newListItems: found})
  }
});
});

app.get("/:customToDOList",function (req,res) {
  const customToDo = req.params.customToDOList;

  List.findOne({name:customToDo},function(err,founditem) {
    if(!err){
      if(!founditem){
        const list = new List({
          name: customToDo,
          items:defaultItems
        });
        list.save();
           res.redirect("/" + customToDo);
      }
      else{
        res.render("list", {listTitle: founditem.name, newListItems: founditem.items});
      }
    }
  })

 
});
   
app.post("/", function(req, res){

  const NewItem = req.body.newItem;
  const listName = req.body.list;

  const ite = new item({
    Name: NewItem
  });

  if(listName === "Today"){
    ite.save();
    res.redirect("/");
  }else{
    List.findOne({name:listName} ,function (err,foundList) {
      
        foundList.items.push(ite);
        foundList.save();
        res.redirect("/" + listName); 
    })
  }
  
  });

app.post("/delete",function (req,res) {
  const checked =req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){
    item.findByIdAndRemove(checked,function (err) {
      if(err){
        console.log(err);
      }
      else{
        console.log("Success");
        res.redirect("/");
      }
    });
  }
  else{
    List.findOneAndUpdate({name: listName},{$pull:{items:{_id:checked}}},function (err,found) {
      if(!err){
        res.redirect("/" + listName);
      }
    })
  }
})

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});