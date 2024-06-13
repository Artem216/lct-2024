from googletrans import Translator

translator = Translator()

def translator_translate(word):
    result = translator.translate(word, dest = 'en')
    return result.text