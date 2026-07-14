require("dotenv").config();

const { Telegraf } = require("telegraf");
const projects = require("./projects");

const bot = new Telegraf(process.env.BOT_TOKEN);


// Nomzodlar

const users = [
    //{id: 8393769853,name: "Boboxonov Javohir",profession: "backend"},
    {id: 8396840695,name: "Janob boshliq",profession: "fullstack", type: "offline"},
    {id: 8251893506,name: "Janob boshbori",profession: "fullstack", type: "online"},
    //{ id: 6917684084, name: "Qodirov Biloliddin", profession: "backend" },
    {
        id: 1417999336,
        name: "Muslimbek Bostonov",
        profession: "frontend",
        type: "offline"
    },
    {
        id: 6461443178,
        name: "Davronbek Nazarov",
        profession: "backend",
        type: "offline"
    },
    {
        id: 5259707725,
        name: "Abdulaziz Komiljonov",
        profession: "backend",
        type: "online"
    },
    {
        id: 8270492933,
        name: "Yuldoshev Sirojiddin",
        profession: "backend",
        type: "online"
    },
    {
        id: 5817905119,
        name: "Samandar Qodirov",
        profession: "frontend",
        type: "online"
    },
    {
        id: 6690920445,
        name: "Muhammadjon Mashrabov",
        profession: "frontend",
        type: "online"
    },
    {
        id: 6134458285,
        name: "Davronbek Nabijonov",
        profession: "frontend",
        type: "offline"
    },
    {
        id: 1306147337,
        name: "Farrux To'g'onov",
        profession: "fullstack",
        type: "offline"
    },
    {
        id: 1771891844,
        name: "Oqilbek Erkinov",
        profession: "fullstack",
        type: "offline"
    },
    {
        id: 6466116037,
        name: "Dilshod Mahmudov",
        profession: "fullstack",
        type: "online"
    },
    {
        id: 2035940312,
        name: "Fozilov Muzaffar",
        profession: "designer",
        type: "offline"
    }
];

// Admin tekshirish

function isAdmin(ctx) {
    return ctx.from.id === Number(process.env.ADMIN_ID);
}


// Bot ishga tushganda

bot.start((ctx) => {

    ctx.reply(
        "✅ Bot ishlamoqda"
    );

});



// Loyiha yuborish

async function sendProjects(ctx) {


    for (const user of users) {


        try {


            const list = projects[user.profession];


            if (!list) {

                console.log(
                    "Loyiha topilmadi:",
                    user.profession
                );

                continue;
            }



            const project =
                list[
                Math.floor(
                    Math.random() * list.length
                )
                ];



            const message1 =
                `
👋 Assalomu alaykum ${user.name} va jamoamizning yangi ishtrokchisi! 🎉

Avvalo, sizni jamoamizga qo'shilganingiz bilan samimiy tabriklayman. Oldimizda katta maqsadlar va qiziqarli loyihalar turibdi. Ishonamanki, birgalikda kuchli natijalarga erishamiz.

Yaqin kunlarda uchrashuv tashkil qilamiz. Uchrashuv joyi sifatida ofis yoki qulay kafe tanlanadi. Lokatsiya va aniq vaqt alohida yuboriladi.

Uchrashuvda jamoa bilan tanishamiz, ish tartibi, qoidalar, vazifalar va kelajakdagi rejalarni muhokama qilamiz.

Barchangizni belgilangan vaqtda ishtirok etishingizni so'rayman. Yangi bosqich muborak bo'lsin! Birgalikda katta natijalarga erishamiz! 🚀

`;

            const message2 = `👋 Assalomu alaykum ${user.name} va jamoamizning yangi ishtrokchisi! 🎉

Avvalo, sizni jamoamizga qo'shilganingiz bilan tabriklayman. Ishonamanki, birgalikda katta loyihalarni amalga oshiramiz va kuchli natijalarga erishamiz.

Sizlar online formatda faoliyat yuritasizlar. Yaqin kunlarda zoom yoki watsap orqali online meeting tashkil etib har biringizga loyiha tafsilotlari, ish tartibi, vazifalar va foydalaniladigan platformalar haqida batafsil ma'lumot beriladi.

Har biringizga omad, muvaffaqiyat va unumli ish faoliyatini tilayman. Birgalikda kuchli jamoa bo'lib rivojlanamiz! 🚀\n\nAgar siz Farg'ona viloyatida offline ishlay olaman desangiz @muhammadali_1406 ga murojat qilishingizni so'raymiz`



            const message = user.type === "online" ? message2 : message1;

            await bot.telegram.sendMessage(
                user.id,
                message
            );



            console.log(
                "Yuborildi:",
                user.name
            );


        }

        catch (error) {

            console.log(
                "XATO:",
                user.id,
                error.message
            );

        }

    }


    ctx.reply(
        "✅ Loyihalar yuborildi"
    );

}



// Admin komandasi

bot.command(
    "send_projects",
    async (ctx) => {


        if (!isAdmin(ctx)) {

            return ctx.reply(
                "❌ Siz admin emassiz"
            );

        }


        await sendProjects(ctx);


    });




// Xatolar

bot.catch((err) => {

    console.log(
        "BOT XATO:",
        err
    );

});




// Ishga tushirish

bot.launch();


console.log(
    "🚀 Bot ishga tushdi"
);