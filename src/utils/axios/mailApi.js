const axiosClient = require("./axiosClient");

class MailApi {
  sendEmail = (data) => {
    const url = "/mail/send";
    axiosClient.post(url, data);
  };
}
const mailApi = new MailApi();
module.exports = mailApi;
