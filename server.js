const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());


const FILE_PATH = "./items.json";

// Create file if not exists
if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify([], null, 2));
}


const readItems = () => {
    const data = fs.readFileSync(FILE_PATH);
    return JSON.parse(data);
};

// Helper: Write file
const writeItems = (data) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};

// GET all items
app.get("/api/items", (req, res) => {
    const items = readItems();
    res.json(items);
});

// POST add item
app.post("/api/items", (req, res) => {
    const { name, price } = req.body;

    if (!name || !price) {
        return res.status(400).json({ message: "Name and price required" });
    }

    const items = readItems();

    const newItem = {
        id: Date.now(),
        name,
        price
    };

    items.push(newItem);
    writeItems(items);

    res.status(201).json(newItem);
});

// PUT update item
app.put("/api/items/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const items = readItems();

    const index = items.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Item not found" });
    }

    items[index] = {
        ...items[index],
        name: req.body.name || items[index].name,
        price: req.body.price || items[index].price
    };

    writeItems(items);

    res.json(items[index]);
});

// DELETE item
app.delete("/api/items/:id", (req, res) => {
    const id = parseInt(req.params.id);
    let items = readItems();

    items = items.filter(item => item.id !== id);

    writeItems(items);

    res.json({ message: "Item deleted" });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});