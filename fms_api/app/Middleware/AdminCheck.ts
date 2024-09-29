import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AdminCheck {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>, role: string[]) {


    var data = await auth.use('api').authenticate();

    // console.log(role);
    // console.log(data.role);
    // console.log(role.includes(String(data.role)));
    if (!role.includes(String(data.role))) {
      // if (data.role != role[0]) {
      response.unauthorized({ status: false, message: 'User do not have a permission to access this route' });
      return;
    }
    await next();
  }
}
