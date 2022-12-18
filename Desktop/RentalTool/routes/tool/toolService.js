const {
    Tool, Img, Department, Rental
} = require('../../models');

const moment = require("moment");

require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");

module.exports = {
    addTool: (body) => {
        return new Promise((resolve) => {
            Tool.create({
                tool_id: body.tool_id,
                tool_use_division: body.tool_use_division,
                tool_code: body.tool_code,
                tool_name: body.tool_name,
                tool_purchase_division: body.tool_purchase_division,
                tool_purchase_date: body.tool_purchase_date,
                tool_standard: body.tool_standard,
                tool_condition: body.tool_condition,
                tool_update_at: moment().format("YYYY-MM-DD hh:mm:ss"),
                tool_state: "대여가능",
                tool_change_date: moment().format("YYYY-MM-DD hh:mm:ss"),
                department_id: body.department_id
            })
                .then(async result => {
                    let obj = {};
                    let results = [];
        
                    console.log(imgData)
                    if (imgData != null) {
                      const promises = imgData.map(
                        async (value, index, array) =>
                          await Img.create({
                            img_url: array[index].location,
                            tool_id: result.tool_id,
                          })
                            .then((res) => results.push(res))
                            .catch((err) => {
                              resolve("err");
                              console.log(err);
                            })
                      );
                      await Promise.all(promises);
                    }
          
                    obj["board"] = result;
                    obj["img"] = results;
          
                    obj !== null ? resolve(obj) : resolve(false);
                })
                .catch((err) => {
                    resolve(err)
                })

        })
    },

    viewToolList: (departmentId, offset) => {
      return new Promise ((resolve) => {
        Tool.findAll({
            where : { department_id: departmentId },
            attributes: ['tool_use_division', 'tool_name', 'tool_id', 'tool_state'],
            order: [['tool_state', 'ASC']],
            include : {
              model: Department,
              attributes : ['department_name']
            },
            offset: offset,
            limit: 12
        })
        .then((result) => {
          // let obj = {};
          // obj['result'] = result;
          // obj['result'] = 
          result != null ? resolve(result): resolve(false);
        })
        .catch((err) => {
          console.log(err);
          resolve("err");
        })
      })
    },

    viewTool : (toolId) =>{
      return new Promise((resolve) => {
        Tool.findOne({
          where: {tool_id : toolId},
          attributes: { exclude: ['tool_update_at']},
          include : {
            model : Rental, // 렌탈 스테이트가 대여. 인것을 찾아야함
            attributes : ['user_id','rental_date','rental_due_date']
          }
        })
        .then((result) => {
          result != null ? resolve(result): resolve(false);
        })
        .catch((err) => {
          console.log(err);
          resolve("err");
        })
      })
    }
}