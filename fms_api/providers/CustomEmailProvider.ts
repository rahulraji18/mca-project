import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = this.app.container.resolveBinding('Adonis/Lucid/Database')
|   const Event = this.app.container.resolveBinding('Adonis/Core/Event')
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
export default class CustomEmailProvider {
  constructor(protected app: ApplicationContract) { }

  public register() {
    // Register your own bindings
  }

  public async boot() {

    try {

      const Database = this.app.container.resolveBinding('Adonis/Lucid/Database')
      const Config = this.app.container.resolveBinding('Adonis/Core/Config')

      let email = await Database.from('settings').where('slug', 'EMAIL').first();
      if (email) {

        let content = email.content

        if (typeof content == 'object') {

        }
        else {
          content = JSON.parse(content);
        }

        Config.set('mail.from', content.username);
        Config.set('mail.name', content.title);
        Config.set('mail.mailers.smtp', {
          driver: 'smtp',
          host: content.host,
          port: content.port,
          // secure : false, // true for 465, false for other ports
          auth: {
            user: content.username,
            pass: content.password,
            // type: 'login'
          },
          tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
          },
        })
      }


    }
    catch (e) {
      // console.log(e);
    }



  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
