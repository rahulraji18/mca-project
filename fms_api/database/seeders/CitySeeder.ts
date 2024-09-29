import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import City from 'App/Models/Location/City'
const cities = require('../datas/cities.json');

export default class CitySeeder extends BaseSeeder {
  public async run () {
    await City.createMany(cities)
  }
}
