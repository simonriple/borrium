"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatus = void 0;
const getStatus = (req, res) => {
    res.json({ active: true });
};
exports.getStatus = getStatus;
