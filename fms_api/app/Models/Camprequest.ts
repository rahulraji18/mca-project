import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Camprequest extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public res_id: string

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public status: string


  @column()
  public lat: string

  @column()
  public lon: string

  @column()
  public created_by: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
