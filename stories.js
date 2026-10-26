// ================= CATEGORIES LIST =================
const CATEGORIES = [
    "System",
    "Action",
    "Fantasy",
    "Sci-Fi",
    "Drama",
    "Romance",
    "Dark Romance"
];

// ================= ALL STORIES DATA =================
// Nayi story ya episode add karne ke liye bas isi list mein naya block jod dein
const INITIAL_STORIES = [
    {
        id: "story_1",
        title: "Karn: The Supreme System",
        category: "System",
        plays: 15420,
        cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
        description: "Ek sadharan ladke Karn ko milta hai ek rahasyamayi Supreme System, jo uski puri zindagi aur taqat ko badal deta hai.",
        episodes: [
            {
                epNumber: 1,
                title: "Ep 1: System Awakening",
                duration: "06:12",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            },
            {
                epNumber: 2,
                title: "Ep 2: First Secret Mission",
                duration: "07:05",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
            },
            {
                epNumber: 3,
                title: "Ep 3: Level Up & Hidden Power",
                duration: "05:44",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
            }
        ]
    },
    {
        id: "story_2",
        title: "Yash & Veer: Hunter Academy",
        category: "Action",
        plays: 12890,
        cover: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80",
        description: "Dopahar ke khatarnak jungle mission mein Yash aur Veer ka samna hota hai S-Rank monsters se.",
        episodes: [
            {
                epNumber: 1,
                title: "Ep 1: Academy ka Pehla Din",
                duration: "05:30",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
            },
            {
                epNumber: 2,
                title: "Ep 2: Dopahar ka Monster Attack",
                duration: "06:15",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
            }
        ]
    },
    {
        id: "story_3",
        title: "Mayanagri ka Samrat",
        category: "Fantasy",
        plays: 9850,
        cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80",
        description: "Jaadui duniya aur shaktishali talwaro ke beech ek yoddha ki kahani.",
        episodes: [
            {
                epNumber: 1,
                title: "Ep 1: Rahasyamayi Talwar",
                duration: "06:00",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
            }
        ]
    },
    {
        id: "story_4",
        title: "Antariksh Yatri 2099",
        category: "Sci-Fi",
        plays: 7420,
        cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80",
        description: "Prithvi ke khatam hone ke baad naye grah ki khoj.",
        episodes: [
            {
                epNumber: 1,
                title: "Ep 1: Black Hole ke Paar",
                duration: "05:50",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
            }
        ]
    },
    {
        id: "story_5",
        title: "Kismat ki Baazi",
        category: "Drama",
        plays: 11200,
        cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80",
        description: "Gareebi se uthkar ek bade samrajya ko khada karne wale parivar ki kahani.",
        episodes: [
            {
                epNumber: 1,
                title: "Ep 1: Apmaan ka Badla",
                duration: "06:20",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
            }
        ]
    },
    {
        id: "story_6",
        title: "Dil Ki Dhadkan",
        category: "Romance",
        plays: 14100,
        cover: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80",
        description: "Do anjaan dilon ki college se shuru hui ek pyari prem kahani.",
        episodes: [
            {
                epNumber: 1,
                title: "Ep 1: Pehli Mulakat",
                duration: "05:10",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
            }
        ]
    },
    {
        id: "story_7",
        title: "Obsession: The Mafia King",
        category: "Dark Romance",
        plays: 18900,
        cover: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&q=80",
        description: "Khatarnak Mafia King aur uski zid ki ek dark romantic kahani.",
        episodes: [
            {
                epNumber: 1,
                title: "Ep 1:The Dangerous Deal",
                duration: "06:40",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3"
            }
        ]
    }
];
