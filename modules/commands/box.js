module.exports.config = {
	name: "box",
	version: "2.1.1",
	hasPermssion: 1,
	credits: "AnhCode",
	description: "Xem thông tin thread/user",
	commandCategory: "Quản Trị Viên",
	usages: "[thread/user]",
	cooldowns: 5,
	dependencies: {
		axios: "",
		"fs-extra": "",
		request: "",
	},
};

const totalPath = __dirname + "/cache/data/totalChat.json";
const _24hours = 86400000;
const fs = require("fs-extra");
const request = require("request");
const axios = require("axios");

module.exports.handleEvent = async ({ api, event, args }) => {
	if (!fs.existsSync(totalPath))
		fs.writeFileSync(totalPath, JSON.stringify({}));
	let totalChat = JSON.parse(fs.readFileSync(totalPath));
	if (!totalChat[event.threadID]) return;
	if (Date.now() - totalChat[event.threadID].time > _24hours * 2) {
		let sl = (await api.getThreadInfo(event.threadID)).messageCount;
		totalChat[event.threadID] = {
			time: Date.now() - _24hours,
			count: sl,
			ytd: sl - totalChat[event.threadID].count,
		};
		fs.writeFileSync(totalPath, JSON.stringify(totalChat, null, 2));
	}
};

module.exports.run = async function ({ api, event, args, Users, Threads }) {
	const { threadID, messageID, senderID, type, mentions, messageReply } = event;
	const moment = require("moment-timezone");
	const gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss");
	if (args.length == 0) {
		return api.sendMessage(
			`${global.config.PREFIX}${this.config.name} img [Reply] -> Thay đổi ảnh box\n${global.config.PREFIX}${this.config.name} id -> Lấy id box\n${global.config.PREFIX}${this.config.name} info -> Xem info box\n${global.config.PREFIX}${this.config.name} name -> Thay đổi tên box\n${global.config.PREFIX}${this.config.name} new -> Tạo nhóm với người được tag`,
			threadID
		);
	}
	var id = [event.senderID] || [];
	var main = event.body;
	var groupTitle = main.slice(main.indexOf("|") + 2);
	if (args[0] == "new") {
		for (var i = 0; i < Object.keys(event.mentions).length; i++)
			id.push(Object.keys(event.mentions)[i]);
		api.createNewGroup(id, groupTitle, () => {
			api.sendMessage(`✅ Đã tạo nhóm ${groupTitle}`, event.threadID);
		});
	}
	if (args[0] == "id") {
		return api.sendMessage(
			`${event.threadID}`,
			event.threadID,
			event.messageID
		);
	}

	if (args[0] == "name") {
	if(event.args.length == 0 && !event.messageReply) return 
			api.setTitle(event.args.slice(2).join(' ') || event?.messageReply?.body, event.threadID);
		}

	if (args[0] == "img") {
		if (event.type !== "message_reply")
			return api.sendMessage(
				"⚠️ Bạn phải reply một audio, video, ảnh nào đó",
				event.threadID,
				event.messageID
			);
		if (
			!event.messageReply.attachments ||
			event.messageReply.attachments.length == 0
		)
			return api.sendMessage(
				"⚠️ Bạn phải reply một audio, video, ảnh nào đó",
				event.threadID,
				event.messageID
			);
		if (event.messageReply.attachments.length > 1)
			return api.sendMessage(
				`⚠️ Bạn phải reply một audio, video, ảnh nào đó`,
				event.threadID,
				event.messageID
			);
		var callback = () =>
			api.changeGroupImage(
				fs.createReadStream(__dirname + "/cache/1.png"),
				event.threadID,
				() => fs.unlinkSync(__dirname + "/cache/1.png")
			);
		return request(encodeURI(event.messageReply.attachments[0].url))
			.pipe(fs.createWriteStream(__dirname + "/cache/1.png"))
			.on("close", () => callback());
	}
	if (args[0] == "info") {
		try {
			if (!fs.existsSync(totalPath))
				fs.writeFileSync(totalPath, JSON.stringify({}));
			let totalChat = JSON.parse(fs.readFileSync(totalPath));
			let timeByMS = Date.now();
			const threadInfo = await api.getThreadInfo(event.threadID)
			let threadMem = threadInfo.participantIDs.length;
			var gendernam = [];
			var gendernu = [];
			var nope = [];
			for (let z in threadInfo.userInfo) {
				var gioitinhone = threadInfo.userInfo[z].gender;
				var nName = threadInfo.userInfo[z].name;
				if (gioitinhone == "MALE") {
					gendernam.push(z + gioitinhone);
				} else if (gioitinhone == "FEMALE") {
					gendernu.push(gioitinhone);
				} else {
					nope.push(nName);
				}
			}
			var adminName = [];
			for (const arrayAdmin of threadInfo.adminIDs) {
				const name = await Users.getNameUser(arrayAdmin.id);
				adminName.push(name);
			}
			var nam = gendernam.length;
			var nu = gendernu.length;
			let sl = threadInfo.messageCount;
			let icon = threadInfo.emoji;
			let threadName = threadInfo.threadName;
			let id = threadInfo.threadID;
			let sex = threadInfo.approvalMode;
			var pd = sex == false ? "tắt" : sex == true ? "bật" : "kh";
			if (!totalChat[args[1] || threadID]) {
				totalChat[args[1] || threadID] = {
					time: timeByMS,
					count: sl,
					ytd: 0,
				};
				fs.writeFileSync(totalPath, JSON.stringify(totalChat, null, 2));
			}
			let mdtt = Math.floor(Math.random() * 101);
			let preCount = totalChat[args[1] || threadID].count || 0;
			let ytd = totalChat[args[1] || threadID].ytd || 0;
			let hnay = ytd != 0 ? sl - preCount : "chưa có thống kê";
			let hqua = ytd != 0 ? ytd : "chưa có thống kê";
			if (timeByMS - totalChat[args[1] || threadID].time > _24hours) {
				if (timeByMS - totalChat[args[1] || threadID].time > _24hours * 2) {
					totalChat[args[1] || threadID].count = sl;
					totalChat[args[1] || threadID].time = timeByMS - _24hours;
					totalChat[args[1] || threadID].ytd = sl - preCount;
					fs.writeFileSync(totalPath, JSON.stringify(totalChat, null, 2));
				}
				getHour = Math.ceil(
					(timeByMS - totalChat[args[1] || event.threadID].time - _24hours) /
						3600000
				);
				if (ytd == 0) mdtt = 100;
				else mdtt = ((hnay / ((hqua / 24) * getHour)) * 100).toFixed(0);
				mdtt += "%";
			}
			var callback = () =>
				api.sendMessage(
					{
						body: `🏘️ Box: ${
							threadName || "không có"
						}\n🔢 ID: ${id}\n🔒 Phê duyệt: ${pd}\n📝 Emoji: ${
							icon || "👍"
						}\n✏️ Thông tin: ${threadMem} thành viên ${nam} nam ${nu} nữ\n🧿 Quản Trị Viên:\n ${adminName.join(
							"\n"
						)}\n💬 Tổng: ${sl.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} tin nhắn\n📊 Mức tương tác: ${mdtt}`,
						attachment: fs.createReadStream(__dirname + "/cache/1.png"),
					},
					threadID,
					() => fs.unlinkSync(__dirname + "/cache/1.png"),
					messageID
				);
			return request(encodeURI(`${threadInfo.imageSrc}`))
				.pipe(fs.createWriteStream(__dirname + "/cache/1.png"))
				.on("close", () => callback());
		} catch (e) {
			return (
				console.log(e),
				api.sendMessage(
					`⚠️ Không thể lấy thông tin nhóm\n${e}`,
					threadID,
					messageID
				)
			);
		}
	}
};
