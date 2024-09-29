import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'camp_members'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // Primary key

      table.string('name')
      table.string('email')
      table.string('mob')
      table.string('situation')
      table.integer('qrt_id').defaultTo(0)
      table.string('lat')
      table.string('lon')
      table.integer('created_by').defaultTo(0)

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
