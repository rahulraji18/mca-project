import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Country from 'App/Models/Location/Country'
const countries = require('../datas/countries.json');

export default class CountrySeeder extends BaseSeeder {
  public async run () {
    await Country.createMany(countries)
  }
}
