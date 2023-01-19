const {
  Tool, Img, Department, Rental, Repair, User, Sequelize: { Op }
} = require('../../models');

const moment = require("moment");
const tool = require('../../models/tool');

require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");

module.exports = {
  addTool: (body, imgData) => {
    return new Promise((resolve) => {
      Tool.findOrCreate({
        where: {
          [Op.or]: [
            { tool_id: body.tool_id },
          ]
        },
        defaults: {
          tool_id: body.tool_id,
          tool_use_division: body.tool_use_division,
          tool_code: body.tool_code,
          tool_name: body.tool_name,
          tool_purchase_division: body.tool_purchase_division,
          tool_purchase_date: body.tool_purchase_date,
          tool_standard: body.tool_standard,
          tool_condition: body.tool_condition,
          tool_update_at: moment().format("YYYY-MM-DD"),
          tool_state: "대여가능",
          tool_change_date: moment().format("YYYY-MM-DD"),
          department_id: body.department_id
        }
      })
        .then(async (result) => {
          let obj = {};
          let results = [];
          obj["result"] = result[0];
          if (result[1]) {
            if (imgData != null) {
              await Img.create({
                img_url: imgData.path,
                tool_id: body.tool_id,
              })
                .then((imageResult) => {
                  results.push(imageResult);
                  console.log(imageResult);

                  obj["image"] = results;
                })
                .catch((err) => {
                  resolve("err");
                  console.log(err);
                })
            } else {
              obj["image"] = "Not exist";
            }

            resolve(obj);
          } else if (!result[1]) {
            console.log(result[0]);
            resolve("EXIST");
          } else {
            resolve(false);
          }

        })


        .catch((err) => {
          console.log(err);
          resolve("err")
        })
    })
  },

  viewToolList: (departmentId, offset) => {
    return new Promise((resolve) => {
      Tool.findAll({
        where: { department_id: departmentId },
        attributes: ['tool_use_division', 'tool_name', 'tool_id', 'tool_state'],
        order: [['tool_state', 'ASC']],
        include: {
          model: Department,
          attributes: ['department_name']
        },
        offset: offset,
        limit: 12
      })
        .then((result) => {
          // let obj = {};
          // obj['result'] = result;
          // obj['result'] = 
          let obj_sort = result.filter(item => item.tool_state == "대여불가")

          result.forEach(element => {
            if (element.tool_state == "대여불가") {
              delete element
            }
          });
          // for(i = 0; i < result.length; i++){
          //   if (result[i].tool_state == "대여불가") {
          //     delete result[i]
          //   }
          // }

          // console.log(result)
          // result.push(obj_sort)

          obj_sort.forEach(element => {
            result.push(element)
          });

          let obj = [];

          result.forEach(element => {
            if(element != null)
            {
              obj.push(element);
            }
          });
          obj != null ? resolve(obj) : resolve(false);
        })
        .catch((err) => {
          console.log(err);
          resolve("err");
        })
    })
  },

  viewTool: (toolId, license) => {
    return new Promise((resolve) => {
      Tool.findOne({
        where: { tool_id: toolId },
        attributes: { exclude: ['tool_change_date', 'department_id'] },
      })
        .then((result) => {
          Img.findOne({
            where: {
              tool_id: toolId
            }
          })
            .then(img => {
              let obj = {};
              obj["suc"] = true;
              obj["result"] = result;

              img != null ? obj["image"] = img : obj["image"] = false;
              console.log(license)
              if (license < 3) {
                Rental.findAll({
                  where: { tool_id: toolId },
                  attributes: ['rental_date', 'rental_due_date'],
                  order: [['rental_id', 'DESC']],
                  limit: 1,
                  include: [{
                    model: User,
                    attributes: ['user_name']
                  }]
                })
                  .then((rentalResult) => {
                    console.log(rentalResult)
                    if (rentalResult[0] != null) {
                      obj['rental'] = rentalResult[0];
                    } else {
                      obj['rental'] = false
                    }
                    resolve(obj);
                  })
              } else {
                resolve(obj);
              }
            })
        })
        .catch((err) => {
          console.log(err);
          resolve("err");
        })
    })
  },

  managerViewTool: (toolId) => {
    return new Promise((resolve) => {
      Tool.findOne({
        where: { tool_id: toolId },
        attributes: { exclude: ['tool_change_date', 'department_id'] },
        include: [{
          model: Rental,
          attributes: ['rental_date', 'rental_due_date'],
          // order: [['rental_id', 'DESC']],
          limit: 1,
          include: [{
            model: User,
            attributes: ['user_name']
          }]
        }],

      })
        .then((result) => {

          let obj = {};
          let tool = {};

          console.log(result)
          tool['suc'] = true;
          tool['result'] = {
            "tool_id": result.tool_id,
            "tool_use_division": result.tool_use_division,
            "tool_code": result.tool_code,
            "tool_name": result.tool_name,
            "tool_purchase_division": result.tool_purchase_division,
            "tool_purchase_date": result.tool_purchase_date,
            "tool_standard": result.tool_standard,
            "tool_state": result.tool_state
          };
          obj['suc'] = true;
          obj['rental_date'] = result.rentals.rental_date;
          obj['rental_due_date'] = result.rentals.rental_due_date;
          obj['user'] = result.rentals.user;
          obj['tool'] = tool;
          Img.findOne({
            where: {
              tool_id: toolId
            }
          })
            .then(img => {
              img != null ? obj["image"] = img : obj["image"] = "not image";
              resolve(obj);
            })
        })
        .catch((err) => {
          console.log(err);
          resolve("err");
        })
    })
  },

  cannotRental: (toolId) => {
    return new Promise((resolve) => {
      Tool.update({
        tool_state: "수리중"
      },
        {
          where: { tool_id: toolId }
        }
      )
        .then((result) => {
          result != null ? resolve(result) : resolve(false);
        })
        .catch((err) => {
          console.log(err);
          resolve("err");
        })
    })
  },

  searchTool: (searchWord, departmentId, offset) => {
    return new Promise((resolve) => {
      Tool.findAll({
        where: {
          department_id: departmentId,
          [Op.or]: [
            {
              tool_id: {
                [Op.like]: "%" + searchWord + "%"
              }
            },
            {
              tool_name: {
                [Op.like]: "%" + searchWord + "%"
              }
            },

            {
              tool_code: {
                [Op.like]: "%" + searchWord + "%"
              }
            }
          ]
        },
        attributes: ['tool_use_division', 'tool_name', 'tool_id', 'tool_state'],
        include : {
          model: Department,
          attributes: ['department_name']
        },
                        limit: 12,
                offset: offset
      })
        .then((result) => {
          result != null ? resolve(result) : resolve(false);
        })
        .catch((err) => {
          console.log(err);
          resolve("err");
        })
    })
  }
}