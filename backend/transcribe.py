import sys
import json
import whisper
import os
import shutil
import warnings
import argparse

# Suppress warnings
warnings.filterwarnings("ignore")

# Set stdout to UTF-8 to avoid encoding errors on Windows
sys.stdout.reconfigure(encoding='utf-8')

def transcribe_audio(file_path, model_name="base", language=None):
    if not shutil.which("ffmpeg"):
        print(json.dumps({"error": "FFmpeg not found. Please install FFmpeg and add it to your PATH."}))
        return

    try:
        # Load the model
        # fp16=False is important for CPU execution
        model = whisper.load_model(model_name)
        
        # Transcribe
        options = {"fp16": False}
        if language and language != "auto":
            options["language"] = language

        result = model.transcribe(file_path, **options)
        
        # Return result as JSON
        print(json.dumps(result))
    except Exception as e:
        error = {"error": str(e)}
        print(json.dumps(error))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("file_path", help="Path to the audio file")
    parser.add_argument("--model", default="base", help="Whisper model size")
    parser.add_argument("--language", default=None, help="Language code")
    
    args = parser.parse_args()
    
    if not os.path.exists(args.file_path):
        print(json.dumps({"error": f"File not found: {args.file_path}"}))
        sys.exit(1)
        
    transcribe_audio(args.file_path, args.model, args.language)
