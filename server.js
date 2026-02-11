require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");

const uploadRoute = require("./routes/upload");

const app = express();

/* =========================
   DATABASE CONNECTION
========================= */

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Error:", err));


/* =========================
   MIDDLEWARE
========================= */

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: "legalAutomationSecretKey2026",  // change to strong custom key
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,     // keep false for Render (HTTP). true only if using HTTPS with custom domain
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 4  // 4 hour login session
    }
}));

/* =========================
   STATIC FILES
========================= */

app.use(express.static(path.join(__dirname, "public")));


/* =========================
   LOGIN ROUTES
========================= */

// Login Page
app.get("/", (req, res) => {
    if (req.session.user) {
        return res.redirect("/dashboard.html");
    }
    res.redirect("/login.html");
});

// Login Handler
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // 🔐 INTERNAL OFFICE LOGIN (change credentials)
    if (username === "admin" && password === "StrongPass123") {
        req.session.user = username;
        res.redirect("/dashboard.html");
    } else {
        res.send("❌ Invalid Username or Password");
    }
});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login.html");
    });
});


/* =========================
   PROTECTED ROUTES
========================= */

app.use("/", uploadRoute);


/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
