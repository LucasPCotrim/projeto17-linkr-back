import connection from '../database/database.js';

async function getTrendingHashtags() {
  return await connection.query(
    `SELECT hashtags.name, "hashtagsPosts"."hashtagId" AS "hashtagId", COUNT("hashtagId") FROM "hashtagsPosts" JOIN hashtags ON "hashtagsPosts"."hashtagId" = hashtags.id GROUP BY "hashtagId", hashtags.name ORDER BY COUNT DESC LIMIT 10;`
  );
}

async function checkIfHashtagExists(hashtag) {
  return await connection.query(`SELECT * FROM hashtags WHERE name = ($1);`, [hashtag]);
}

async function getHashtagByName({ hashtagName, limit, offset }) {
  return connection.query(
    `SELECT "userWhoRepost", "nameUserWhoRepost", "id", "url", "content" , "user", "metadata", "usersWhoLiked", "visitCount", "hashtagsList", "createdAt" FROM(SELECT
      "p"."createdAt" AS "createdAt",
      null AS "userWhoRepost",
      null AS "nameUserWhoRepost",																																	 
        "p"."id" AS "id",
        "p"."url",
        "p"."content",
        json_build_object('name', "u"."name", 'email', "u"."email", 'profilePic', "u"."profilePic", 'id', "u"."id") AS "user",
        json_build_object('image', "m"."image", 'title', "m"."title", 'description', "m"."description") AS "metadata",
        ARRAY(
          SELECT
              json_build_object('name', "l_u"."name", 'email', "l_u"."email")
          FROM
              posts "l_p"
              LEFT JOIN likes "l_l" ON l_l."postId" = "l_p"."id"
              JOIN users "l_u" ON "l_u"."id" = "l_l"."userId"
          WHERE "l_l"."postId" = "p"."id"
          ORDER BY "l_l"."createdAt" DESC
        ) AS "usersWhoLiked",
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
      WHERE hashtags.name = $1
      UNION ALL
      SELECT
      "r"."createdAt" AS "createdAt",
      "r"."userId" AS "userWhoRepost",
      "u2".name AS "nameUserWhoRepost",
        "p"."id" AS "id",
        "p"."url",
        "p"."content",
        json_build_object('name', "u"."name", 'email', "u"."email", 'profilePic', "u"."profilePic", 'id', "u"."id") AS "user",
        json_build_object('image', "m"."image", 'title', "m"."title", 'description', "m"."description") AS "metadata",
        ARRAY(
          SELECT
              json_build_object('name', "l_u"."name", 'email', "l_u"."email")
          FROM
              posts "l_p"
              LEFT JOIN likes "l_l" ON l_l."postId" = "l_p"."id"
              JOIN users "l_u" ON "l_u"."id" = "l_l"."userId"
          WHERE "l_l"."postId" = "p"."id"
          ORDER BY "l_l"."createdAt" DESC
        ) AS "usersWhoLiked",
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
      RIGHT JOIN reposts "r" ON "r"."postId" = "p"."id"
      LEFT JOIN users "u2" ON "r"."userId" = "u2"."id"
	    WHERE hashtags.name = $1
	  )
    AS results
      ORDER BY "createdAt" DESC
      LIMIT $2
      OFFSET $3;
	`,
    [hashtagName, limit, offset]
  );
}

async function deleteOldHashtags(postId) {
  return await connection.query(`DELETE FROM "hashtagsPosts" WHERE "postId" = $1;`, [postId]);
}

export { getTrendingHashtags, checkIfHashtagExists, getHashtagByName, deleteOldHashtags };
