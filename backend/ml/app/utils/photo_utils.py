from PIL import Image
import io

def add_image_on_background(foreground_bytes : io.BytesIO , background_color : str, position_mode : str, width : int, height : int):
    foreground = Image.open(foreground_bytes)
    
    background = Image.new('RGBA', (width, height), background_color)
    
    # Определяем координаты для размещения изображения в зависимости от режима
    if position_mode == 'megabanner':

        x = (width - foreground.width) // 2
        y = (height - foreground.height) // 2
    elif position_mode == 'ghost':

        # Изменяем размер изображения, чтобы оно соответствовало высоте фона
        new_foreground = foreground.resize((int(foreground.width * (height / foreground.height)), height), Image.LANCZOS)
        x = width - new_foreground.width
        y = 0
        foreground = new_foreground
    elif position_mode == 'nbo':

        # Изменяем размер изображения, чтобы оно соответствовало половине высоты фона
        new_foreground = foreground.resize((int(foreground.width * (height / 2 / foreground.height)), height // 2), Image.LANCZOS)
        x = width - new_foreground.width
        y = (height - new_foreground.height) // 2
        foreground = new_foreground
    else:
        raise ValueError("Invalid position_mode. Choose from 'center', 'right_full_height', 'right_half_height'.")
    
    background.paste(foreground, (x, y), foreground)

    output_bytes = io.BytesIO()
    background.save(output_bytes, 'PNG')
    output_bytes.seek(0)
    
    return output_bytes, (x, y)


if __name__ == "__main__":
    # Пример использования
    with open('path_to_foreground_image.png', 'rb') as f:
        foreground_bytes = f.read()

    background_color = (255, 255, 255, 255)  # Белый цвет
    position_mode = 'center'  # 'center', 'right_full_height' или 'right_half_height'
    width = 800
    height = 600

    output_bytes, coordinates = add_image_on_background(foreground_bytes, background_color, position_mode, width, height)
    print(f'Foreground image coordinates on the background: {coordinates}')

    # Сохранение результирующего изображения для проверки
    with open('result_image.png', 'wb') as f:
        f.write(output_bytes.read())
