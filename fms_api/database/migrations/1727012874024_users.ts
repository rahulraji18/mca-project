import Hash from '@ioc:Adonis/Core/Hash'
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
     // Insert default Admin and FMT users
     await this.db
     .table(this.tableName)
     .insert([
       {
         name: 'Admin',
         email: 'admin@fms.in',
         mob: '1234567890',
         dob: '1990-01-01',
         active: 1,
         role: 1, // Admin role
         user_type: 1, // Admin user type
         created_by: 1, // Created by Admin itself
         password: await Hash.make('password'), // Encrypted password
         avatar_url: null,
         created_at: this.now(),
         updated_at: this.now(),
       },
       {
         name: 'FMT',
         email: 'fmt@fms.in',
         mob: '0987654321',
         dob: '1992-05-15',
         active: 1,
         role: 2, // FMT role
         user_type: 2, // FMT user type
         created_by: 1, // Created by Admin
         password: await Hash.make('password'), // Encrypted password
         avatar_url: null,
         created_at: this.now(),
         updated_at: this.now(),
       },
       {
         name: 'QRT',
         email: 'qrt@fms.in',
         mob: '0987654321',
         dob: '1992-05-15',
         active: 1,
         role: 3, // FMT role
         user_type: 3, // FMT user type
         created_by: 1, // Created by Admin
         password: await Hash.make('password'), // Encrypted password
         avatar_url: null,
         created_at: this.now(),
         updated_at: this.now(),
       },
       {
         name: 'Camp',
         email: 'camp@fms.in',
         mob: '0987654321',
         dob: '1992-05-15',
         active: 1,
         role: 4, // FMT role
         user_type: 4, // FMT user type
         created_by: 1, // Created by Admin
         password: await Hash.make('password'), // Encrypted password
         avatar_url: null,
         created_at: this.now(),
         updated_at: this.now(),
       },
       {
         name: 'User',
         email: 'rahulrajesh474@gmail.com',
         mob: '0987654321',
         dob: '1992-05-15',
         active: 1,
         role: 5, // FMT role
         user_type: 5, // FMT user type
         created_by: 1, // Created by Admin
         password: await Hash.make('password'), // Encrypted password
         avatar_url: null,
         created_at: this.now(),
         updated_at: this.now(),
       }
     ])
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
