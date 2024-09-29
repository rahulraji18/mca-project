import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Country from 'App/Models/Location/Country'

export default class State extends BaseModel {
  public static table = 'states'

  @column({ isPrimary: true })
  public id: number

  @column()
  public country_id: number

  @column()
  public name: string

  @column()
  public active: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public system_created: number

  @column()
  public user_id: number

  @column()
  public user_role: number

  // Corrected relationship: A State belongs to a Country
  @belongsTo(() => Country, { localKey: 'id', foreignKey: 'country_id' })
  public country: BelongsTo<typeof Country>
}
