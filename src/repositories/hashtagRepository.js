import connection from '../database/database.js';

async function getTrendingHashtags() {
  return await connection.query(
    `SELECT hashtags.name, "hashtagsPosts"."hashtagId" AS "hashtagId", COUNT("hashtagId") FROM "hashtagsPosts" JOIN hashtags ON "hashtagsPosts"."hashtagId" = hashtags.id GROUP BY "hashtagId", hashtags.name ORDER BY COUNT DESC LIMIT 10;`
  );
}

async function checkIfHashtagExists(hashtag) {
  return await connection.query(`SELECT * FROM hashtags WHERE name = ($1);`, [hashtag]);
}

async function getHashtagByName(name) {
  return await connection.query(
    `SELECT
      "p"."id" AS "id",
      "p"."url",
      "p"."content",
      json_build_object('name', "u"."name", 'email', "u"."email", 'profilePic', "u"."profilePic", 'id', "u"."id") AS "user",
      json_build_object('image', "m"."image", 'title', "m"."title", 'description', "m"."description") AS "metadata",
      ARRAY(
        SELECT
          json_build_object('name', "ul"."name", 'email', "ul"."email")
        FROM
          posts "pl"
          LEFT JOIN likes "ll" ON ll."postId" = "pl"."id"
          JOIN users "ul" ON "ul"."id" = "ll"."userId"
        WHERE "ll"."postId" = "p"."id"
        ORDER BY "ll"."createdAt" DESC
      )
      AS "usersWhoLiked",
      COALESCE ("v"."count", 0) AS "visitCount",
      ARRAY(
        SELECT
          json_build_object('id',"h_h"."id", 'name', "h_h"."name")
        FROM
          "posts" "h_p"
          JOIN "hashtagsPosts" "h_hp" ON "h_p"."id" = "h_hp"."postId"
          JOIN "hashtags" "h_h" ON "h_hp"."hashtagId" = "h_h"."id"
        WHERE "h_p"."id" = "p"."id"
      ) AS "hashtagsList"
    FROM
      hashtags JOIN "hashtagsPosts" ON hashtags.id = "hashtagsPosts"."hashtagId" 
      JOIN
      posts "p" ON "hashtagsPosts"."postId" = p.id 
      JOIN users "u" ON "p"."userId" = "u"."id"
      JOIN metadata "m" ON "p"."metadataId" = "m"."id"
      LEFT JOIN visits "v" ON "v"."postId" = "p"."id"
      WHERE hashtags.name= ($1)
    ORDER BY "p"."createdAt" DESC;`,
    [name]
  );
}

export { getTrendingHashtags, checkIfHashtagExists, getHashtagByName };
