exports.seed = async function (knex) {
  // 000-cleanup.js already cleaned out all tables
  await knex("users")
    .truncate()
    .then(function () {
      return knex("users").insert({
        username: "admin",
        password:
          "$2a$08$CjOzAqkUXePlNyZCG6TKuubIY.MpjKqOdrV/W3178ah483kyEbeSe", // plain text password is 1234
      });
    });
};
