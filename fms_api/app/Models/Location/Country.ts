import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import State from 'App/Models/Location/State'
export default class Country extends BaseModel {
  public static table = 'countries'

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public short_code: string
  @column()
  public phone_code: string

  @column()
  public active: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => State, { localKey: 'id', foreignKey: 'country_id', })
  public state: HasMany<typeof State>

}
