const express = require("express");

const app = express();
const cors = require("cors");

const thingController = require("./controller/thing");

const corsOptions = {
    origin: "*",
    methods: ["GET", "PATCH", "POST", "DELETE"],
    withCredentials: true,
    credentials: true,
    optionSuccessStatus: 200,
    allowedHeaders: ["Content-Type", "Authorization"],
};

const allowCrossDomain = (req, res, next) => {
    res.header(
        "Access-Control-Allow-Origin",
        "*",
    );
    res.header("Access-Control-Allow-Methods", "GET,PATCH,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", true);
    next();
};
app.use(allowCrossDomain);
app.use(cors({ origin: true }));
app.use(cors(corsOptions));
app.options(
    "*",
    cors({
        origin: "https://main--techforum.netlify.app",
        credentials: true,
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw({ type: "application/json" }));

// app.use((req, res, next) => {
//     console.log(req.body);
//     const buf = Buffer.from(req.body, "base64");
//     const temp = JSON.parse(buf.toString());
//     req.body = temp;
//     next();
// });
app.use("/devices/creatething", thingController.createThing);
app.use("/devices/getthings", thingController.getThings);
app.use("/devices/getthing/:id", thingController.getThing);
app.use("/devices/pubsubthing/:id", thingController.pubSubThing);
app.use("/devices/deletething/:id", thingController.deleteThing);

app.listen(8080, () => {
    console.log("Coonected");
});

module.exports = app;
