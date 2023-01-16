const express = require('express');
const router = express.Router();
const repairController = require('./repairController');

// 수리 요청
router.post('/requestRepair', repairController.requestRepair);
// 수리 요청 목록
router.get('/myRepairList/:user_id/:page', repairController.myRepairList);
// 수리 요청 자세히 보기
router.get('/viewRepair/:repair_id', repairController.viewRepair)
// 수리 요청 리스트 보기
router.get('/viewRepairList/:page', repairController.viewRepairList);
module.exports = router;