const express = require('express') // Requires Express framework
const bodyParser = require('body-parser') // Body parser (middleware)
const app = express() // Express app
const port = 4000 // Port to run in

// pathing to build -- run "npm run build" first
const path = require('path');
app.use(express.static(path.join(__dirname, '../build')));
app.use('/static', express.static(path.join(__dirname, 'build//static')));
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// CORS handling
const cors = require('cors');
app.use(cors());
app.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
res.header("Access-Control-Allow-Headers",
"Origin, X-Requested-With, Content-Type, Accept");
next();
});

/* DATABASE CONNECTION AND MODIFICATION */
const mongoose = require('mongoose'); // Mongoose database

main().catch(err => console.log(err)); // Execute main. If error, log it

// Connect to database
async function main() {
  await mongoose.connect('mongodb+srv://admin:admin@cluster0.mwfwgau.mongodb.net/?retryWrites=true&w=majority');
}

// Books schema - containing title, cover, and author
const bookSchema = new mongoose.Schema({
    title: String,
    cover: String,
    author: String,
});

// Schema to Model
const bookModel = mongoose.model('BooksOK', bookSchema)

// JSON data
const booksJSON = {
    "books":[
        {
        "title": "Learn Git in a Month of Lunches",
        "isbn": "1617292419",
        "pageCount": 0,
        "thumbnailUrl":
        "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/umali.jpg",
        "status": "MEAP",
        "authors": ["Rick Umali"],
        "categories": []
        },
        {
        "title": "MongoDB in Action, Second Edition",
        "isbn": "1617291609",
        "pageCount": 0,
        "thumbnailUrl":
        "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/banker2.jpg",
        "status": "MEAP",
        "authors": [
        "Kyle Banker",
        "Peter Bakkum",
        "Tim Hawkins",
        "Shaun Verch",
        "Douglas Garrett"
        ],
        "categories": []
        },
        {
            "title": "Getting MEAN with Mongo, Express, Angular, and Node",
            "isbn": "1617292036",
            "pageCount": 0,
            "thumbnailUrl":
            "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/sholmes.jpg",
            "status": "MEAP",
            "authors": ["Simon Holmes"],
            "categories": []
            }
        ]
};

// GET request in hello, printing out "hello name" if called hello/name
app.get('/hello/:name', (req, res) => {
    res.send('Hello '+req.params.name)
})

/* BOOKS DISPLAY AND DATA HANDLING */

// GET request, returning the JSON
app.get('/api/books', (req, res) => {
    // Find all records in database, return in JSON
    bookModel.find( (err, data) => {
        res.json(data);
    })
})

// GET request, request data from the id
app.get('/api/books/:id', (req, res)=> {
    console.log(req.params.id);
    // Find the record by ID, return the data requested
    bookModel.findById(req.params.id, (err, data)=>{
        res.json(data);
    })
})

// POST request, creates a record in the database from the form
app.post('/api/books', (req, res)=>{
    console.log(req.body);

    // Create record in Database
    bookModel.create({
        title: req.body.title,
        cover: req.body.cover,
        author: req.body.author
    })

    // Notify that data is received.
    res.send("Data Received");
})

// PUT request, update the book by finding the ID and update
app.put('/api/book/:id',(req, res)=>{
    // Log in the ID and body of request to update
    console.log("Update: "+req.params.id);

    // Find book by ID and update data
    bookModel.findByIdAndUpdate(req.params.id,req.body,{new:true},
        (error,data)=>{
        res.send(data);
        })
})

// DELETE request, deleting a book from the database via id
app.delete('/api/books/:id',(req,res)=>{
    // Logging ID and body of request to delete
    console.log("Delete: "+req.params.id);

    // Find book by ID and delete data
    bookModel.findByIdAndRemove({_id:req.params.id},(err, data)=>{
        res.send(data);
    })
})

/* FORM HANDLING */

// GET request, for name
app.get('/name', (req,res)=> {
    res.send('Hello '+req.query.firstName+' '+req.query.lastName);
});
// POST request, for name -- more secure
app.post('/name', (req,res)=> {
    res.send('Hello '+req.body.firstName+' '+req.body.lastName);
});

// GET request, return the webpage - server static file to app
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/../build/index.html')); // send to index.html
    });
    
// LISTEN to any requests in localhost:3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})