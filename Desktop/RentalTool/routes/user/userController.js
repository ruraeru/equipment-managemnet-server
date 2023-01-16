const userService = require('./userService');
const path = require('path');
const salt = require('../../config/config.json').salt;
const hashing = require(path.join(__dirname, '../../config', 'hashing.js'));
const issueToken = require('../../jwt/jwt').sign;
const errorCode = require('../../config/errorCode');

module.exports = {
    login: (req, res) => {
        const body = req.body;
        const hash = hashing.enc(body.user_pw, salt);

        userService.login(body, hash)
            .then(result => {
                let obj = {};
                if (result == "err") {
                    obj['suc'] = false;
                    obj['err'] = errorCode.E06.message;
                    res.send(obj);
                } else if(result == false){
                    obj['suc'] = false;
                    obj['err'] = errorCode.E08.message;
                    res.send(obj);

                } else{
                    console.log(result)
                    obj['suc'] = true;
                    obj['login'] = result;
                    obj['token'] = issueToken(result);
                    res.send(obj);
                }
            })
    },

    deleteUser: (req, res) => {
        const userId = req.body.user_id;
        const hash = hashing.enc(req.body.user_pw, salt);

        userService.deleteUser(userId, hash)
            .then(result => {
                let obj = {};
                if (result == false) {
                    obj["suc"] = false;
                    obj["error"] = errorCode.E08.message;
                    res.send(obj);
                } else if (result == "err"){
                    obj["suc"] = false;
                    obj["error"] = errorCode.E06.message;
                    res.send(obj);
                } else{
                    obj['suc'] = true;
                    res.send(obj);
                }
            })
    },

    signUp: (req, res) => {
        const body = req.body;
        const userId = req.body.user_id;
        const hash = hashing.enc(body.user_pw, salt);

        userService.signUp(body, hash)
            .then(result => {
                let obj = {};

                if (result == "err"|| false) {
                    obj["suc"] = false;
                    obj["error"] = errorCode.E06.message;
                    res.send(obj);
                  } else if(result == "EXIST") {
                    obj["suc"] = false;
                    obj["error"] = "is already exist";
                    res.send(obj);
                  }
                  else {
                    obj['suc'] = true;
                    obj['result'] = result;
                    res.send(obj);
                  }
            })
    },

    findId : (req, res) => {
        const Email =  req.query.user_email;
        
        userService.findId(Email)
        .then((result) => {
            let obj = {}
            if (result == false) {
                obj["suc"] = false;
                obj["error"] = errorCode.E08.message;
                res.send(obj);
            } else if (result == "err"){
                obj["suc"] = false;
                obj["error"] = errorCode.E06.message;
                res.send(obj);
            } else{
                obj['suc'] = true;
                obj['result'] = result;
                res.send(obj);
            }
        })
    },


    changePw: (req, res) => {
        const body = req.body;
        const hash = hashing.enc(body.user_pw, salt);

        userService.changePw(body, hash)
            .then(result => {
                let obj = {};
                if (result == false) {
                    obj["suc"] = false;
                    obj["error"] = errorCode.E10.message;
                    res.send(obj);
                } else if (result == "err"){
                    obj["suc"] = false;
                    obj["error"] = errorCode.E06.message;
                    res.send(obj);
                } else{
                    obj['suc'] = true;
                    res.send(obj);
                }
            })
    },

    changeInfo: (req, res) => {
        const body = req.body;
        const email = req.body.user_email;

        let obj = {};

        // req.user_id is decoded token`s user_id
        if (body.user_id != req.user_id){
            obj['suc'] = false;
            obj['error'] = errorCode.E04.message;
            res.send(obj);
        }else if( email.indexOf("mjc.ac.kr") === -1){
            obj['suc'] = false;
            obj['err'] = "해당 학교의 메일이 아닙니다. ";
            res.send(obj);
        }else {        
            userService.changeInfo(body)
            .then(result => {
                if (result == "err") {
                    obj['suc'] = false;
                    obj['err'] = errorCode.E06.message;
                    res.send(obj);
                } else{
                    console.log(result)
                    obj['suc'] = true;
                    res.send(obj);
                }
            })}


    },

    inquireMyInfo: (req, res) => {
        const userId = req.query.user_id;

        let obj = {};

        // req.user_id is decoded token`s user_id
        if (userId != req.user_id){
            obj['suc'] = false;
            obj['error'] = errorCode.E04.message;
            res.send(obj);
        } else {
            userService.inquireMyInfo(userId)
            .then(result => {
                if (result == "err") {
                    obj['suc'] = false;
                    obj['err'] = errorCode.E06.message;
                    res.send(obj);
                } else if(result == false){
                    obj['suc'] = false;
                    obj['err'] = errorCode.E08.message;
                    res.send(obj);
    
                } else{
                    console.log(result)
                    obj['suc'] = true;
                    obj['inquireMyInfo'] = result;
                    res.send(obj);
                }
            })
        }

    },


    qlfctAprvl: (req, res) => {
        const userId = req.query.user_id;

        let obj = {};
        if(req.license > 1){
            obj["suc"] = false;
            obj["result"] = errorCode.E04.message;
            obj["code"] = "E04"
            res.send(obj);
        }else{
            userService.qlfctAprvl(userId)
            userService.inquireMyInfo(userId)
            .then(result => {
                if (result == "err") {
                    obj['suc'] = false;
                    obj['err'] = errorCode.E06.message;
                    res.send(obj);
                } else if(result == false){
                    obj['suc'] = false;
                    obj['err'] = errorCode.E08.message;
                    res.send(obj);
    
                } else{
                    obj['suc'] = true;
                    res.send(obj);
                }
        })
        }

}

}