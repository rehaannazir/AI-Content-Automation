import json
from functools import lru_cache
from openai import OpenAI
from app.setting import get_setting
from app.logger import logger
from typing import Any, Dict

setting = get_setting()

@lru_cache
def get_client() -> OpenAI:

    api_key = setting.xai_api_key

    if not api_key:
        raise RuntimeError("X_API_KEY is not set yet")
    
    return OpenAI(
        api_key= setting.xai_api_key,
        base_url= "https://api.x.ai/v1"
    )

class GenerationService:

    Model = setting.grok_model

    @staticmethod
    def call_grok(system_prompt : str, user_prompt : str):

        client = get_client()
        response  = client.responses.create(
            model= GenerationService.Model,
            input= [
                {"role" : "system", "content" : system_prompt},
                {"role" : "user", "content" : user_prompt}
            ]
        )

        return response.output_text.strip()
    
    @staticmethod
    def parseJSON(text : str) -> Dict[str, Any]:

        cleaned = text.strip()

        if cleaned.startswith("```"):
            parts = cleaned.split("```")
            for part in parts:
                part = part.strip()
                if part.startswith("{") and part.endswith("}"):
                    cleaned = part
                    break

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError as e:
            logger.exception("Invalid JSON returned by Grok")
            raise ValueError("AI response was not valid JSON") from e

    @staticmethod
    def generate_summary(text : str) -> Dict[str, str]:

        system_prompt = "You are a content summarizer. Return only valid JSON format. Don't return any other text."

        user_prompt = f"""
    Summarize the given text into 3-4 concise sentences. Return the Json format like the below example 
    e.g.
    {{"summary" : "...."}}

    Text : {text}
    """
        raw = GenerationService.call_grok(system_prompt, user_prompt)
        data = GenerationService.parseJSON(raw)

        return {"summary" : data["summary"]}
    
    @staticmethod
    def generate_titles(text : str) -> Dict[str , list]:

        system_prompt = "You are a content title generater. Return only valid JSON format. Don't return any other text."

        user_prompt = f"""
    Generate 5 strongest titles for the given text. Return the Json format like the below example 
    e.g.
    {{"titles" : ['title_1','title_2','title_3','title_4','title_5']}}

    Text : {text}
    """
        
        raw = GenerationService.call_grok(system_prompt, user_prompt)
        data = GenerationService.parseJSON(raw)

        return {
            "titles" : data["titles"]
        }


    @staticmethod
    def generate_keywords(text : str) -> Dict[str, list]:
        
        system_prompt = "You are content keywords generator. Return only valid JSON format. Don't return anyother text"

        user_prompt = f"""
    Generate 10 SEO keywords for the following text. Return in this format
    e.g.
    {{"keywords" : ['k1','k2','k3','k4','k5','k6','k7','k8','k9','k10']}}

    Text = 
    {text}
"""
        
        raw = GenerationService.call_grok(system_prompt, user_prompt)
        data = GenerationService.parseJSON(raw)

        return {
            "keywords" : data["keywords"]
        }
    
    @staticmethod
    def generate_social_posts(text : str) -> Dict[str, str]:

        system_prompt = "You are social media posts specialist. Return only valid JSON. Don't return any other text"

        user_prompt = f"""
    Create a social media post content from the given text. Your response must be in this format:
    {{
        "linkedin" : "...",
        "instagram" : "...",
        "twitter" : "..."
    }}

    Text =
    {text}
"""

        raw = GenerationService.call_grok(system_prompt, user_prompt)
        data = GenerationService.parseJSON(raw)

        return {
            "linkedin" : data["linkedin"],
            "instagram" : data["instagram"],
            "twitter" : data["twitter"]
        }