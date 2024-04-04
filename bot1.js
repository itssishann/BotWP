const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require("axios");

const apiKey = "c20b345ab07c56d59fe7ae5567168bd2";

const client = new Client();

client.on('ready', () => {
    console.log('Bot is Connected');
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('message', async msg => {
    const body = msg.body;
    if (body.includes("weather")) {
        const city = body.split(" ")[2];
        if (!city) {
            msg.reply('Please specify a city for the weather information. 🫡\n');
            return;
        }
        try {
            const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
            if (data.cod == "404") {
                msg.reply(`Sorry, we couldn't find weather information for ${city}.`);
               
            await msg.react("❌");
            } else {
                const weather = data?.weather[0]?.main;
                const temp = (data?.main?.temp - 273.15).toFixed(2);
                const msgCity = data?.name;
                const clouds = `${data?.clouds?.all}%`;

                const emoji = getEmoji(weather);
                const msgLogger = `Weather in ${msgCity} is ${weather} ${emoji}\nTemperature is ${temp}°C \nClouds Visibility is ${clouds}`;

                await msg.reply(msgLogger);
                setTimeout(async () => {
                    await msg.react("✅");
                }, 850);
            }
        } catch (error) {
            console.log(`Error: Failed to fetch weather data for ${city}. ${error.message}`);
            msg.reply(`Error: Failed to fetch weather data for ${city}. Try another city.`);
        }
    } else if (body.includes("hii") || body.includes("hello") || body.includes("weather")) {
        msg.reply("Hello! I'm a weather bot. You can ask me for weather information by typing 'weather in <cityName>'. For example, 'weather in Delhi'.");
    }
    else{
        msg.reply("Please specify a city for weather information. Or message me 🤏 weather in <cityName>")
    }
});

function getEmoji(weather) {
    switch (weather.toLowerCase()) {
        case "clear":
            return "☀️";
        case "clouds":
            return "☁️";
        case "rain":
            return "🌧️";
        case "snow":
            return "❄️";
        default:
            return "🌈";
    }
}

client.initialize();
