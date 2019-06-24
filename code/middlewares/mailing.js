var nodeMailer = require('nodemailer');
var ejs = require('ejs');
var path = __dirname.replace('/middlewares', '');

module.exports = {
    send: function (res, req, from, to, title, content)
    {
        var transporter = nodeMailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: {
                user: from.email,
                pass: from.email_pass,
            }
        });

        var true_content = '';
        ejs.renderFile(path + '/views/elements/email.ejs', {
            content: content,
        }, function (err, str) {
            true_content = str;

            var mailOptions = {
                from: from.email,
                to: to.email,
                subject: title,
                html: true_content
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.redirect("/dashboard/send-email")
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
                return res.redirect("/dashboard/send-email")
            });
        });
    }
};