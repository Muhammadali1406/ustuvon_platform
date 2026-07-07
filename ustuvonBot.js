require("dotenv").config();

const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

const users = {};

bot.start((ctx) => {

    users[ctx.from.id] = {
        step: 1,
        data: {}
    };

    ctx.reply(
        "👋 Assalomu alaykum!\n\nIltimos, quyidagi ma'lumotlarni kiriting.\n\n👤 Ism va familiyangiz:"
    );

});

bot.on("text", async (ctx) => {

    const user = users[ctx.from.id];

    if (!user) return;

    switch (user.step) {

        // Ism
        case 1:

            user.data.name = ctx.message.text;
            user.step = 2;

            return ctx.reply(
                "📞 Telefon raqamingizni yuboring:",
                Markup.keyboard([
                    [Markup.button.contactRequest("📞 Telefon yuborish")]
                ])
                    .resize()
                    .oneTime()
            );

        // Telefon contact orqali olinadi
        case 2:
            return;

        // Manzil
        case 3:

            user.data.address = ctx.message.text;
            user.step = 4;

            return ctx.reply("🎂 Tug'ilgan sanangizni kiriting (01.01.2000):");

        // Tug'ilgan sana
        case 4:

            user.data.birth = ctx.message.text;
            user.step = 5;

            return ctx.reply("💼 Mutaxassisligingiz?\n\nMasalan:\nFrontend\nBackend\nFull Stack\nMobile");

        // Mutaxassislik
        case 5:

            user.data.job = ctx.message.text;
            user.step = 6;

            return ctx.reply(
                "🛠 Qaysi texnologiyalarni bilasiz?\n\nMasalan:\nReact, Next.js\nNode.js, Express\nPython, Django"
            );

        // Texnologiyalar
        case 6:

            user.data.specialty = ctx.message.text;
            user.step = 7;

            return ctx.reply("⏳ Necha yillik tajribangiz bor?");

        // Tajriba
        case 7:

            user.data.experience = ctx.message.text;
            user.step = 8;

            return ctx.reply("💻 GitHub profilingiz linkini yuboring.\n\nAgar bo'lmasa '-' yozing.");

        // GitHub
        case 8:

            user.data.github = ctx.message.text;
            user.step = 9;

            return ctx.reply("🌐 Portfolio yoki CV linkini yuboring.\n\nAgar bo'lmasa '-' yozing.");

        // Portfolio
        case 9:

            user.data.portfolio = ctx.message.text;
            user.step = 10;

            const preview = `
📋 MA'LUMOTLARNI TEKSHIRING

👤 Ism:
${user.data.name}

📞 Telefon:
${user.data.phone}

🏠 Manzil:
${user.data.address}

🎂 Tug'ilgan sana:
${user.data.birth}

💼 Mutaxassislik:
${user.data.job}

🛠 Texnologiyalar:
${user.data.specialty}

⏳ Tajriba:
${user.data.experience}

💻 GitHub:
${user.data.github}

🌐 Portfolio:
${user.data.portfolio}
`;

            return ctx.reply(
                preview,
                Markup.keyboard([
                    ["✅ To'g'ri, yuborish"],
                    ["❌ Xato, qayta to'ldirish"]
                ])
                    .resize()
                    .oneTime()
            );



        // Tasdiqlash
        // Tasdiqlash
        case 10:

            if (ctx.message.text === "❌ Xato, qayta to'ldirish") {

                users[ctx.from.id] = {
                    step: 1,
                    data: {}
                };

                return ctx.reply(
                    "🔄 Mayli, boshidan boshlaymiz.\n\n👤 Ism va familiyangizni kiriting:",
                    Markup.removeKeyboard()
                );
            }


            if (ctx.message.text === "✅ To'g'ri, yuborish") {


                const text = `
📋 YANGI ISHCHI / NOMZOD

👤 Ism:
${user.data.name}

📞 Telefon:
${user.data.phone}

🏠 Manzil:
${user.data.address}

🎂 Tug'ilgan sana:
${user.data.birth}

💼 Mutaxassislik:
${user.data.job}

🛠 Texnologiyalar:
${user.data.specialty}

⏳ Tajriba:
${user.data.experience}

💻 GitHub:
${user.data.github}

🌐 Portfolio:
${user.data.portfolio}

──────────────
📱 Telegram:
@${ctx.from.username || "-"}

🆔 ID:
${ctx.from.id}
`;


                await bot.telegram.sendMessage(
                    process.env.ADMIN_ID,
                    text
                );


                delete users[ctx.from.id];


                return ctx.reply(
                    "✅ Ma'lumotlaringiz muvaffaqiyatli yuborildi.",
                    Markup.removeKeyboard()
                );

            }

            return ctx.reply(
                "⚠️ Pastdagi tugmalardan birini tanlang."
            );
    }
});

bot.on("contact", (ctx) => {

    const user = users[ctx.from.id];

    if (!user) return;

    user.data.phone = ctx.message.contact.phone_number;
    user.step = 3;

    ctx.reply(
        "🏠 Yashash manzilingizni kiriting:",
        Markup.removeKeyboard()
    );

});


bot.launch();

console.log("🤖 Bot ishga tushdi...");