from googletrans import Translator


translator = Translator()

def translator_translate(word):
    result = translator.translate(word, dest = 'en')
    return result.text    

while True:
    word = str(input('Введите текст для перевода или Enter: '))
    if not word:                
        break
    
    text = translator_translate(word)
    print(f'перевод: {text}\n')