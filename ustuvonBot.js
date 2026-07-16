require("dotenv").config();

const { Telegraf } = require("telegraf");
const projects = require("./projects");

const bot = new Telegraf(process.env.BOT_TOKEN);


// Nomzodlar

const users = [
    {id: 6466116037,name: "Dilshod Mahmudov",profession: "fullstack",type: "online"},
    {id: 6690920445,name: "Muhammadjon Mashrabov",profession: "frontend",type: "online"},
    {id: 5817905119,name: "Samandar Qodirov",profession: "frontend",type: "online"},
    {id: 8393769853, name: "Boboxonov Javohir", profession: "backend", type: "online" },
    {id: 5259707725,name: "Abdulaziz Komiljonov",profession: "backend",type: "online"},
    {id: 8270492933,name: "Yuldoshev Sirojiddin",profession: "backend",type: "online"},
    {id: 6461443178,name: "Davronbek Nazarov",profession: "backend",type: "offline"},
    {id: 6134458285,name: "Davronbek Nabijonov",profession: "frontend",type: "offline"},
    {id: 8396840695, name: "Janob boshliq", profession: "fullstack", type: "offline" },
    {id: 1306147337,name: "Farrux To'g'onov",profession: "fullstack",type: "offline"},
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



            const message =
                `
                **Assalomu alaykum!**\n\n

Avvalambor sizni shu bosqichgacha yetib kelganingiz bilan yana bir bor tabriklaymiz.\n\n

Hozirda biz **zamonaviy online ta'lim platformasi** ustida ishlamoqdamiz. Bu platforma faqat bitta yo'nalish bilan cheklanmaydi, balki kelajakda **turli fanlar, kasbiy yo'nalishlar va ta'lim xizmatlarini o'z ichiga oladigan yirik ta'lim ekotizimi** bo'lishi rejalashtirilgan.

Platformaning asosiy afzalliklaridan biri — **aqlli test tizimi**. Ushbu tizim o'quvchining shunchaki to'g'ri javoblari sonini emas, balki uning **haqiqiy bilim darajasi**, kuchli va sust tomonlarini tahlil qilib, natijalarni aniq ko'rsatib beradi.
\n\n
### Hamkorlik shartlari\n

* Loyiha **daromad keltira boshlaguniga qadar ish masofadan (online)** olib boriladi.\n
* Loyiha daromadga chiqqach, jamoa **ofis (offline)** formatida faoliyat yuritadi.\n
* Boshlang'ich bosqichda **oylik maosh to'lanmaydi**.\n
* Asosiy maqsad — loyihani birgalikda rivojlantirib, muvaffaqiyatga olib chiqish.\n
* Loyiha daromad keltira boshlagach, tushgan foyda **jamoa a'zolari o'rtasida teng taqsimlanadi**.\n

Bu yerda siz oddiy **xodim** emas, balki loyihaning **jamoa a'zosi va hamkori** bo'lasiz. Sizning hissangiz loyiha rivojiga xizmat qiladi va muvaffaqiyatga erishilgach, uning natijasidan boshqalar qatori siz ham manfaatdor bo'lasiz.\n

Biz mas'uliyatli, o'z ustida ishlaydigan va uzoq muddatli maqsadlarni ko'zlaydigan insonlarni izlayapmiz. Agar siz katta loyihaning bir qismi bo'lishni, uni birgalikda qurishni  va kelajakdagi muvaffaqiyatidan ulush olishni istasangiz, sizni jamoamiz safida ko'rishdan mamnun bo'lamiz.\n

**Eslatma:** Bu oddiy ishga qabul emas. Bu — birgalikda katta loyiha qurish va uning kelajagini birga yaratish imkoniyatidir. Agar sizning maqsadingiz yuqori maosh va barqaror daromad bo'lsa, ehtimol bu loyiha siz uchun emas. Biz sizni loyihani rivojlantirish va muvaffaqiyatga erishish hamda tushadigan daromadan teng miqdorda ulush olish uchun taklif etamiz.\n\n
Sizni jamoamizga qo'shilishga taklif qilamiz. Agar siz ham biz bilan birga loyihani rivojlantirishni xohlasangiz, iltimos, quyidagi havolaga o'ting va **loyihaga sherik sifatida kiring.\n\n havola: https://t.me/ustuvonWeb

            `;

            
            //const message = user.type === 'offline' ? message1 : message2;

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