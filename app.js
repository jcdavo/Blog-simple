const expressSanitizer = require('express-sanitizer'),
  methodOverride = require('method-override'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  express = require('express'),
  app = express();

mongoose.connect('mongodb://localhost:27017/blog_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set('useFindAndModify', false);

// Tell me if we connected correctly to the DB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("we're connected to the DB!");
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
// Tell Express to use body-parser
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(expressSanitizer());
app.use(methodOverride('_method'));

// Schema for DB
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {
    type: Date,
    default: Date.now,
  },
});
// DB model Config
const Blog = mongoose.model('Blog', blogSchema);

// RESTful Routes
// Landing
app.get('/', (req, res) => {
  res.redirect('/blogs');
});
// Index Route
app.get('/blogs', (req, res) => {
  // Get all Blog posts from DB
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log('err');
    } else {
      res.render('index', {
        blogs: blogs,
      });
    }
  });
});

// New Route
app.get('/blogs/new', (req, res) => {
  res.render('new');
});

// Create Route
app.post('/blogs', (req, res) => {
  // can use middleware
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, (err, blog) => {
    if (err) {
      res.render('/blogs/new');
    } else {
      res.redirect('/blogs');
      console.log('new blog added');
      console.log(blog);
    }
  });
});

// Show Route
app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, blogPost) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render('show', {
        blog: blogPost,
      });
    }
  });
});

// Edit Route
app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, blogPost) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render('edit', {
        blog: blogPost,
      });
    }
  });
});

// Update Route

app.put('/blogs/:id', (req, res) => {
  // can use middleware
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect(`/blogs/${req.params.id}`);
    }
  });
});

// Delete Route
app.delete('/blogs/:id', (req, res) => {
  Blog.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs');
    }
  });
});

app.listen(process.env.PORT || 3050, process.env.IP, () => {
  console.log('Blog away on port 3000');
});
