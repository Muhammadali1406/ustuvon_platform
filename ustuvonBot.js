require("dotenv").config();

const { Telegraf } = require("telegraf");

const projects = require("./projects");


const bot = new Telegraf(
    process.env.BOT_TOKEN
);



const users = [

    {
        id: 8396840695,
        name: "John Doe",
        profession: "backend"
    },
    {
        id: 8099181223,
        name: "John Doe",
        profession: "backend"
    }
];



// admin tekshirish

function isAdmin(ctx) {

    return ctx.from.id == process.env.ADMIN_ID;

}



// loyiha yuborish

bot.command("send_projects", async (ctx) => {


    if (!isAdmin(ctx)) {
        return ctx.reply("❌ Ruxsat yo'q");
    }



    for (const user of users) {


        let list = projects[user.profession];


        if (!list) {
            continue;
        }



        let project =
            list[
            Math.floor(
                Math.random() * list.length
            )
            ];



        let message = `

👋 Assalomu alaykum ${user.name}!


🎯 Siz keyingi bosqichga o'tdingiz.


🚀 Sizga berilgan loyiha:


${project.title}


${project.text}



⏰ Muddat:
48 soat


Tayyor bo'lgach GitHub link yuboring.


Omad! 🔥

`;



        try {


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
                "Xato:",
                user.id,
                error.message
            );

        }


    }



    ctx.reply(
        "✅ Barcha loyihalar yuborildi"
    );


});





bot.start((ctx) => {

    ctx.reply(
        "Bot ishlamoqda ✅"
    );

});





bot.launch();



console.log(
    "Bot ishga tushdi..."
);