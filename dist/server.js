"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
const db_connection_1 = require("./db_connection");
const errormiddlaware_1 = require("./middleware/errormiddlaware");
(0, db_connection_1.connection)();
_1.default.use(errormiddlaware_1.errorHandler);
const port = 3000;
_1.default.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
