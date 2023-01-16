const schedule = require("node-schedule");
const moment = require("moment");
const noti = require("./noti")
const notiCode = require("./notiCode")
const mail = require('./middleware/mail');

const {
    Sequelize: { Op },
    Rental,
    User,
} = require("./models");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");

//하루에 한번 모든 렌탈의 남은기간을 체크
//TODO:
const rentalNotiSend = () => {

    const date0= moment().format("YYYY-MM-DD");
    const date1 = moment().add(1, "d").format("YYYY-MM-DD");
    const date2 = moment().add(2, "d").format("YYYY-MM-DD");
    // 반납 하루 남은 렌탈의 대여자에게 알림 보내기
    const j1 = schedule.scheduleJob({ hour: 13, minute: 0 }, () => {
        // console.log(date)
        Rental.findAll({
            where: {
                rental_due_date: {
                    [Op.between]: [date1, date2]
                },
                rental_state: "대여",
            },
            include: [{
                model: User,
                attributes: ["user_email"],
            }]
        }).then((result) => {
          result.forEach((element) => {
            //console.log(element.user.user_email)
                // const topic = element.user.user_email.replace("@", ".at.");
                // console.log(topic)
                // noti.sendNotification(topic, notiCode.N01.title, notiCode.N01.content);

                // console.log(element.user.user_email);
                // console.log(element.rental_due_date);
                mail.sendEmail(element.user.user_email, moment(element.rental_due_date).format("YYYY-MM-DD"), "noti")
            });
        });
    });


    // 당일 반납자에게 알림 보내기
    const j2 = schedule.scheduleJob({ hour: 13 , minute: 0}, () => {
        // console.log(date)
        Rental.findAll({
            where: {
                rental_due_date: {
                    [Op.between]: [date0, date1]
                },
                rental_state: "대여",
            },
            include: [{
                model: User,
                attributes: ["user_email"],
            }]
        }).then((result) => {
            console.log(result)
            result.forEach((element) => {
                //console.log(element.user.user_email)
                    // const topic = element.user.user_email.replace("@", ".at.");
                    // console.log(topic)
                    // noti.sendNotification(topic, notiCode.N01.title, notiCode.N01.content);
    
                    // console.log(element.user.user_email);
                    // console.log(element.rental_due_date);
                    mail.sendEmail(element.user.user_email, moment(element.rental_due_date).format("YYYY-MM-DD"), "noti")
                });
        });
    });
};

module.exports = {
    rentalNotiSend,
};
