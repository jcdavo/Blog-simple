const bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  express = require("express"),
  app = express()

mongoose.connect('mongodb://localhost:27017/blog_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Tell me if we connected correctly to the DB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("we're connected to the DB!");
});

app.set("view engine", "ejs");
app.use(express.static("public"));
// Tell Express to use body-parser
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Schema for DB
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {
    type: Date,
    default: Date.now
  }
});
// DB model Config
const Blog = mongoose.model("Blog", blogSchema);

// create first blog test
// Blog.create({
//   title: `This is the First Blog!`,
//   image: `https://miro.medium.com/max/1024/1*bcZz-qb_DNpvrNNwQBhQmQ.jpeg`,
//   body: `Ok, so this will be the body`
// });

// RESTful Routes
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
  // Get all Blog posts fromo db
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log("err");
    } else {
      res.render("index", {
        blogs: blogs
      });
    };
  });
});




app.listen(process.env.PORT || 3000, process.env.IP, () => {
  console.log("Blog away on port 3000");
});