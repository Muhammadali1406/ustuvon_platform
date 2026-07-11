require("dotenv").config();

const { Telegraf } = require("telegraf");
const projects = require("./projects");

const bot = new Telegraf(process.env.BOT_TOKEN);


// Nomzodlar

const users = [
  {
    id: 5259707725,
    name: "Abdulaziz Komiljonov",
    profession: "backend"
  },
  {
    id: 6690920445,
    name: "Muhammadjon Mashrabov",
    profession: "frontend"
  },
  {
    id: 1306147337,
    name: "Farrux To'g'onov",
    profession: "fullstack"
  },
  {
    id: 8393769853,
    name: "Boboxonov Javohir",
    profession: "backend"
  },
  {
    id: 1417999336,
    name: "Muslimbek Bostonov",
    profession: "frontend"
  },
  {
    id: 6134458285,
    name: "Davronbek Nabijonov",
    profession: "frontend"
  },
  {
    id: 2035940312,
    name: "Fozilov Muzaffar",
    profession: "designer"
  },
  {
    id: 1771891844,
    name: "Oqilbek Erkinov",
    profession: "fullstack"
  },
  {
    id: 6917684084,
    name: "Qodirov Biloliddin",
    profession: "backend"
  },
  {
    id: 8270492933,
    name: "Yuldoshev Sirojiddin",
    profession: "backend"
  },
  {
    id: 5817905119,
    name: "Samandar Qodirov",
    profession: "frontend"
  },
  {
    id: 6466116037,
    name: "Dilshod Mahmudov",
    profession: "fullstack"
  },
  {
    id: 6461443178,
    name: "Davronbek Nazarov",
    profession: "backend"
  }
];

// Admin tekshirish

function isAdmin(ctx) {
    return ctx.from.id === Number(process.env.ADMIN_ID);
}


// Bot ishga tushganda

bot.start((ctx)=>{

    ctx.reply(
        "✅ Bot ishlamoqda"
    );

});



// Loyiha yuborish

async function sendProjects(ctx){


    for(const user of users){


        try{


            const list = projects[user.profession];


            if(!list){

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



            const message = 
`
👋 Assalomu alaykum ${user.name}

🎯 Siz keyingi bosqichga o'tdingiz.

🚀 Sizga berilgan loyiha:

📌 ${project.title}


${project.text}


⏰ Muddat:
48 soat


Tayyor bo'lgach GitHub link yuboring.

Omad! 🔥
`;



            await bot.telegram.sendMessage(
                user.id,
                message
            );



            console.log(
                "Yuborildi:",
                user.name
            );


        }

        catch(error){

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
async(ctx)=>{


    if(!isAdmin(ctx)){

        return ctx.reply(
            "❌ Siz admin emassiz"
        );

    }


    await sendProjects(ctx);


});




// Xatolar

bot.catch((err)=>{

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