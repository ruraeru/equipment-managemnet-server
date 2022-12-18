const express = require('express');
const router = express.Router();
const toolController = require('./toolController');
const authUtil = require('../../middleware/authorization').checkManagerToken;
const upload = require('../../middleware/upload');
// 기자재 추가
router.post('/addTool', upload , toolController.addTool);
// 학과 기자재 조회
router.get('/viewToolList/:department_id/:page' , toolController.viewToolList);
// 기가재 자세히 보기
router.get('/viewTool/:tool_id', toolController.viewTool);
module.exports = router;