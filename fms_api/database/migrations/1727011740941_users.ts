import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      
      table.string('name').notNullable()
      table.string('email').notNullable().unique()
      table.string('mob')
      table.string('dob')
      table.integer('active').defaultTo(1)
      table.integer('role').defaultTo(0)
      table.integer('user_type').defaultTo(0)
      table.integer('created_by').defaultTo(0)
      table.string('password')
      table.string('avatar_url')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })

  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
