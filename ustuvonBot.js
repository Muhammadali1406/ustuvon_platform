require("dotenv").config();

const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

const users = {};

const frontendQuestions = [
    {
        id: 1,
        category: "JavaScript",
        level: "easy",
        question: "JavaScript qaysi turdagi til?",
        options: [
            "Compiled",
            "Interpreted",
            "Machine Language",
            "Assembly"
        ],
        answer: 1,
        explanation: "JavaScript interpreted language hisoblanadi."
    },
    {
        id: 2,
        category: "JavaScript",
        level: "easy",
        question: "typeof null natijasi nima?",
        options: [
            "null",
            "undefined",
            "object",
            "boolean"
        ],
        answer: 2,
        explanation: "Bu JavaScript tarixiy xatosi."
    },
    {
        id: 3,
        category: "JavaScript",
        level: "easy",
        question: "Qaysi qiymat falsy emas?",
        options: [
            "0",
            "''",
            "[]",
            "null"
        ],
        answer: 2,
        explanation: "Bo'sh array truthy."
    },
    {
        id: 4,
        category: "JavaScript",
        level: "medium",
        question: "0.1 + 0.2 === 0.3 ?",
        options: [
            "true",
            "false",
            "undefined",
            "NaN"
        ],
        answer: 1,
        explanation: "Floating point xatosi sabab."
    },
    {
        id: 5,
        category: "JavaScript",
        level: "medium",
        question: "=== nimani tekshiradi?",
        options: [
            "Faqat qiymat",
            "Qiymat va tip",
            "Faqat tip",
            "Hech biri"
        ],
        answer: 1,
        explanation: "Strict equality."
    },
    {
        id: 6,
        category: "JavaScript",
        level: "medium",
        question: "const arrayga push qilish mumkinmi?",
        options: [
            "Yo'q",
            "Ha",
            "Faqat splice",
            "Faqat concat"
        ],
        answer: 1,
        explanation: "Reference o'zgarmaydi."
    },
    {
        id: 7,
        category: "JavaScript",
        level: "medium",
        question: "Promise nima?",
        options: [
            "Database",
            "Asinxron obyekt",
            "API",
            "Loop"
        ],
        answer: 1
    },
    {
        id: 8,
        category: "JavaScript",
        level: "medium",
        question: "Event Loop nima?",
        options: [
            "Compiler",
            "Asinxron task boshqaruvi",
            "Database",
            "Thread"
        ],
        answer: 1
    },
    {
        id: 9,
        category: "JavaScript",
        level: "medium",
        question: "Arrow function this ni qayerdan oladi?",
        options: [
            "Own",
            "Lexical",
            "Window",
            "Global"
        ],
        answer: 1
    },
    {
        id: 10,
        category: "JavaScript",
        level: "easy",
        question: "NaN === NaN ?",
        options: [
            "true",
            "false",
            "undefined",
            "0"
        ],
        answer: 1
    },
    {
        id: 11,
        category: "React",
        level: "easy",
        question: "React nima?",
        options: [
            "Framework",
            "Library",
            "Language",
            "Database"
        ],
        answer: 1
    },
    {
        id: 12,
        category: "React",
        level: "easy",
        question: "React kim yaratgan?",
        options: [
            "Google",
            "Facebook",
            "Microsoft",
            "Amazon"
        ],
        answer: 1
    },
    {
        id: 13,
        category: "React",
        level: "easy",
        question: "React Virtual DOM ishlatadimi?",
        options: [
            "Ha",
            "Yo'q",
            "Ba'zida",
            "Faqat SSR"
        ],
        answer: 0
    },
    {
        id: 14,
        category: "React",
        level: "medium",
        question: "Key prop nima uchun kerak?",
        options: [
            "Style",
            "Unique element",
            "Import",
            "Hook"
        ],
        answer: 1
    },
    {
        id: 15,
        category: "React",
        level: "medium",
        question: "State o'zgarsa nima bo'ladi?",
        options: [
            "Reload",
            "Render",
            "Exit",
            "Crash"
        ],
        answer: 1
    },
    {
        id: 16,
        category: "React",
        level: "medium",
        question: "useEffect qachon ishlaydi?",
        options: [
            "Renderdan oldin",
            "Renderdan keyin",
            "Compile vaqtida",
            "Hech qachon"
        ],
        answer: 1
    },
    {
        id: 17,
        category: "React",
        level: "medium",
        question: "useMemo nima qiladi?",
        options: [
            "Cache",
            "Loop",
            "API",
            "Render"
        ],
        answer: 0
    },
    {
        id: 18,
        category: "React",
        level: "medium",
        question: "useCallback nima qaytaradi?",
        options: [
            "Array",
            "Function",
            "Object",
            "Promise"
        ],
        answer: 1
    },
    {
        id: 19,
        category: "React",
        level: "medium",
        question: "Controlled input nima?",
        options: [
            "State orqali boshqariladi",
            "DOM boshqaradi",
            "Server boshqaradi",
            "API"
        ],
        answer: 0
    },
    {
        id: 20,
        category: "React",
        level: "hard",
        question: "Context API nima uchun?",
        options: [
            "Global state",
            "Animation",
            "Database",
            "CSS"
        ],
        answer: 0
    },
    {
        id: 21,
        category: "HTML",
        level: "easy",
        question: "HTML nimani anglatadi?",
        options: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyper Tool",
            "None"
        ],
        answer: 0
    },
    {
        id: 22,
        category: "HTML",
        level: "easy",
        question: "Eng katta heading?",
        options: [
            "h1",
            "h6",
            "header",
            "title"
        ],
        answer: 0
    },
    {
        id: 23,
        category: "HTML",
        level: "easy",
        question: "Link tegi?",
        options: [
            "link",
            "a",
            "href",
            "url"
        ],
        answer: 1
    },
    {
        id: 24,
        category: "HTML",
        level: "medium",
        question: "Semantic tag qaysi?",
        options: [
            "div",
            "section",
            "span",
            "font"
        ],
        answer: 1
    },
    {
        id: 25,
        category: "HTML",
        level: "medium",
        question: "alt atributi nima uchun?",
        options: [
            "SEO va accessibility",
            "CSS",
            "API",
            "Animation"
        ],
        answer: 0
    },
    {
        id: 26,
        category: "CSS",
        level: "easy",
        question: "Flexbox bir o'lchamlimi?",
        options: [
            "Ha",
            "Yo'q",
            "Faqat Grid",
            "None"
        ],
        answer: 0
    },
    {
        id: 27,
        category: "CSS",
        level: "easy",
        question: "Grid nechta o'lcham?",
        options: [
            "1",
            "2",
            "3",
            "4"
        ],
        answer: 1
    },
    {
        id: 28,
        category: "CSS",
        level: "medium",
        question: "position:fixed nima qiladi?",
        options: [
            "Scroll bilan yuradi",
            "Ekranga yopishadi",
            "Yo'qoladi",
            "Static"
        ],
        answer: 1
    },
    {
        id: 29,
        category: "CSS",
        level: "medium",
        question: "z-index qachon ishlaydi?",
        options: [
            "Position bo'lsa",
            "Har doim",
            "Display flex",
            "Opacity"
        ],
        answer: 0
    },
    {
        id: 30,
        category: "CSS",
        level: "medium",
        question: "display:none nima qiladi?",
        options: [
            "Yashiradi",
            "Opacity",
            "Visibility",
            "Fixed"
        ],
        answer: 0
    },
    {
        id: 31,
        category: "Git",
        question: "Git init nima qiladi?",
        options: ["Repo yaratadi", "Push qiladi", "Clone qiladi", "Merge qiladi"],
        answer: 0
    },
    {
        id: 32,
        category: "Git",
        question: "git clone nima?",
        options: ["Yangi repo", "Nusxa olish", "Delete", "Rename"],
        answer: 1
    },
    {
        id: 33,
        category: "Git",
        question: "git pull nima qiladi?",
        options: ["Update", "Delete", "Reset", "Tag"],
        answer: 0
    },
    {
        id: 34,
        category: "Git",
        question: "Branch nima?",
        options: ["Version", "Parallel development", "Folder", "Server"],
        answer: 1
    },
    {
        id: 35,
        category: "Git",
        question: "Merge nima?",
        options: ["Birlashtirish", "Delete", "Clone", "Fork"],
        answer: 0
    },
    {
        id: 36,
        category: "API",
        question: "HTTP 404 nimani bildiradi?",
        options: ["Unauthorized", "Not Found", "Success", "Conflict"],
        answer: 1
    },
    {
        id: 37,
        category: "API",
        question: "GET nima qiladi?",
        options: ["Create", "Read", "Update", "Delete"],
        answer: 1
    },
    {
        id: 38,
        category: "API",
        question: "POST nima?",
        options: ["Delete", "Update", "Create", "Read"],
        answer: 2
    },
    {
        id: 39,
        category: "API",
        question: "JSON nima?",
        options: ["Database", "Data format", "Framework", "Language"],
        answer: 1
    },
    {
        id: 40,
        category: "API",
        question: "REST nima?",
        options: ["Architecture", "Language", "Database", "Compiler"],
        answer: 0
    },
    {
        id: 41,
        category: "Performance",
        question: "Lazy Loading nima?",
        options: ["Kech yuklash", "Delete", "Cache", "SSR"],
        answer: 0
    },
    {
        id: 42,
        category: "Performance",
        question: "Code Splitting nima?",
        options: ["Bundle bo'lish", "Minify", "Compile", "Render"],
        answer: 0
    },
    {
        id: 43,
        category: "Performance",
        question: "Memoization nima?",
        options: ["Cache", "Animation", "API", "Git"],
        answer: 0
    },
    {
        id: 44,
        category: "Performance",
        question: "Image optimization nima uchun?",
        options: ["Tezlik", "Database", "CSS", "React"],
        answer: 0
    },
    {
        id: 45,
        category: "Performance",
        question: "Lighthouse nima?",
        options: ["Performance tool", "Database", "Compiler", "Editor"],
        answer: 0
    },
    {
        id: 46,
        category: "TypeScript",
        question: "TypeScript nima?",
        options: ["Superset JS", "Database", "Framework", "Compiler"],
        answer: 0
    },
    {
        id: 47,
        category: "TypeScript",
        question: "Interface nima?",
        options: ["Type definition", "API", "Database", "Component"],
        answer: 0
    },
    {
        id: 48,
        category: "TypeScript",
        question: "Enum nima?",
        options: ["Special type", "Function", "Array", "Promise"],
        answer: 0
    },
    {
        id: 49,
        category: "General",
        question: "Responsive design nima?",
        options: ["Har xil ekranlarga moslashish", "Animation", "API", "Git"],
        answer: 0
    },
    {
        id: 50,
        category: "General",
        question: "Accessibility nima?",
        options: [
            "Hamma foydalanuvchilar uchun qulaylik",
            "Database",
            "SEO",
            "Hosting"
        ],
        answer: 0
    }
];


bot.start((ctx)=>{

    const userId=ctx.from.id;

    users[userId]={
        currentQuestion:0,
        score:0
    };

    ctx.reply(
        "🖐️ Assalomu alaykum",
        Markup.inlineKeyboard([
            [Markup.button.callback("🚀 Testni boshlash","start_test")]
        ])
    );

});

bot.action("start_test",(ctx)=>{

    const userId=ctx.from.id;

    const q=frontendQuestions[0];

    ctx.reply(
`${q.question}

${q.options
.map((o,i)=>`${i+1}. ${o}`)
.join("\n")}`
    );

});

bot.launch();

console.log("🤖 Bot ishga tushdi...");