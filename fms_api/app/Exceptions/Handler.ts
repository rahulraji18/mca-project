/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler';

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import { string } from '@ioc:Adonis/Core/Helpers'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract) {
    /**
     * Self handle the validation exception
     */
    if (error.code === 'E_VALIDATION_FAILURE') {
      return ctx.response.status(403).send({ status: false, message: 'Validation error', data: error.messages.errors });
      // return { status: false, message: 'Validation error', data: error.messages.errors }
    }

    if (error.code === 'E_UNAUTHORIZED_ACCESS') {
      let message = "You are not logged in";
      return ctx.response.status(401).send({ status: false, message: message, data: null });
      // return { status: false, message: message, data: null }
    }

    if (error.code === 'E_ROUTE_NOT_FOUND') {
      let message = "Route not found";
      return ctx.response.status(404).send({ status: false, message: message });
      // return { status: false, message: message, data: null }
    }


    /**
     * Forward rest of the exceptions to the parent class
     */
    return super.handle(error, ctx)
  }
}
