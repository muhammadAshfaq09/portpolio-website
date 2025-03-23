require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const hbs = require("hbs");
const csurf = require("csurf");
const path = require("path");
const mongoose = require("mongoose");
const User = require("./models/User");
const Contact = require("./models/Contact");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "" , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Middleware setup
app.set("view engine", "hbs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);
app.use(csurf());

// Authentication middleware
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.redirect("/login");
  }
}

// Routes
app.get("/signup", (req, res) => {
  res.render("signup", { csrfToken: req.csrfToken() });
});

app.post("/signup", async (req, res) => {
  const { username, email, password, phone } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.render("signup", {
        error: "User already exists",
        csrfToken: req.csrfToken(),
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, phone });
    await user.save();
    res.redirect("/login");
  } catch (err) {
    console.error("Error during signup:", err);
    res.render("signup", {
      error: "An error occurred during signup",
      csrfToken: req.csrfToken(),
    });
  }
});

app.get("/login", (req, res) => {
  res.render("login", { csrfToken: req.csrfToken() });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = user;
      res.redirect("/Home");
    } else {
      res.render("login", {
        error: "Invalid credentials",
        csrfToken: req.csrfToken(),
      });
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.render("login", {
      error: "An error occurred during login",
      csrfToken: req.csrfToken(),
    });
  }
});

// Nav routes
app.get("/Home", isAuthenticated, (req, res) => {
  res.render("index", { user: req.session.user });
});
app.get("/about", isAuthenticated, (req, res) => {
  res.render("About", { user: req.session.user });
});
app.get("/servcies", isAuthenticated, (req, res) => {
  res.render("Servcies", { user: req.session.user });
});
app.get("/contact", isAuthenticated, (req, res) => {
  res.render("Contact", { csrfToken: req.csrfToken(), user: req.session.user });
});

app.post("/contact", isAuthenticated, async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const contact = new Contact({ name, email, message });
    await contact.save();
    res.render("Contact", {
      success: "Your message has been sent successfully!",
      csrfToken: req.csrfToken(),
      user: req.session.user,
    });
  } catch (err) {
    console.error("Error during contact form submission:", err);
    res.render("Contact", {
      error: "An error occurred while sending your message",
      csrfToken: req.csrfToken(),
      user: req.session.user,
    });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// Default route to redirect to login
app.get("*", (req, res) => {
  res.redirect("/login");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
