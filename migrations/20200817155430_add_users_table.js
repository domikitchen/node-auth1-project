
exports.up = function(knex) {
  return knex.schema
    .createTable('users', tbl => {
        tbl.increments('usersId');
        tbl.string('username', 100).notNullable().unique();
        tbl.string('email', 200).notNullable().unique();
        tbl.string('password', 200).notNullable();
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('users');
};
