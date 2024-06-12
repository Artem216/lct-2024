import cv2
import numpy as np
from PIL import Image, ImageFilter
from cv2 import dnn_superres

def denoise_image(image):
    # Проверка формата изображения и приведение к нужному формату
    if image.dtype != np.uint8:
        image = image.astype(np.uint8)
    if len(image.shape) == 2:  # Если изображение черно-белое
        image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
    return cv2.fastNlMeansDenoisingColored(image, None, 10, 10, 7, 21)

def sharpen_image(image):
    # Применение фильтра увеличения резкости
    pil_image = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    sharpened_image = pil_image.filter(ImageFilter.SHARPEN)
    return cv2.cvtColor(np.array(sharpened_image), cv2.COLOR_RGB2BGR)

# Загрузка модели FSRCNN
sr = cv2.dnn_superres.DnnSuperResImpl_create()
sr.readModel("FSRCNN_x4.pb")
sr.setModel("fsrcnn", 4)

image = cv2.imread("input.png")
denoised_image = denoise_image(image)

upscaled_image = sr.upsample(denoised_image)

sharpened_image = sharpen_image(upscaled_image)

cv2.imwrite("output.png", sharpened_image)
