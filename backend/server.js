import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cookieParser from "cookie-parser";
import session from "express-session";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import cors from "cors";

const app = express();
const port = 3011;

const FIVE_MINUTES = 5 * 60 * 1000;

app.use(cookieParser());
app.use(express.static("../frontend"));
app.use(express.json());
app.use(cors());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "shhhh, very secret",
    cookie: {
      maxAge: FIVE_MINUTES,
    },
  })
);

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const client = new MongoClient(MONGO_URI);
await client.connect();

const db = client.db("bank");
const accountCollection = db.collection("accounts");
const userCollection = db.collection("users");

/* CREATE USER */
app.post("/api/users/register", async (req, res) => {
  const { user, pass } = req.body;
  const hashedPassword = await bcrypt.hash(pass, 10);

  let newUser = await userCollection.insertOne({
    user: user,
    pass: hashedPassword,
  });
  req.session.user = newUser;
  res.json({
    user: user,
  });
});

/* LOGIN USER */
app.post("/api/users/login", async (req, res) => {
  const { user, pass } = req.body;
  const storedUser = await userCollection.findOne({ user: user });

  if (storedUser) {
    const passwordMatch = await bcrypt.compare(pass, storedUser.pass);
    if (passwordMatch) {
      req.session.user = storedUser;
      res.json({
        user: storedUser.user,
      });
    } else {
      res.status(401).send({ user: "Unauthorized" });
    }
  } else {
    res.status(401).send({ user: "Unauthorized" });
  }
});

/* CHECK LOGIN STATUS*/
app.get("/api/users/loggedin", (req, res) => {
  if (req.session.user) {
    res.json({
      user: req.session.user,
      loggedIn: true,
    });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

/* LOGOUT USER */
app.post("/api/users/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({
      loggedin: false,
    });
  });
});

/* FIND ALL */
app.get("/api/accounts", async (req, res) => {
  const accounts = await accountCollection.find({}).toArray();
  res.json({ accounts });
});

/* UPDATE BALANCE */
app.post("/api/accounts/balance", async (req, res) => {
  const user = await accountCollection.findOne({
    _id: new ObjectId(req.body._id),
  });
  let oldBalance = parseInt(user.balance);
  if (req.body.deposit === true) {
    let newBalance = (oldBalance + parseInt(req.body.balance)).toString();
    user.balance = newBalance;
    const updatedUser = await accountCollection.updateOne(
      { _id: new ObjectId(req.body._id) },
      { $set: user }
    );
    res.json(updatedUser);
  } else {
    let newBalance = oldBalance - parseInt(req.body.balance);
    if (newBalance >= 0) {
      newBalance = newBalance.toString();
      user.balance = newBalance;
      const updatedUser = await accountCollection.updateOne(
        { _id: new ObjectId(req.body._id) },
        { $set: user }
      );
      res.json(updatedUser);
    } else {
      res.json({ badValue: true });
    }
  }
});

/* CREATE ACCOUNT */
app.post("/api/accounts", async (req, res) => {
  const result = await accountCollection.insertOne(req.body);
  res.json(result);
});

/* UPDATE ONE ACCOUNT */
app.post("/api/accounts/:id", async (req, res) => {
  const updated = await accountCollection.updateOne(
    { id: parseInt(req.params.id) },
    { $set: req.body }
  );
  if (updated) {
    res.send(updated);
  } else if (updated === null) {
    res.status(404).send("No blogpost found with that id.");
  }
});

/* DELETE ONE ACCOUNT */
app.delete("/api/accounts/:id", async (req, res) => {
  const deleted = await accountCollection.deleteOne({
    _id: new ObjectId(req.params.id),
  });

  if (deleted) {
    res.send(deleted);
  } else if (deleted === null) {
    res.status(404).send("No account found with that id.");
  }
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
