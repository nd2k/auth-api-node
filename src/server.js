"use strict";
exports.__esModule = true;
var express_1 = require("express");
var app = (0, express_1["default"])();
app.get('/', function (req, res) {
    res.send('Hello world');
});
var PORT = process.env.PORT || 1000;
app.listen(PORT, function () {
    console.log("App is listening on port " + PORT);
});
