import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RequestsSchema extends BaseSchema {
  protected tableName = 'camprequests'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('res_id').notNullable()
      table.string('name').notNullable()
      table.text('description')
      table.string('status').defaultTo(0)
      table.string('lat')
      table.string('lon')
      table.string('created_by').defaultTo(0)

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
