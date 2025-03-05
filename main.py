#dùng: export PYTORCH_ENABLE_MPS_FALLBACK=1 trong terminal
import OCRmodel as ocr
image_path = '/Users/lequanhuy/Documents/Code/Visual Code/Projects/HandwritingOCR/captured_images/captured_image.jpg'
print(ocr.OCRing(image_path))