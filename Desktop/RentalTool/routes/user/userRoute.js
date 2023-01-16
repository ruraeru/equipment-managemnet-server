const express = require('express');
const router = express.Router();
const userController = require('./userController');
const authUtil = require('../../middleware/authorization').checkToken;

//로그인
router.post('/login', userController.login);
//회원가입
router.post('/signUp', userController.signUp);
//회원 탈퇴
router.post('/deleteUser',userController.deleteUser);
// 아이디 찾기
router.get('/findId', userController.findId);
//비밀번호 변경
router.post('/changePw', userController.changePw);
//개인정보 수정
router.post('/changeInfo', authUtil, userController.changeInfo);
//개인정보 조회
router.get('/inquireMyInfo', authUtil ,userController.inquireMyInfo);
// approve 2`s license
router.get('/qlfctAprvl', authUtil, userController.qlfctAprvl);

module.exports = router;
