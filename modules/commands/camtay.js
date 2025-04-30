const request = require("request");
const fs = require("fs")
const axios = require("axios")
module.exports.config = {
  name: "camtay",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "AnhCode",
  description: "Nắm tay người Bạn Muốn",
  commandCategory: "Tình Yêu",
  usages: "@tag",
  cooldowns: 5,
  dependencies: {"request": "","fs": "","axios": ""}
};

module.exports.run = async({api,event,args,client,Users,Threads,__GLOBAL,Currencies}) => {
        const request = require('request')
                const fs = require('fs')
                  var mention = Object.keys(event.mentions)[0];
let tag = event.mentions[mention].replace("@", "");
        var link = [
          "https://i.pinimg.com/originals/96/f3/0d/96f30d638b316a39465d45236ce931c3.gif",
             ];
   var callback = () => api.sendMessage({body: `${tag}, đưa tay đây nào 🤝\n[⚜️]→ Mãi bên nhau bạn nhớ 💘` , mentions: [{
          tag: tag,
          id: Object.keys(event.mentions)[0]
        }],
  attachment: fs.createReadStream(__dirname + "/cache/namtay.gif")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/namtay.gif"));
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/namtay.gif")).on("close",() => callback());
   };