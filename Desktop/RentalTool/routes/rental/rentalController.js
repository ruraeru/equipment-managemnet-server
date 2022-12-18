const e = require('cors');
const errorCode = require('../../config/errorCode');
const rentalService = require('./rentalService');

module.exports = {

    rentalTool: (req, res) => {
        const body = req.body;

        let obj = {};

        // if(req.user_license >= 3){
        //     obj["suc"] = false;
        //     obj["result"]=errorCode.E04.message;
        //     obj["code"]="E04"
        //     res.send(obj);
        // }else{
        rentalService.rentalTool(body)
            .then(result => {
                if (result == false) {
                    obj["suc"] = false;
                    obj["error"] = errorCode.E07.message;
                    res.send(obj);
                } else if (result == "err"){
                    obj["suc"] = false;
                    obj["error"] = errorCode.E06.message;
                    res.send(obj);
                }else if (result == errorCode.E05.message ) {
                    obj["suc"] = false;
                    obj["error"] = result;
                    res.send(obj);
                } else {
                    obj['suc'] = true;
                    obj['rental'] = result;
                    res.send(obj);
                }
            })
        //}
    },

    returnTool: (req, res) => {
        const body = req.body;

        let obj = {};

        if (req.user_license >= 3) {
            obj["suc"] = false;
            obj["result"] = errorCode.E04.message;
            obj["code"] = "E04"
            res.send(obj);
        } else {
            rentalService.returnTool(body)
                .then(result => {
                    if (result == false) {
                        obj["suc"] = false;
                        obj["error"] = errorCode.E07.message;
                        res.send(obj);
                    } else if (result == "err"){
                        obj["suc"] = false;
                        obj["error"] = errorCode.E06.message;
                        res.send(obj);
                    } else if (result == "E07") {
                        obj["suc"] = false;
                        obj["error"] = errorCode.E07.message;
                        res.send(obj);
                    } else {
                        obj['suc'] = true;
                        obj['return'] = result;
                        res.send(obj);
                    }
                })
        }
    },

    extension: (req, res) => {
        const body = req.body;

        let obj = {};

        if (body.rental_is_extended == true) {
            obj["suc"] = false;
            obj["result"] = "연장은 한번까지 가능합니다. " 
            // obj["result"] = errorCode.E04.message;
            // obj["code"] = "E04"
            res.send(obj);
        } else {
            rentalService.extension(body.rental_id)
                .then(result => {
                    if (result == false) {
                        obj["suc"] = false;
                        obj["error"] = errorCode.E07.message;
                    } else if (result == "err"){
                        obj["suc"] = false;
                        obj["error"] = errorCode.E06.message;
                    } else {
                        obj['suc'] = true;
                        obj['extension'] = result;
                    }
                    res.send(obj);
                })
        }
    },

    checkRental: (req, res) => {
        const departmentId = req.params.department_id;

        rentalService.checkRental(departmentId)
    }
}