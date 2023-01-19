const express = require('express');
const router = express.Router();
const repairController = require('./repairController');
const authUtil = require('../../middleware/authorization').checkToken;

// 수리 요청
router.post('/requestRepair', repairController.requestRepair);
// my 수리 요청 목록
router.get('/myRepairList/:page', authUtil, repairController.myRepairList);
// 수리 요청 자세히 보기
router.get('/viewRepair/:repair_id', authUtil,repairController.viewRepair)
// 수리 요청 리스트 보기
router.get('/viewRepairList/:page', authUtil,repairController.viewRepairList);
//
router.get('/searchRequestedRepair/:searchWord/:page', authUtil, repairController.searchRequestedRepair)
//
router.get('/searchMyRepair/:searchWord/:page', authUtil, repairController.searchMyRepair)

module.exports = router;