import cv2
import numpy as np
from fastapi import UploadFile, HTTPException
from utils.constants import MIN_IMAGE_DIMENSION, MAX_IMAGE_SIZE_BYTES

async def read_image_file(file: UploadFile) -> np.ndarray:
    """Reads an uploaded image file into a numpy array."""
    file_bytes = await file.read()
    
    if len(file_bytes) > MAX_IMAGE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="File size exceeds the 5MB limit.")
        
    np_arr = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    
    if img is None:
        raise HTTPException(status_code=400, detail="Invalid image format. Must be JPEG or PNG.")
        
    height, width = img.shape[:2]
    if height < MIN_IMAGE_DIMENSION or width < MIN_IMAGE_DIMENSION:
        raise HTTPException(status_code=400, detail=f"Image dimensions must be at least {MIN_IMAGE_DIMENSION}x{MIN_IMAGE_DIMENSION}px.")
        
    return img
