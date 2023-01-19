const {
    User, Department, Sequelize : {Op}
} = require("../../models");
const moment = require("moment");
const hashing = require("../../config/hashing");
const { resolve } = require("path");

require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");

module.exports = {
    login: (body,hash) => {
        return new Promise((resolve) => {
            User.findOne({
                where: {
                    user_id: body.user_id,
                    user_pw: hash
                }
            })
                .then((result) => {
                    result !== null ? resolve(result) : resolve(false);
                })
                .catch((err) => {
                    resolve("err");
                    console.log(err);
                });
        })
    },

    signUp: (body, hash) => {
        return new Promise((resolve) => {
            User.findOrCreate({
                where:
                {
                    user_id: body.user_id
                },
                defaults: {
                    user_id: body.user_id,
                    user_pw: hash,
                    user_email: body.user_email,
                    user_student_number: body.user_student_number,
                    user_name: body.user_name,
                    user_phone_number: body.user_phone_number,
                    user_created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                    user_license: 3,
                    user_is_approved: body.user_is_approved,
                    department_id: body.department_id,
                },
                raw: true
            })
                .then((result) => {
                    if (result[1]) {
                        resolve(result);
                        console.log(result);
                    } else if (!result[1]) {
                        resolve("EXIST");
                    } else {
                        console.log(false);
                        resolve(false);
                    }
                })
                .catch((err) => {
                    resolve(false);
                    console.log(err);
                });
        });
    },

    deleteUser: (userId, hash) => {
        return new Promise((resolve) => {
            User.destroy({
                where: {
                    user_id: userId,
                    user_pw: hash
                },
            })
                .then((result) => {
                    console.log(result);
                    result !== null ? resolve(result) : resolve(false);
                })
                .catch((err) => {
                    resolve(false);
                    console.log(err);
                });
        });
    },

    findId: (Email) => {
        return new Promise((resolve) => {
            User.findOne({
                where: {
                    user_email: Email,
                },
                attributes: ["user_id", "user_name"]
            })
            .then((result) => {
                console.log(result);
                result !== null ? resolve(result) : resolve(false);
              }).catch((err) => {
                resolve("err");
                console.log(err);
              });
        })
    },

    changePw: (body, hash) => {
        return new Promise((resolve) => {
            User.update(
                { user_pw: hash },
                {
                    where: {
                        user_email: body.user_email,
                    },
                })
                .then((result) => {
                    console.log(result);
                    result !== null ? resolve(result) : resolve(false);
                }).catch((err) => {
                    resolve("err");
                    console.log(err);
                });
        })
    },

    changeInfo: (body) => { // hash -> 정보 변경 시, 비밀번호 입력
        return new Promise((resolve) => {
            User.update(
                {
                    user_email: body.user_email,
                    user_name: body.user_name,
                    user_phone_number: body.user_phone_number
                },
                {
                    where: {
                        user_id: body.user_id
                    }
                }
            )
                .then((result) => {
                    result !== null ? resolve(result) : resolve(false);
                })
                .catch((err) => {
                    resolve("err");
                    console.log(err);
                });
        })
    },

    inquireMyInfo: (userId) => {
        return new Promise((resolve) => {
            User.findOne({
                where: {
                    user_id: userId
                },
                attributes: {exclude: ['user_pw', 'user_created_at', 'user_license']},
                include: {
                    model : Department,
                    attributes: ['department_name']
                }
            }
            )
                .then((result) => {
                    result !== null ? resolve(result) : resolve(false);
                })
                .catch((err) => {
                    resolve("err");
                    console.log(err);
                });
        })
    },

    qlfctAprvl : (userId) => {
        return new Promise((resolve) => {
            User.update({
                user_license: 2,
                user_is_approved: true
            },{
                where: { user_id: userId},
                
            })
            .then((result) => {
                result !== null ? resolve(result) : resolve(false);
            })
            .catch((err) => {
                resolve("err");
                console.log(err);
            });
        })
    },
    
    approvalRequestList: (departmentId, offset) => {
        return new Promise((resolve) => {
            User.findAll({
                where:
                {
                    user_is_approved:false,
                    department_id : departmentId
                },
                attributes: {exclude:['user_pw']},
                order:[['user_created_at', 'ASC']],
                limit: 12,
                offset: offset
            })
            .then((result) => {
                result !== null ? resolve(result) : resolve(false);
            })
            .catch((err) => {
                resolve("err");
                console.log(err);
            });
        })
        
    },

    searchNotApprovedList: (searchWord,departmentId, offset) => {
        return new Promise((resolve) => {
            User.findAll({
                where:
                {
                    [Op.or]: [
                        {
                            user_id: {
                                [Op.like]: "%" + searchWord + "%"
                            }
                        },
                        {
                            user_email: {
                                [Op.like]: "%" + searchWord + "%"
                            }
                        },
                        {
                            user_name: {
                                [Op.like]: "%" + searchWord + "%"
                            }
                        },

                    ],
                    user_is_approved: false,
                    department_id : departmentId
                },
                attributes: {exclude:['user_pw']},
                order:[['user_created_at', 'ASC']],
                limit: 12,
                offset: offset
            })
            .then((result) => {
                result !== null ? resolve(result) : resolve(false);
            })
            .catch((err) => {
                resolve("err");
                console.log(err);
            });
        })
        
    },
}