export const sidebarLinks = [
    {
        imgURL: "/assets/icons/home.svg",
        route: "/",
        label: "Home",
    },
    {
        imgURL: "/assets/icons/wallpaper.svg",
        route: "/explore",
        label: "Explore",
    },
    {
        imgURL: "/assets/icons/people.svg",
        route: "/all-users",
        label: "People",
    },
    {
        imgURL: "/assets/icons/bookmark.svg",
        route: "/saved",
        label: "Saved",
    },
    {
        imgURL: "/assets/icons/gallery-add.svg",
        route: "/create-post",
        label: "Create Post",
    },
];

export const bottombarLinks = [
    {
        imgURL: "/assets/icons/home.svg",
        route: "/",
        label: "Home",
    },
    {
        imgURL: "/assets/icons/wallpaper.svg",
        route: "/explore",
        label: "Explore",
    },
    {
        imgURL: "/assets/icons/bookmark.svg",
        route: "/saved",
        label: "Saved",
    },
    {
        imgURL: "/assets/icons/gallery-add.svg",
        route: "/create-post",
        label: "Create",
    },
];

export const topbarLinks = [
    {
        imgURL: "/assets/icons/home.svg",
        route: "/",
        label: "Главная",
    },
    {
        imgURL: "/assets/icons/wallpaper.svg",
        route: "/generator",
        label: "Генератор",
    },
    {
        imgURL: "/assets/icons/wallpaper.svg",
        route: "/editor",
        label: "Конструктор",
    },
    {
        imgURL: "/assets/icons/gallery-add.svg",
        route: "/my-images",
        label: "Мои изображения",
    },
];

export const imageByCategory = [
    {
        imgURL: "/assets/money_house.png",
        color: "#FFC1A4",
        route: "/my-images",
        title: "Ипотека",
    },
    {
        imgURL: "/assets/car_percent.png",
        color: "#476BF0",
        route: "/my-images",
        title: "Автокредиты",
    },
    {
        imgURL: "/assets/card_ok.png",
        color: "#FFC1A4",
        route: "/my-images",
        title: "Кредиты",
    },
    {
        imgURL: "/assets/shield.png",
        color: "#476BF0",
        route: "/my-images",
        title: "Вклады",
    },
    {
        imgURL: "/assets/money_house.png",
        color: "#FFC1A4",
        route: "/my-images",
        title: "Ипотека",
    },
    {
        imgURL: "/assets/card_ok.png",
        color: "#FFC1A4",
        route: "/my-images",
        title: "Кредиты",
    },
    {
        imgURL: "/assets/shield.png",
        color: "#476BF0",
        route: "/my-images",
        title: "Вклады",
    },
];

export interface IConstant {
    [key: string]: string;
}


export const ChannelSelectValues: IConstant[] = [
    { 'TMO': 'Колл центр (телемеркетинг)' },
    { 'SMS': 'СМС' },
    { 'PUSH': 'Пуш в мобильном банке' },
    { 'EMAIL': 'Email' },
    { 'MOB_BANNER': 'Баннер в мобильном приложении' },
    { 'OFFICE_BANNER': 'Мессенджер в офисе' },
    { 'MOBILE_CHAT': 'Чат мобильного банка' },
    { 'KND': 'Курьер на дом' },
]

export const ProductSelectValues: IConstant[] = [
    { 'ПК': 'Классический потребительский кредит' },
    { 'TOPUP': 'Рефинансирование внутреннего ПК в Газпромбанке' },
    { 'REFIN': 'Рефинансирование внешнего ПК в другом банке' },
    { 'CC': 'Кредитная карта' },
    { 'AUTO': 'Классический автокредит' },
    { 'AUTO_SCR': 'Кредит под залог авто' },
    { 'MORTG': 'Ипотека' },
    { 'MORTG_REFIN': 'Рефинансирование ипотеки' },
    { 'MORTG_SCR': 'Кредит под залог недвижимости' },
    { 'DEPOSIT': 'Депозит' },
    { 'SAVE_ACC': 'Накопительный счет' },
    { 'DC': 'Дебетовая карта' },
    { 'PREMIUM': 'Премиальная карта' },
    { 'INVEST': 'Брокерский и инвестиционный счет' },
    { 'ISG': 'Инвестиционное страхование жизни' },
    { 'NSG': 'Накопительное страхование жизни' },
    { 'INS_LIFE': 'Страхование жизни' },
    { 'TRUST': 'Доверительное управление' },
    { 'OMS': 'Обезличенный металлический счет' },
    { 'IZP': 'Индивидуальный зарплатный проект' },
    { 'CURR_EXC': 'Обмен валюты' },
]