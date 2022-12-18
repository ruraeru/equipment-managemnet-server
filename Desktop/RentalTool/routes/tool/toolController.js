const toolService = require('./toolService');

module.exports = {
    checkTool: (req, res) => {
        const tooId = req.params.tool_id;

        toolService.checkTool(tooId)
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
    }
}