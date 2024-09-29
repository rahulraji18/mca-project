import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import State from 'App/Models/Location/State'
const states = require('../datas/states.json');


export default class StateSeeder extends BaseSeeder {
  public async run () {
    await State.createMany(states)
  }
}
