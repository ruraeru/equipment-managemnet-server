const {
    Repair, Tool, Log, Img
} = require('../../models');

const moment = require("moment");

require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");
module.exports = {
    requestRepair: (body) => {
        return new Promise((resolve) => {
            Repair.create({
                repair_reason: body.repair_reason,
                repair_create_at: moment().format("YYYY-MM-DD"),
                tool_id: body.tool_id,
                user_id: body.user_id,
                is_repaired: false
            })
                .then((result) => {
                    Tool.findOne({
                        where: { tool_id: result.tool_id },
                        attributes: ['department_id']
                    })
                        .then((logResult) => {
                            Log.create({
                                log_title: "수리",
                                log_content: `${result.user_id}님께서 ${result.tool_id} 기자재의 수리를 요청했습니다. `,
                                log_create_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                                department_id: logResult.department_id
                            })
                                .then(() => {
                                    resolve(result);
                                })
                                .catch((err) => {
                                    console.log(err);
                                    resolve("err");
                                });
                        })

                })
                .catch((err) => {
                    console.log(err);
                    resolve("err");
                })
        })
    },

    myRepairList: (userId, offset) => {
        return new Promise((resolve) => {
            Repair.findAll({
                where: {
                    user_id: userId
                },
                include: [{
                    model: Tool,
                    include: [
                        {
                            model: Img,
                            attributes: ['img_url']
                        }
                    ]
                }],
                offset: offset,
                limit: 12,
                attributes: ['repair_create_at'],
                order: [['repair_create_at', 'DESC']]


            })
                .then((result) => {
                    //     console.log(result)           
                    //     let obj = [];

                    //     for(i = 0; i < result.length; i++){
                    //     obj.push(result[i].tool);
                    //     console.log(result[i].repair_create_at)
                    // }
                    // result != null ? resolve(obj) : resolve(false);
                    result != null ? resolve(result) : resolve(false);

                })
                .catch((err) => {
                    console.log(err);
                    resolve("err");
                });

        })
    },
    
    viewRepair: (repairId) => {
        return new Promise((resolve) => {
            Repair.findOne({
                where: {
                    repair_id: repairId
                },
                include:{
                    model: Tool
                }
            })
            .then((result) => {

                result != null ? resolve(result) : resolve(false);
            })
            .catch((err) => {
                console.log(err);
                resolve("err");
            });  
        })
    },

    viewRepairList: (offset) => {
        return new Promise((resolve) => {
            Repair.findAll({
                where: 
                { 
                    is_repaired : 0
                },
                limit: 12,
                offset: offset,
                include:{
                    model: Tool
                },
                order: [['repair_id', 'DESC']]
            })
            .then((result) => {

                result != null ? resolve(result) : resolve(false);
            })
            .catch((err) => {
                console.log(err);
                resolve("err");
            });  
        })
    },
}