# !pip install rembg -q

import os
from rembg import remove
from PIL import Image

def remove_bg(path_to_image):
  # if path_to_image.endswith('.png') or path_to_image.endswith('.jpg') or path_to_image.endswith('.jpeg') or path_to_image.endswith('.jpeg') or:
      output = remove(Image.open(path_to_image))
      output.save(os.path.join(f'{path_to_image.split(".")[0]}_cropped.png'))
      return output

def get_picture(prompt, num_pictures):
    standart_prompt = 'GAZPROMBANK,....'
    PROMPT = standart_prompt + prompt
    
    images, images_cropped  = [], []
    for i in range(num_pictures):
        image = pipe(prompt).images[0]
        PATH_SAVE = '/kaggle/working/' + prompt.split('.')[-1] + f'_{i}' + '.jpg'
        image.save(PATH_SAVE)
        images += [image]

        image_cropped = remove_bg(PATH_SAVE)
        images_cropped += [image_cropped]

    if num_pictures == 1:
        fig, axes = plt.subplots(nrows = num_pictures, ncols = 2)
        fig.set_size_inches(10, 10)
        fig.suptitle(prompt.split('.')[-1])
        axes[0].imshow(images[0])
        axes[0].set_title('Generated')
        axes[1].imshow(images_cropped[0])
        axes[1].set_title('Cropped')
    else:
        fig, axes = plt.subplots(nrows = num_pictures, ncols = 2)
        fig.set_size_inches(10, 10)
        fig.suptitle(prompt.split('.')[-1])
        for i in range(num_pictures):
            axes[i, 0].imshow(images[i])
            axes[i, 0].set_title('Generated')
            axes[i, 1].imshow(images_cropped[i])
            axes[i, 1].set_title('Cropped')
    plt.show()

pipe = ''
