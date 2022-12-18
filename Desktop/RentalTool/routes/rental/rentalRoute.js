const express = require('express');
const router = express.Router();
const rentalController = require('./rentalController');
const authUtil = require('../../middleware/authorization').checkToken;

// 기자재 대여
router.post('/rentalTool', authUtil, rentalController.rentalTool);
// 기자재 반납
router.post('/returnTool', authUtil, rentalController.returnTool);
// 기자재 연장
router.post('/extension', /*authUtil,*/  rentalController.extension);

module.exports = router;