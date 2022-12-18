const Tool = require('../../models');

module.exports = {
    checkTool : (toolId) => {
        return new Pormise((resolve) => {
            Tool.findOne({
                where: {
                    tool_id : toodId
                },
                attributes: [tool_id, tool_state]
            })
            .then((result) => {

            })
            .catch((err)=> {
                
            })
        })
    },

    // rentalTool: (body) => {
    //     return new Promise((resolve) => {
    //         Tool.
    //     })
    // }
}