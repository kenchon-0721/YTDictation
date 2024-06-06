
const express = require("express");
const app = express();
const config = require("./config");
const path = require("path");

app.listen(config.port, () => {
    console.log(`Now running on port ${config.port}`);
});

app.use("/", express.static(path.join(__dirname, "main")));

app.get("/proxy", async (req, res) => {
    const q_params = req.query;

    if (q_params.href === undefined){
        res.sendStatus(400);
    }
    else {
        try{
            const resp = await fetch(decodeURIComponent(q_params.href));
            res.set("content-type", "text/plain");
            res.send(await resp.text());
        }
        catch(e){
            res.sendStatus(400);
        }
    }
});

app.all("/proxy", (req, res)=>{
    res.sendStatus(405);
});

app.all("*", (req, res)=>{
    res.sendStatus(404);
});
