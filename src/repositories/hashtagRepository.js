import connection from "../database/database.js";

async function getTrendingHashtags() {
  return await connection.query(
    `SELECT hashtags.name, "hashtagsPosts"."hashtagId" AS "hashtagId", COUNT("hashtagId") FROM "hashtagsPosts" JOIN hashtags ON "hashtagsPosts"."hashtagId" = hashtags.id GROUP BY "hashtagId", hashtags.name ORDER BY COUNT DESC LIMIT 10;`
  );
}

export { getTrendingHashtags };
