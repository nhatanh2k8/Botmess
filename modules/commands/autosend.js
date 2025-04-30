const moment = require('moment-timezone');
const axios = require('axios');

module.exports.config = {
    name: 'autosend',
    version: '10.02',
    hasPermission: 3,
    credits: 'AnhCode',
    description: 'Tự động gửi tin nhắn theo giờ đã cài!',
    commandCategory: 'Admin',
    usages: '[]',
    cooldowns: 3,
    images: [],
};

const weather = require('weather-js');
const findWeather = (city, degreeType = 'C') => {
    return new Promise((resolve, reject) => {
        weather.find({
            search: city,
            degreeType
        }, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

const nam = [{
        timer: '00:00:00',
        message: ['Chúc mọi người ngủ ngon 😴', 'Khuya rùi ngủ ngon nhé các bạn 😇']
    },
    {
        timer: '00:30:00',
        message: ['\n{thoitiet}']
    },
    {
        timer: '05:00:00',
        message: ['\n{thoitiet}']
    },
    {
        timer: '06:00:00',
        message: ['Chúc mọi người buổi sáng vui vẻ 😉', 'Chúc mn buổi sáng vv ❤️', 'Buổi sáng đầy năng lượng nha các bạn 😙']
    },
    {
        timer: '07:00:00',
        message: ['Xuân Diệu thì biết làm thơ\nCòn anh chỉ biết ngẩn ngơ nhìn nàng', 'Ngoài kia đám cưới linh đình\nBao giờ thì đến lượt mình em ơi.', 'Ba đồng một mớ trầu cau\nEm cho anh hỏi cưới nhau ngày nào?']
    },
    {
        timer: '08:00:00',
        message: ['Cho anh liều thuốc an thần\nĐể tim ổn định khi gần bên em.', 'Bao nhiêu cân thính cho vừa\nBao nhiêu cân bả mới lừa được em. 😙', 'Tính anh chẳng thích lưng chừng\nYêu anh chẳng sợ cắm sừng đâu em.']
    },
    {
        timer: '09:00:00',
        message: ['10 năm cắn kẹo cũng chẳng thể bằng một tẹo hun em.', 'Em ơi nước biển màu xanh\nKhoai môn màu tím, tim em màu gì?', 'Đêm rằm có bánh Trung thu\nTiện cho anh hỏi gu em là gì?']
    },
    {
        timer: '10:00:00',
        message: ['Em hôm nay vừa hâm vừa dở\nAnh bước vào che chở có được không?', 'Họ thích nghe nhạc có lời\nCòn anh lại thích trọn đời có em.', 'Người ta mê mẩn bóng cười\nCòn em mê mẩn bóng người em thương.']
    },
    {
        timer: '11:00:00',
        message: ['Mẹ sinh em không phải để em vất vả\nMà là sau này để gả cho anh', 'Mượn xe nhớ đổ đầy bình\nMượn tim nhớ đổ đầy tình giúp anh.', 'Nước non phong cảnh hữu tình\nLiệu em có muốn chúng mình nên duyên?']
    },
    {
        timer: '12:00:00',
        message: ['Chúc mọi người buổi trưa vui vẻ 😋', 'Chúc mọi người bữa trưa ngon miệng 😋']
    },
    {
        timer: '12:30:00',
        message: ['\n{thoitiet}']
    },
    {
        timer: '13:00:00',
        message: ['Chúc mọi người buổi chiều đầy năng lượng 😼', 'Chúc mọi người buổi chiều vui vẻ 🙌']
    },
    {
        timer: '14:00:00',
        message: ['Trời buồn trời đổ mưa ngâu\nMẹ anh đang tuyển con dâu rồi nè.', 'Mẹ mua cho con heo đất\nTiền anh đem cất sau này cưới em.', 'Bình yên là một bờ vai\nMình đem ra đổi bằng 2 nụ cười.']
    },
    {
        timer: '15:00:00',
        message: ['Anh đăng story không phải để thả thính\nMà cái chính là để em xem.', 'Hôm nay em đói cồn cào\nShip anh một chút ngọt ngào đi em.', 'Order giùm anh một tình yêu chẳng phai\nGiá phải chăng nhưng chắc chẳng phải em?']
    },
    {
        timer: '16:00:00',
        message: ['Tim anh đã bật đèn xanh\nMà sao em mãi đạp phanh thế này?', 'Trăng lên đỉnh núi trăng tà\nEm yêu anh thật hay là yêu chơi?', 'Mời cậu ăn bát phở lòng tái\nĐể rồi mong cậu phải lòng tớ.']
    },
    {
        timer: '17:00:00',
        message: ['Nhân gian vốn lắm bộn bề\nSao không bỏ hết rồi về bên anh?', 'Nếu em thích người thú vị thì anh đây chính là một ví dụ.', 'Thời tiết trái gió trở trời\nTim anh lỡ nhịp cả đời thương em.']
    },
    {
        timer: '18:00:00',
        message: ['Đêm Hà Nội sương mù bao phủ\nNhớ em rồi có ngủ được đâu.', 'Tài nấu ăn anh hơi ẩu\nChẳng biết nấu gì ngoài lẩu tình yêu', 'Ăn ớt làm em cay\nCòn anh làm em say !']
    },
    {
        timer: '19:00:00',
        message: ['Bắc Đẩu đã có Nam Tào\nCòn em đã có người nào hay chưa?', 'Tim anh đã bật đèn xanh\nYêu anh thì nói nhanh nhanh lên nào.', 'Giới hạn của hàm số là lim\nGiới hạn của trái tim tớ chính là cậu.']
    },
    {
        timer: '20:00:00',
        message: ['Đừng nghĩ anh xấu mà chê\nYêu anh thì biết nó phê cỡ nào.', 'Lửa gần rơm lâu ngày cũng bén\nThích lâu rồi cho chén được không em?', 'Nếu em thấy tương lai mù mịt\nNhắm mắt vào để anh thịt em nha.']
    },
    {
        timer: '21:00:00',
        message: ['Yêu anh đi anh cho hôn má\nNếu mà yêu quá thì mình hôn môi', 'Lung linh trong chút nắng chiều\nYêu em say đắm, muốn liều Kết Hôn', 'Nguyễn Du lúc viết Truyện Kiều\nHình như viết thiếu là Kiều thư em']
    },
    {
        timer: '22:00:00',
        message: ['Thiếu oxi ta không thể thở\nVẻ đẹp của nàng thơ không thể tả.', 'Vì mật mà ong thật liều\nVì em mà yêu thật lòng.', 'Trái tim anh đang dao động điều hoà\nTừ khi em đến bỗng lệch pha.']
    },
    {
        timer: '23:00:00',
        message: ['Thả thính mệt wa rùi thôi để cho các bạn ngủ ngon nè.']
    }
];

module.exports.onLoad = o => setInterval(async () => {
    const r = a => a[Math.floor(Math.random() * a.length)];
    const currentTime = moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss');

    if (á = nam.find(i => i.timer === currentTime)) {
        const gio = moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss || DD/MM/YYYY');

        var msg = r(á.message);
        var tinh = [
            "Bắc Ninh", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Hải Dương", "Hà Nội",
            "Quảng Ninh", "Thái Bình", "Nam Định", "Ninh Bình", "Thái Nguyên", "Phú Thọ", "Vĩnh Phúc",
            "Bắc Giang", "Lạng Sơn", "Quảng Bình", "Quảng Trị", "Thừa Thiên Huế", "Quảng Nam", "Quảng Ngãi",
            "Bình Định", "Phú Yên", "Khánh Hòa", "Ninh Thuận", "Bình Thuận", "Kon Tum", "Gia Lai", "Đắk Lắk",
            "Đắk Nông", "Lâm Đồng", "Bình Phước", "Tây Ninh", "Bình Dương", "Đồng Nai", "Long An", "Đồng Tháp",
            "Tiền Giang", "An Giang", "Bà Rịa - Vũng Tàu", "Bến Tre", "Bạc Liêu", "Cà Mau", "Hậu Giang",
            "Kiên Giang", "Sóc Trăng", "Trà Vinh", "Vĩnh Long", "Thanh Hóa"
        ];
        const city = tinh[Math.floor(Math.random() * tinh.length)];
        const result = await findWeather(city);
        var currentDay = result[0].current.day.replace(/Friday/g, "Thứ 6").replace(/Saturday/g, "Thứ 7").replace(/Sunday/g, "Chủ nhật").replace(/Monday/g, "Thứ 2").replace(/Tuesday/g, "Thứ 3").replace(/Wednesday/g, "Thứ 4").replace(/Thursday/g, "Thứ 5");
        var date = result[0].current.date;
        var dateFormat = `Ngày ${date.split("-")[2]}-${date.split("-")[1]}-${date.split("-")[0]}`;
        var skytext = result[0].current.skytext.toString()
        "Cloudy" == skytext ? skytext = "Mây" : "Sunny" == skytext ? skytext = "Nắng" : "Partly Cloudy" == skytext ? skytext = "Mây một phần" : "Mostly Cloudy" == skytext ? skytext = "Mây rất nhiều" : "Rain" == skytext ? skytext = "Mưa" : "Thunderstorm" == skytext ? skytext = "Bão" : "Snow" == skytext ? skytext = "Tuyết" : "Fog" == skytext || "Haze" == skytext ? skytext = "Sương mù" : "Clear" == skytext ? skytext = "Trời trong" : "Light Rain" == skytext ? skytext = "Mưa nhẹ" : "Mostly Clear" == skytext && (skytext = "Trời trong rất nhiều");
        var winddisplay = result[0].current.winddisplay.toString().split(" ")[2];
        "Northeast" == winddisplay && (winddisplay = "Hướng Đông Bắc"), "Northwest" == winddisplay && (winddisplay = "Hướng Tây Bắc"), "Southeast" == winddisplay && (winddisplay = "Hướng Đông Nam"), "Southwest" == winddisplay && (winddisplay = "Hướng Tây Nam"), "East" == winddisplay && (winddisplay = "Hướng Đông"), "West" == winddisplay && (winddisplay = "Hướng Tây"), "North" == winddisplay && (winddisplay = "Hướng Bắc"), "South" == winddisplay && (winddisplay = "Hướng Nam");
        var thoitiet = `(~~[ ${gio} ]~~)\n──────────────────\n[🗺️] →⁠ Cập nhật thời tiết tại: ${result[0].location.name}\n[🌡] →⁠ Nhiệt độ: ${result[0].current.temperature}°${result[0].location.degreetype}\n[✏️] →⁠ Mô tả: ${skytext}\n[♒] →⁠ Độ ẩm: ${result[0].current.humidity}%\n[💨] →⁠ Hướng gió: ${result[0].current.windspeed} ${winddisplay}\n[⏰] →⁠ Ghi nhận vào: ${result[0].current.observationtime}\n[🗺️] →⁠ Từ trạm ${result[0].current.observationpoint}\n────────────────────\n🔄 Đây Là Tin Nhắn Tự Động`;

        msg = msg.replace(/{thoitiet}/, thoitiet);

        msg = {
            body: msg,
        };

        global.data.allThreadID.forEach(i => o.api.sendMessage(msg, i));
    }
}, 1000);

module.exports.run = () => {};