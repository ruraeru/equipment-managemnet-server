const errorCode = require('../../config/errorCode');
const rentalService = require('./rentalService');

module.exports = {

    rentalTool: (req, res) => {
        const body = req.body;
        
        let obj = {};

        if(req.user_license >= 3){
            obj["suc"] = false;
            obj["result"]=errorCode.E04.message;
            obj["code"]="E04"
            res.send(obj);
        }else{
        rentalService.rentalTool(body)
            .then(result => {
                if (result === false) {
                    obj["suc"] = false;
                    obj["result"]=errorCode.E06.message;
                    obj["code"]="E06"
                    res.send(obj);
                } else if (result === "err") {
                    obj["suc"] = false;
                    obj["result"]=errorCode.E06.message;
                    obj["code"]="E06"
                    res.send(obj);
                } else {
                    obj['suc'] = true;
                    obj['rentalTool'] = result;
                    res.send(obj);
                }
            })}
    },

    returnTool: (req, res) => {
        const body = req.body;
        
        let obj = {};

        if(req.user_license >= 3){
            obj["suc"] = false;
            obj["result"]=errorCode.E04.message;
            obj["code"]="E04"
            res.send(obj);
        }else{
        rentalService.returnTool(body)
            .then(result => {
                if (result === false) {
                    obj["suc"] = false;
                    obj["result"]=errorCode.E06.message;
                    obj["code"]="E06"
                    res.send(obj);
                } else if (result === "err") {
                    obj["suc"] = false;
                    obj["result"]=errorCode.E06.message;
                    obj["code"]="E06"
                    res.send(obj);
                } else if(result === "대여 가능한 상태가 아닙니다.") {
                    obj["suc"] = false;
                    obj["result"]=result;
                    res.send(obj);
                }
                else {
                    obj['suc'] = true;
                    obj['returnTool'] = result;
                    res.send(obj);
                }
            })}
        }

}