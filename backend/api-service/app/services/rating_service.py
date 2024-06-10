from db.database import get_connection

from schemas.find_schemas import TopCards

async def add_rating(response_id : int) -> TopCards:

    db = await get_connection()

    qwery= """
    UPDATE response
    SET rating = rating + 1
    WHERE id = $1
    RETURNING s3_url, rating, fk_user;
    """

    record = await db.fetchrow(qwery, response_id)

    qwery_2 = """
    SELECT name
    FROM users
    WHERE id = $1
    """

    record_2 = await db.fetchrow(qwery_2, record['fk_user'])

    ans = {
        "id" : response_id,
        "user_name" : record_2['name'],
        "s3_url" : record['s3_url'],
        "rating" : record['rating']
    }

    return TopCards(**ans)