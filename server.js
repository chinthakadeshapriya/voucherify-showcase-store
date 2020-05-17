require("dotenv").config();

const express = require("express");
const cors = require("cors");
const voucherifyClient = require("voucherify");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3001", // REACT_APP_API_URL
    })
  );
}

const voucherify = voucherifyClient({
  applicationId: process.env.APPLICATION_ID,
  clientSecretKey: process.env.CLIENT_SECRET_KEY,
});

app.use(bodyParser.json());
app.use(
  session({
    store: new SQLiteStore({ dir: ".data" }),
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // month
  })
);

app.get("/init", (request, response) => {
  if (request.session.views) {
    console.log(
      "[Re-visit] %s - %s",
      request.session.id,
      request.session.views
    );
    request.session.views++;
  } else {
    request.session.views = 1;
    console.log("[New-visit] %s", request.session.id);
  }
  response.end();
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/customers", async (request, response) => {
  try {
    console.log("[Fetching customers]");
    const customers = await voucherify.customers.list();
    response.json(customers);
  } catch (e) {
    console.error("[Fetching customers][Error] error: %s", e);
    response.status(500).end();
  }
});

app.get("/customer/:id", async (request, response) => {
  let id = request.params.id;
  try {
    const customer = await voucherify.customers.get(id);
    response.json(customer);
  } catch (e) {
    console.error("[Fetching customer][Error] error: %s", e);
    response.status(500).end();
  }
});

app.get("/redemptions/:id", async (request, response) => {
  let id = request.params.id;
  try {
    const redemptionLists = await voucherify.redemptions.list({ customer: id });
    response.json(redemptionLists.redemptions);
  } catch (e) {
    console.error("[Fetching redemptions][Error] error: %s", e);
    response.status(500).end();
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
}

const listener = app.listen(process.env.PORT, () => {
  console.log(`Your server is listening on port ${listener.address().port}`);
});