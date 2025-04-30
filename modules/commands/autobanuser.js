module.exports.config = {
  name: "autobanuser",
  version: "1.0.0",
  hasPermssion: 3, 
  credits: "AnhCode",
  description: "tự động cấm người dùng nếu spam bot (random image)",
  commandCategory: "Admin",
  usages: "x",
  cooldowns: 5
};

module.exports.run = ({api, event}) => {
  return api.sendMessage("spam cc", event.threadID, event.messageID);
};

module.exports.handleEvent = async ({ Users, api, event }) => {
  const fs = require("fs-extra");
  const moment = require("moment-timezone");

  let { senderID, messageID, threadID } = event;
  const so_lan_spam = 5; // số lần spam, vượt quá sẽ bị ban
  const thoi_gian_spam = 60000; // 60000 millisecond (1 phút)
  const unbanAfter = 600000; // 600000 millisecond (10 phút) 
  const folderRandomImage = __dirname + "/autoban";
  const allImage = fs.readdirSync(folderRandomImage);

  if (!global.client.autoban) global.client.autoban = {};
  if (!global.client.autoban[senderID]) {
    global.client.autoban[senderID] = {
      timeStart: Date.now(),
      number: 0
    }
  }

  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;
  if (!event.body || event.body.indexOf(prefix) != 0) return;

  let dataUser = await Users.getData(senderID) || {};
  let data = dataUser.data || {};

  if ((global.client.autoban[senderID].timeStart + thoi_gian_spam) <= Date.now()) {
    global.client.autoban[senderID] = {
      timeStart: Date.now(),
      number: 0
    }
  } else {
    global.client.autoban[senderID].number++;
    if (global.client.autoban[senderID].number >= so_lan_spam) {
      const time = moment.tz("Asia/Ho_Chi_minh").format("DD/MM/YYYY HH:mm:ss");
      if (data && data.banned == true) return;

      data.banned = true;
      data.reason = `spam bot ${so_lan_spam} lần/${thoi_gian_spam/60000} phút`;
      data.autoban = {
        timeStart: Date.now(),
        unbanAfter
      };
      data.dateAdded = time;
      await Users.setData(senderID, { data });
      global.data.userBanned.set(senderID, { reason: data.reason, dateAdded: data.dateAdded });
      global.client.autoban[senderID] = {
        timeStart: Date.now(),
        number: 0
      };

      api.sendMessage({
        body: `${senderID} | ${dataUser.name}\n🤍 Bạn đã bị cấm sử dụng bot=)) ${unbanAfter/60000} phút với lý do: spam bot\n🖤 Auto unban sau ${Math.floor(unbanAfter/60000)} phút`,
        attachment: fs.createReadStream(`${folderRandomImage}/${allImage[Math.floor(Math.random() * allImage.length)]}`)
      }, threadID, () => {
        setTimeout(async function() {
          delete data.autoban;
          data.banned = false;
          data.reason = null;
          data.dateAdded = null;
          await Users.setData(senderID, { data });
          global.data.userBanned.delete(senderID);
          api.sendMessage(`${senderID} | ${dataUser.name}\n𝗚𝗼̛̃ 𝗯𝗮𝗻 𝗿𝗼̂̀𝗶 𝗻𝗵𝗮!! Bây giờ bạn có thể tiếp tục sử dụng bot`, event.threadID, event.messageID);
          for (let idAdmin of global.config.ADMINBOT) {
            api.sendMessage(`𝗕𝗼𝘁 𝘃𝘂̛̀𝗮 𝗯𝗮𝗻 ${senderID} | ${dataUser.name}\n𝗛𝗲̣̂ 𝘁𝗵𝗼̂́𝗻𝗴 𝗱𝗮̃ 𝗴𝗼̛̃ 𝗯𝗮𝗻 𝗰𝗵𝗼 𝘂𝘀𝗲𝗿\n𝗧𝗶𝗺𝗲: ${time}`, idAdmin);
          }
        }, unbanAfter);
      });
      for (let idAdmin of global.config.ADMINBOT) {
        api.sendMessage(`Bot vừa ban ${senderID} | ${dataUser.name} tại nó spam bot ${so_lan_spam} lần/phút\nHệ thống sẽ gỡ ban cho user sau ${Math.floor(unbanAfter/60000)} phút\nThời gian: ${time}`, idAdmin);
      }
    }
  }
};
