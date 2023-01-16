const repairService = require('./repairService');
const errorCode = require('../../config/errorCode');

module.exports = {
    requestRepair: (req, res) => {
        const body = req.body;

        repairService.requestRepair(body)
        .then(result => {
            let obj = {};

            if (result == false) {
              obj["suc"] = false;
              obj["error"] = errorCode.E09.message;
              res.send(obj);
            } else if (result == "err") {
              obj["suc"] = false;
              obj["error"] = errorCode.E06.message;
              res.send(obj);
            } else {
              obj['suc'] = true;
              obj['result'] = result;
              res.send(obj);
            }
          })
    },

    myRepairList: (req, res) => {
      const userId = req.params.user_id;
      const page = req.params.page;

      // offset: 이전 item 12개를 skip
      let offset;
      if (page > 0) {
          offset = 12 * (page - 1);
      }

      repairService.myRepairList(userId, offset)
      .then(result => {
        let obj = {};

        if (result == false) {
          obj["suc"] = true;
          obj["error"] = "have not request repair list";
          res.send(obj);
        } else if (result == "err") {
          obj["suc"] = false;
          obj["error"] = errorCode.E06.message;
          res.send(obj);
        } else {
          obj['suc'] = true;
          obj['result'] = result;
          res.send(obj);
        }
      })
    },
    
    viewRepair : (req, res) => {
      const repairId = req.params.repair_id;

      repairService.viewRepair(repairId)
      .then(result => {
        let obj = {};

        if (result == false) {
          obj["suc"] = true;
          obj["error"] = "have not request repair";
          res.send(obj);
        } else if (result == "err") {
          obj["suc"] = false;
          obj["error"] = errorCode.E06.message;
          res.send(obj);
        } else {
          obj['suc'] = true;
          obj['result'] = result;
          res.send(obj);
        }
      })
    },
    viewRepairList: (req, res) => {
      // const departmentId = req.params.department_id;
      const page = req.params.page;

      // offset: 이전 item 12개를 skip
      let offset;
      if (page > 0) {
          offset = 12 * (page - 1);
      }

      repairService.viewRepairList(offset)
      .then(result => {
        let obj = {};

        if (result == false) {
          obj["suc"] = true;
          obj["error"] = "have not request repair list";
          res.send(obj);
        } else if (result == "err") {
          obj["suc"] = false;
          obj["error"] = errorCode.E06.message;
          res.send(obj);
        } else {
          obj['suc'] = true;
          obj['result'] = result;
          res.send(obj);
        }
      })
    }
}