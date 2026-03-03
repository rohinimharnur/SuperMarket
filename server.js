const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// =======================
// MongoDB Connection
// =======================
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("MongoDB Error ❌", err));

// =======================
// User Schema
// =======================
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

// =======================
// Middleware
// =======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "balaji-secret-key",
  resave: false,
  saveUninitialized: false
}));

// Static folder
app.use("/images", express.static(path.join(__dirname, "images")));
// serve images statically; serve view files after routes so explicit routes win
app.use("/images", express.static(path.join(__dirname, "images")));
// Routes
//app.use('/contact', require('./routes/contactRoutes'));
//app.use('/payment', require('./routes/paymentRoutes'));
//app.use('/orders', require('./routes/orderRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
// =======================
// Auth Middleware
// =======================
function isLoggedIn(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/signup');
  }
}

// =======================
// PAGE ROUTES
// =======================

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/home');
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.get('/home', isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/about', isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/cart', isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'cart.html'));
});

app.get('/categories', isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'categories.html'));
});

app.get('/shop', isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'products.html'));
});

app.get('/contact', isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'abc.html'));
});

// Thank you page (allow both /thankyou and /thankyou.html)
app.get('/thankyou', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'thankyou.html'));
});

app.get('/thankyou.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'thankyou.html'));
});

// =======================
// SIGNUP
// =======================
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.send("User already exists ❌");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.log(err);
    res.send("Signup Error ❌");
  }
});

// =======================
// LOGIN
// =======================
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.send("User not found ❌");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send("Wrong Password ❌");

    // ✅ session set
    req.session.userId = user._id;

    // ✅ redirect to home
    res.redirect('/home');

  } catch (err) {
    console.log(err);
    res.send("Login Error ❌");
  }
});

// =======================
// LOGOUT
// =======================
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// =======================
// Start Server
// =======================
// Serve view files (static) after explicit routes so routes take precedence
app.use(express.static(path.join(__dirname, 'views')));
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🚀`);
});
