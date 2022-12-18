const toolService = require('./toolService');
const fs = require('fs');
const path = require('path')
const errorCode = require('../../config/errorCode');

module.exports = {
  addTool: async (req, res) => {
    const body = req.body;
    const imgData = fs
      .readFileSync(`app${req.file.path.split("app")[1]}`)
      .toString("base64");

    console.log(imgData)
    toolService.addTool(body, imgData)
      .then(result => {
        let obj = {};
        if (result) {
          obj["suc"] = true;
          obj["result"] = result
          res.send(obj);
        } else {
          obj["suc"] = false;
          res.send(false);
        }
      })
  },

  viewToolList: (req, res) => {
    const departmentId = req.params.department_id;
    const page = req.params.page;

    // offset: 이전 item 10개를 skip
    let offset;
    if (page > 0) {
      offset = 12 * (page - 1);
    }

    toolService.viewToolList(departmentId, offset)
    .then((result) => {
      let obj = {};
      
      if (result == false) {
        obj["suc"] = false;
        obj["error"] = errorCode.E09.message;
        res.send(obj);
    } else if (result == "err"){
        obj["suc"] = false;
        obj["error"] = errorCode.E06.message;
        res.send(obj);
    }else {
        obj['suc'] = true;
        obj['result'] = result;
        res.send(obj);
      }
    })
  },

  viewTool: (req, res) => {
    const toolId = req.params.tool_id;

    toolService.viewTool(toolId)
    .then((result) => {
      let obj = {};
      
      if (result == false) {
        obj["suc"] = false;
        obj["error"] = errorCode.E07.message;
        res.send(obj);
    } else if (result == "err"){
        obj["suc"] = false;
        obj["error"] = errorCode.E06.message;
        res.send(obj);
    }else {
        obj['suc'] = true;
        obj['result'] = result;
        res.send(obj);
      }
    })
  }
}