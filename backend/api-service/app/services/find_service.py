from db.database import get_connection
from pydantic import BaseModel
from typing import Optional, List



from schemas.find_schemas import AllCards
from schemas.predict_schemas import PromptTags

from config import logger

async def get_all_cards(user_id : int) -> List[AllCards]:
    
    db = await get_connection()

    qwery= """
    SELECT id, fk_features 
    FROM requests
    WHERE fk_user = $1;
    """

    record = await db.fetch(qwery, user_id)
    logger.info(record)

    ans = []

    for requests in record:

        features_qwery = """
        SELECT prompt, height, widht, goal, tags
        FROM features
        WHERE id = $1;
        """
        features_record = await db.fetchrow(features_qwery, requests['fk_features'])

        response_qwery = """
        SELECT s3_url, rating 
        FROM response
        WHERE fk_request = $1;
        """

        response_record = await db.fetchrow(response_qwery, requests['id'])

        tmp = {
            "user_id" : user_id,
            "s3_url" : response_record['s3_url'],
            "rating" : response_record['rating'],
            "prompt" : features_record['prompt'],
            "widht" : features_record['widht'],
            "height" : features_record['height'],
            "goal" : features_record['goal'],
            "tags" : [PromptTags(tag = el ) for el in features_record['tags'].split("+")]
        }
        
        ans.append(AllCards(**tmp))

    return ans