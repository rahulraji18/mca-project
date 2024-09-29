import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import State from 'App/Models/Location/State'
export default class City extends BaseModel {
  public static table = 'cities'

  @column({ isPrimary: true })
  public id: number

  @column()
  public state_id: number
  @column()
  public name: string

  @column()
  public active: number

  @column()
  public system_created: number


  @column()
  public user_id: number

  @column()
  public user_role: number


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => State, { localKey: 'id', foreignKey: 'state_id' })
  public state: BelongsTo<typeof State>
}
