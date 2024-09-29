/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('dish_ingredients', (table) => {
        table.increments('id').primary();
        table.integer('dish_id').unsigned().references('id').inTable('dishes').onDelete('CASCADE');
        table.integer('ingredient_id').unsigned().references('id').inTable('ingredients').onDelete('CASCADE');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('dish_ingredients');
};
