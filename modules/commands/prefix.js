const axios = require("axios");
const moment = require("moment-timezone");

module.exports.config = {
  name: "prefix",
  version: "2.0.0",
  hasPermission: 0,
  credits: "AnhCode",
  description: "prefix bot",
  commandCategory: "Thành Viên",
  usages: "[]",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, body } = event;
  const { PREFIX } = global.config;
  const gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss || DD/MM/YYYY");

  let threadSetting = global.data.threadData.get(threadID) || {};
  let prefix = threadSetting.PREFIX || PREFIX;

  if (
    body.toLowerCase() === "prefix" ||
    body.toLowerCase() === "dùng bot kiểu gì" ||
    body.toLowerCase() === "dùng bot như nào" ||
    body.toLowerCase() === "dùng sao"
  ) {
    api.sendMessage(
      `==== [ PREFIX BOT ] ====\n──────────────────\n✏️ Prefix của nhóm: ${prefix}\n📎 Prefix hệ thống: ${global.config.PREFIX}\n📝 Tổng có: ${
        client.commands.size
      } lệnh\n👥 Tổng người dùng bot: ${
        global.data.allUserID.length
      }\n🏘️ Tổng nhóm: ${global.data.allThreadID.length}\n──────────────────\n⏰ Time: ${gio}`,
      body: message,
	  attachment: global..splice(0, 1) },
	  event.threadID,
      event.messageID
    );
  }
};

module.exports.run = async function () {};