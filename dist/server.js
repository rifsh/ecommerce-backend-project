"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const db_connection_1 = require("./db_connection");
(0, db_connection_1.connection)();
const port = 3000;
index_1.app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
