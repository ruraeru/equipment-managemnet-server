const {
    Rental, Tool
} = require("../../models");

const moment = require("moment");
const { resolve } = require("path");

require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");

module.exports = {

    // RENTAL TOOL
    rentalTool: (body) => {
        return new Promise((resolve) => {
            // find the tool
            Tool.findOne({
                where: { tool_id: body.tool_id }
            })
                .then((result) => {
                    // if the tool could be rentaled
                    if (result.tool_state = "대여가능") {
                        // create rental db
                        Rental.create({
                            tool_id: body.tool_id,
                            user_id: body.user_id,
                            department_id: body.department_id,
                            rental_date: moment().format("YYYY-MM-DD hh:mm:ss"), // now
                            rental_due_date: moment().add(7, 'days').calendar(), // in 7 days from now
                            rental_state: "대여",
                            rental_is_extended: false
                        })
                            .then((result) => {
                                Tool.update({
                                    where: { tool_id: result.tool_id },
                                    tool_state: "대여중"
                                })
                                    .then((result) => {
                                        result !== null ? resolve(result) : resolve(false);

                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        resolve("err");
                                    });
                            })
                            .catch((err) => {
                                console.log(err);
                                resolve("err");
                            });


                    } else {
                        resolve("대여 가능한 상태가 아닙니다.");
                    }

                })
                .catch((err) => {
                    console.log(err);
                    resolve("err");
                });
        })
    },

    returnTool: (body) => {
        return new Promise((resolve) => {
            Tool.findOne({
                where: { tool_id: body.tool_id }
            })
                .then((result) => {
                    // if the tool could be rentaled
                    if (result.tool_state = "대여중") {
                        // create rental db
                        Rental.update({
                            //rental
                            where: {
                                rental_id: body.rental_id
                            },
                            rental_state: "반납"
                        })
                            .then((result) => {
                                Tool.update({
                                    where: { tool_id: body.tool_id },
                                    tool_state: "대여가능"
                                })
                                    .then((result) => {
                                        result !== null ? resolve(result) : resolve(false);

                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        resolve("err");
                                    });
                            })
                            .catch((err) => {
                                console.log(err);
                                resolve("err");
                            });
                    } else {
                        resolve("반납 가능한 상태가 아닙니다.");
                    }

                })
                .catch((err) => {
                    console.log(err);
                    resolve("err");
                });

        })
    }
}