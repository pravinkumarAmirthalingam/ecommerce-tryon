import argparse
import time
import cv2
import numpy as np

def main():
    parser = argparse.ArgumentParser(description="Mock CP-VTON inference script")
    parser.add_argument("--user_image", required=True, help="Path to user image")
    parser.add_argument("--cloth_image", required=True, help="Path to cloth image")
    parser.add_argument("--output_path", required=True, help="Path to output image")
    args = parser.parse_args()
    
    print(f"Loading CP-VTON model...")
    time.sleep(1)
    
    print(f"Processing {args.user_image} and {args.cloth_image}...")
    time.sleep(2)
    
    # Generate a fresh dummy image instead of copying the input
    # This guarantees the file is not corrupted and clearly shows the mock worked
    img = np.zeros((256, 192, 3), dtype=np.uint8)
    img[:] = (0, 255, 0) # Green background
    
    # Add some text to the center
    cv2.putText(img, 'AI GENERATED', (15, 128), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    
    cv2.imwrite(args.output_path, img)
    print(f"Successfully generated output at {args.output_path}")

if __name__ == "__main__":
    main()
