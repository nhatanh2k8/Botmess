const request = require("request");
const fs = require("fs")
const axios = require("axios")
module.exports.config = {
  name: "tát",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "AnhCode",
  description: "Tát người bạn tag",
  commandCategory: "Thành Viên",
  usages: "[tag]",
  cooldowns: 5,
};

module.exports.run = async({ api, event, Threads, global }) => {
  var link = [    
"https://i.postimg.cc/9QLrR9G4/12334wrwd534wrdf-3.gif",
"https://i.postimg.cc/pTFT6138/12334wrwd534wrdf-8.gif",
"https://i.postimg.cc/L5VHddDq/slap-anime.gif",
"https://i.postimg.cc/K8jmWHMz/VW0cOyL.gif",
   ];
   var mention = Object.keys(event.mentions);
     let tag = event.mentions[mention].replace("@", "");
    if (!mention) return api.sendMessage("Vui lòng tag 1 người", threadID, messageID);
   var callback = () => api.sendMessage({body:`${tag}` + ` Tát chết con đũy mẹ mày nè 😏`,mentions: [{tag: tag,id: Object.keys(event.mentions)[0]}],attachment: fs.createReadStream(__dirname + "/cache/tatslap.gif")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/tatslap.gif"));  
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/tatslap.gif")).on("close",() => callback());
   }