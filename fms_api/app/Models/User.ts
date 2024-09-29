import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import Encryption from '@ioc:Adonis/Core/Encryption'

export default class User extends BaseModel {

  public static role_type(id = 0) {

    let data = {
      1: "Admin",
      2: "Fmt",
      3: "Qrt",
      4: "Camp",
      5: "User",
    }
    if (id != 0) {
      return data[id] ?? "Unknown"
    }
    return "Unknown"
  }
  public static user_type(id = 0) {
    let data = {
      1: "Admin",
      2: "Fmt",
      3: "Qrt",
      4: "Camp",
      5: "User",
    }
    if (id != 0) {
      return data[id] ?? "Unknown"
    }
    return "Unknown"
  }


  public serializeExtras() {
    return {
      user_role: {
        name: User.role_type(this.role)
      },
      role: this.role,
      user_account_type: {
        name: User.user_type(this.user_type)
      }
    }
  }

  @column({
    isPrimary: true, serialize: (value: number) => {
      return Encryption.encrypt(value)
    }
  })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public mob: string
  
  @column()
  public dob: string

  @column()
  public active: number

  @column({ serializeAs: null })
  public role: number

  @column()
  public user_type: number

  @column()
  public created_by: number

  @column({ serializeAs: null })
  public password: string

  @column()
  public avatar_url: string

  @column.dateTime()
  public last_login_at: DateTime | null

  // @hasMany(() => Notification, { localKey: 'id', foreignKey: 'receiver_id' })
  // public notification: HasMany<typeof Notification>
}
