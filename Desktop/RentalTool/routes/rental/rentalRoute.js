const express = require('express');
const rental = require('../../models/rental');
const router = express.Router();
const rentalController = require('./rentalController');
const authUtil = require('../../middleware/authorization').checkToken;

// 기자재 대여
router.post('/rentalTool', authUtil, rentalController.rentalTool);
// 기자재 반납
router.post('/returnTool', authUtil,rentalController.returnTool);
// 기자재 연장
router.post('/extension', rentalController.extension);
//내 대여중인 기자재 조회
router.get('/myCurrentRentalList/:page', authUtil,rentalController.myCurrentRentalList);
// 내 역대 대여목록 조회
router.get('/myAllRentalList/:page', authUtil,rentalController.myAllRentalList);
// inquire log
router.get('/viewLog/:page', authUtil, rentalController.viewLog)
// search log
router.get('/searchLog/:searchWord/:page', authUtil, rentalController.searchLog)
//
router.get('/searchMyRental/:searchWord/:page', authUtil, rentalController.searchMyRental)
// 장기 미반납 기자재 조회
// router.get('/notReturned/:department_id')
module.exports = router;