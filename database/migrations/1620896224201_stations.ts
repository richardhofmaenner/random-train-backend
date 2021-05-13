import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Stations extends BaseSchema {
  protected tableName = 'stations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigInteger('id').primary().unique()
      table.string('name')
      table.string('long_name')
      table.string('abbreviation')
      table.string('synonyms')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
