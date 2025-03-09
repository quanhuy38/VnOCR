import cv2
import matplotlib.pyplot as plt
from super_image import EdsrModel, ImageLoader
from PIL import Image
def preprocess_image(image_path):
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return img
def show_image(img):
    plt.imshow(img, cmap='gray')
    plt.axis('off')
    plt.show()
def save_processed_image(img):
    output_path = "processed_images/processed_image.jpg"
    cv2.imwrite(output_path, img)
    return output_path

def super_resolution(img):
    model = EdsrModel.from_pretrained('eugenesiow/edsr-base', scale=2)
    pil_img = Image.fromarray(img)
    inputs = ImageLoader.load_image(pil_img)
    preds = model(inputs)

    ImageLoader.save_image(preds, 'processed_images/processed_image.jpg') 
def process_image(image_path):
    img = preprocess_image(image_path)
    super_resolution(img)
    
if __name__ == "__main__":
    image_path = "Projects/HandwritingOCR/captured_images/captured_image.jpg"
    process_image(image_path)
