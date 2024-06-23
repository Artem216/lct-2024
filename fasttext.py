import compress_fasttext
import typing as tp
import numpy as np
import json

#!wget https://github.com/avidale/compress-fasttext/releases/download/gensim-4-draft/geowac_tokens_sg_300_5_2020-400K-100K-300.bin
fasttext = compress_fasttext.models.CompressedFastTextKeyedVectors.load('/content/geowac_tokens_sg_300_5_2020-400K-100K-300.bin')

# Эмбеддинг одного слова
def encode_word(word: str) -> np.ndarray: 
    return fasttext[word]

# Создание матрицы эмбеддингов
def stack_dict_embeddings(data_dict: tp.Dict) -> tp.Tuple[np.ndarray, tp.List[str]]:
    keys = list(data_dict.keys())
    matrix = np.stack([data_dict[key] for key in keys])
    return matrix, keys

# Вычисление косинусного расстояния
def count_similiarities(vector: np.ndarray, matrix: np.ndarray) -> tp.List[float]: 
    dot_product = np.dot(matrix, vector)
    vector_norm = np.linalg.norm(vector)
    matrix_norm = np.linalg.norm(matrix, axis = 1)
    cosine_similarities = dot_product / (vector_norm * matrix_norm)
    return cosine_similarities

our_words = list(set(['банковская карта', 'монеты', 'монетки', 'банкноты', 'стопка банкнот', 'банк', 'здание банка',
             'график', 'линия', 'диаграмма', 'столбчатая диаграмма', 'дом', 'загородный дом', 'дерево', 'зеленое дерево',
             'росток', 'растение', 'золотая монета', 'серебряная монета', 'золотые монеты', 'серебряные монеты', 'золото', 'серебро',
             'щит', 'кошка', 'собака', 'автомобиль', 'лента', 'бант', 'бантик', 'коробка', 'подарочная коробка', 'ключи от автомобиля',
             'ключи от квартиры', 'квартира', 'окно', 'дверь', "мешок денег", "мешок с монетами", "мешок с банкнотами",
             "ступенки", "многоэтажный дом", "бассейн", "пальма", "пляж", "солнце", "облако", "медведь", "руль", "сим-карта", "симка",
             "мобильный телефон", "смартфон", "часы", "наручные часы", "настенные часы", "банкомат", "стрелочка", "цветок",
             "тюльпан", "бриллиант", "подарок", "самолет", "автобус", "такси", "пакет", "пакеты для покупок", "книга", "карандаш", "шариковая ручка", 
             "ключи от дома", "планета", "планета Земля", "замок", "сейф", "громкоговоритель", "ноутбук", "руки", "семья", "люди", "мужчина", "женщина",
             "праздник", "конфетти", "пляжный зонтик", "пляжное кресло", "шезлонг", "песок", "море", "озеро", "портфель", "чемодан", "билеты на самолет", "торт",
             "пирог", "яблоко", "фрукты", "овощи", "арбуз", "ананас", "дыня", "корзина для покупок", "тележка для покупок", "сумка",
             "кисточка", "футбольный мяч", "баскетболный мяч", "мяч для тенниса", "кроссовки", "туфли", "обувь", "одежда", "воздушные шарики",
             "песочные часы", "огонь", "кофе", "чай", "стакан кофе", "кружка чая", "ваза", "ель", "шишки", "снег", "шарф", "шапка", "календарь",
             "фонарь", "дартс", "дротик для дартс", "доска для дартс", "снежинка", "новогодняя елка", "галстук", "костюм", "подушка", "шины", "колеса",
             "спидометр", "брелок", "мандарин", "кресло", "снеговик", "ламочка", "колокольчик", "калькулятор", "счеты", "круговая диаграмма", 
             "корона", "папка", "бокал вина", "бутылка вина", "бутылка шампанского", "локация", "медаль", "трубка телефона", "ракета", "рука", "кубок", 
             "кошелек", "батарейка", "торт", "робот", "олень", "доллар", "евро", "конструктор", "лупа", "свинья копилка", "скрепка", "кнопка", "смайлик", "пазл",
             "мозг", "диплом", "сертификат", "шляпа выпускника", "новогодний шар", "новогодняя ель", "молоток", "отвертка", "пляжные тапочки", "шляпа", "растение в горшке",
             "папка с документами", "экран", "компьютер", "телевизор", "будильник", "термометр", "авиабилеты", "билеты на концерт", "гитара", "скрипка", "тарелка", "вилка",
             "нож", "свеча", "праздничный колпак", "придверной коврик", "кружка", "платье"]))


def create_json_words(words: tp.List, path_json: str) -> None:
  words_embeds = {}
  for word in our_words:
    words_embeds[word] = encode_word(word).tolist()

  string = json.dumps(words_embeds)
  file = open(path_json, 'w')
  file.write(string)


def create_matrix_and_keys(path_json: str) -> tp.Tuple[np.ndarray, tp.List[str]]:
  with open(path_json, 'r') as j:
      contents = json.loads(j.read())

  matrix, keys = stack_dict_embeddings(contents)
  return matrix, keys


def get_objects(requests: tp.List[str], matrix: np.ndarray, keys: tp.List[str], num_tags: int = 3, top_k: int = 5) -> tp.Dict: # dict(str: List[str]) (request: tags)
  request_objects = {}
  for r in request:
    similarities = count_similiarities(encode_word(r), matrix)
    similarities_dict = {keys[i]: similarities[i] for i in range(len(similarities))}
    similarities_dict = dict(sorted(similarities_dict.items(), key = lambda item: item[1], reverse = True))
    top = np.array(list(similarities_dict.keys())[:top_k])
    np.random.shuffle(top)
    request_objects[r] = top[:num_tags].tolist()
  return request_objects
