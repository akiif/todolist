const express = require("express");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

const username = "";
const password = "";
const cluster = "";
const url = "mongodb+srv://" + username + ":" + password + "@" + cluster + ".cgszsdi.mongodb.net/todolistDB";

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(express.urlencoded({
    extended: true
}));

mongoose.connect(url)

const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);


const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item"
});

const item3 = new Item({
    name: "<-- Hit this to delete a item."
});

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);

const insertInitialData = function () {

    Item.insertMany(defaultItems, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Successfully inserted the Default Items.")
        }
    });
}


app.get("/", function (req, res) {

    Item.find({}, function (err, retrievedItems) {
        if (err) {
            console.log(err);
        } else {
            if (retrievedItems.length) {
                const day = date.getDate();
                res.render('list', {
                    listTitle: day,
                    newListItems: retrievedItems
                });
            } else { // If there are no items present then insert the initial data
                insertInitialData();
                res.redirect("/");
            }
        }
    });
});

app.post("/", function (req, res) {
    const listName = req.body.list;

    const newItem = new Item({
        name: req.body.newItem
    });

    const day = date.getDay() + ",";

    if (listName === day) {
        newItem.save(function (err) {  
            res.redirect("/");
        });
    } else {
        List.findOne({name: listName}, function (err, foundList) {  
            foundList.items.push(newItem);
            foundList.save(function (err) {  
                res.redirect("/" + _.lowerFirst(listName));
            });
        });
    }
});


app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    
    if (listName === date.getDate()) {
        Item.findByIdAndDelete(checkedItemId, function (err) {
            if (err) {
                console.log("Failed to delete the item.");
            } else {
                console.log("Successfully Deleted the item.");
                res.redirect("/");
            }
        });
    } else {
        List.findOneAndUpdate(
            {name: listName},
            {$pull: {
                items: {
                    _id: checkedItemId
                }
            }},
            function (err, foundList) {  
                if (!err) {
                    console.log("Successfully Deleted the item.");
                    res.redirect("/" + _.lowerFirst(listName));
                }
            }
        );
    }
});

app.get("/:customListName", function (req, res) {  
    const customListName = _.capitalize(req.params.customListName);

    if(customListName === "Favicon.ico" || customListName === "Favicon.png") return;

    List.findOne({name: customListName}, function (err, customList) {  
        if(err) {
            console.log(err);
        } else {
            if (!customList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save(function (err) {  
                    res.redirect("/" + customListName);
                }); 
            } else {
                res.render("list", {
                    listTitle: customListName,
                    newListItems: customList.items
                });
            }
        }
    });
});

app.get("/about", function (req, res) {
    res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function () {
    console.log("Server running on port " + port + ".");
});