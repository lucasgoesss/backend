/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('dishes', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('image').nullable();
        table.enu('category', ['Refeições', 'Pratos Principais', 'Sobremesas', 'Bebidas']).notNullable();
        table.decimal('price', 10, 2).notNullable();
        table.text('description').nullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('dishes');
};
