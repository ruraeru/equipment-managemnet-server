const express = require('express');
const router = express.Router();
const toolController = require('./toolController');

router.get('/checkTool/:tool_id', toolController.checkTool);

module.exports = router;