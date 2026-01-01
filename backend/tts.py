import sys
import json
from gtts import gTTS
import os
import argparse
import tempfile

# Fix Windows encoding
sys.stdout.reconfigure(encoding='utf-8')

def text_to_speech(text, output_path, language='en'):
    """
    Convert text to speech using Google Text-to-Speech (gTTS).
    
    Args:
        text: The text to convert to speech
        output_path: Path where the audio file will be saved
        language: Language code (default: 'en' for English)
    
    Returns:
        JSON with success status and file path
    """
    try:
        if not text or len(text.strip()) == 0:
            return {
                "error": "No text provided for TTS conversion."
            }
        
        # Create TTS object
        tts = gTTS(text=text, lang=language, slow=False)
        
        # Save to file
        tts.save(output_path)
        
        if os.path.exists(output_path):
            return {
                "success": True,
                "file_path": output_path,
                "message": "Text-to-speech conversion completed successfully."
            }
        else:
            return {
                "error": "Failed to save audio file."
            }
            
    except Exception as e:
        return {
            "error": f"TTS conversion failed: {str(e)}"
        }

def main():
    parser = argparse.ArgumentParser(description='Convert text to speech using gTTS')
    parser.add_argument('--text', type=str, required=True, help='Text to convert')
    parser.add_argument('--output', type=str, required=True, help='Output audio file path')
    parser.add_argument('--language', type=str, default='en', help='Language code (default: en)')
    
    args = parser.parse_args()
    
    result = text_to_speech(args.text, args.output, args.language)
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main()
