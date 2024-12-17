# Сервис генерации маркетинговых изображений
## Команда Каши Сиквенс МИСИС

### Ссылка на прототип в документации, так же в документации более подробное описание продукта

### Продукт 

Наш сервис обладает следующим функционалом: 
* Авторизация, 
* Регистрация, 
* Генерация изображений (с большим количеством параметров), 
* Конструктор изображений (редактор), 
* Просмотр сгенерированных изображений, 
* Просмотр изображений по категориям, 
* Просмотр Топа Изображений, 
* Панель администратора, 
* Разметка успешности/неуспешности генерации

### Ноутбуки с обучением и экспериментами

 * [Обучение LoRA](./notebooks/Обучение%20LoRA.ipynb)
 * [Эксперименты подбор модели](./notebooks/FineTuningSBv1_5_Эксперименты_Подбор_модели.ipynb)
 * [Эксперименты подбор модели Дистилляция](./notebooks/Эксперименты%20Подбор%20модели%20Дистилляция.ipynb)
 * [Генерация датасета](./notebooks/genetate-dataset.ipynb)
 * [Заполнение цветом](./notebooks/color-fill.ipynb)
 * [Форматы фотографий](./notebooks/Форматы_фотографий.ipynb)
 * [Сравнение моделей](./notebooks/model-comparison.ipynb)
# Запуск 

**Администратор:**  
Логин: `admin@admin.com`  
Пароль: `admin`  

**Тестовый пользователь:**  
Логин: `test@test.com`  
Пароль: `test`  

## Локальный запуск

1. `git clone https://github.com/Artem216/lct-2024`  
2. `cd lct-2024`  
3. `cd /backend/api-service/app`  
4. `sudo vim .env` (есть пример в `.env.example`)  
5. `cd ../../ml/app`  
6. `sudo vim .env` (есть пример в `.env.example`)  
7. `cd ../../../`  
8. Скачать веса моделей и поместить их в папку `lct-2024/backend/ml/weights`  
9. `sudo docker compose up --build -d`  

Интерфейс будет доступен по адресу: `http://localhost:5173`


<img src="./images/front_1.png" alt="Сервис" width="800">
<img src="./images/front_2.png" alt="Сервис" width="800">
<img src="./images/front_3.png" alt="Сервис" width="800">
<img src="./images/front_4.png" alt="Сервис" width="800">
<img src="./images/front_5.png" alt="Сервис" width="800">
<img src="./images/front_6.png" alt="Сервис" width="800">
<img src="./images/front_16.jpg" alt="Сервис" width="800">
<img src="./images/front_7.png" alt="Сервис" width="800">
<img src="./images/front_8.png" alt="Сервис" width="800">
<img src="./images/front_9.png" alt="Сервис" width="800">
<img src="./images/front_10.png" alt="Сервис" width="800">
<img src="./images/front_15.jpg" alt="Сервис" width="800">
<img src="./images/front.jpg" alt="Сервис" width="800">



