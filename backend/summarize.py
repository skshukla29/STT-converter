import sys
import json
import os
from openai import OpenAI
import argparse

# Fix Windows encoding
sys.stdout.reconfigure(encoding='utf-8')

def summarize_text(transcript, api_key, model="gpt-4o-mini"):
    """
    Summarize transcribed text and extract action items using OpenAI GPT.
    
    Args:
        transcript: The text to summarize
        api_key: OpenAI API key
        model: GPT model to use (default: gpt-4o-mini for cost efficiency)
    
    Returns:
        JSON with summary and action items
    """
    if not api_key:
        return {
            "error": "OpenAI API key not provided. Please set it in Settings."
        }
    
    try:
        client = OpenAI(api_key=api_key)
        
        # Prompt for summarization and action item extraction
        system_prompt = """You are an expert assistant that analyzes transcripts and provides:
1. A concise summary highlighting the key points and main topics discussed.
2. A list of action items, tasks, deadlines, or to-dos mentioned in the transcript.

Format your response as JSON with two keys:
- "summary": A paragraph summarizing the main points
- "action_items": An array of objects, each with "task" and "deadline" (if mentioned, otherwise null)

Example:
{
    "summary": "Discussion about project timeline and resource allocation...",
    "action_items": [
        {"task": "Complete design mockups", "deadline": "Friday"},
        {"task": "Review budget proposal", "deadline": null}
    ]
}

If no action items are found, return an empty array."""

        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Analyze this transcript:\n\n{transcript}"}
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        
        # Ensure the response has the expected structure
        if "summary" not in result:
            result["summary"] = "Summary could not be generated."
        if "action_items" not in result:
            result["action_items"] = []
            
        return result
        
    except Exception as e:
        return {
            "error": f"Summarization failed: {str(e)}"
        }

def main():
    parser = argparse.ArgumentParser(description='Summarize transcript using OpenAI')
    parser.add_argument('--transcript', type=str, required=True, help='Text to summarize')
    parser.add_argument('--api-key', type=str, required=True, help='OpenAI API key')
    parser.add_argument('--model', type=str, default='gpt-4o-mini', help='Model to use')
    
    args = parser.parse_args()
    
    result = summarize_text(args.transcript, args.api_key, args.model)
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main()
