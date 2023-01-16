const express = require('express');
const router = express.Router();
const toolController = require('./toolController');
const authUtil = require('../../middleware/authorization').checkToken;
const upload = require('../../middleware/upload');
// 기자재 추가
router.post('/addTool', upload.single('tool_image') , toolController.addTool);
// 학과 기자재 조회
router.get('/viewToolList/:department_id/:page' , authUtil, toolController.viewToolList);
// 기자재 자세히 보기
router.get('/viewTool', authUtil, toolController.viewTool);
// 기자재 대여 불가 처리
router.get('/cannotRental/:tool_id', authUtil, toolController.cannotRental);
// test manager view Tool
router.get('/managerViewTool/:tool_id', toolController.managerViewTool);

module.exports = router;