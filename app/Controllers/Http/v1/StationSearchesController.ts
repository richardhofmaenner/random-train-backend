import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SearchRequestValidator from 'App/Validators/SearchRequestValidator'
import Logger from '@ioc:Adonis/Core/Logger'

export default class StationSearchesController {
  public static async index({ request, response, params }: HttpContextContract) {
    const validated = await request.validate(SearchRequestValidator)
    Logger.debug(validated.term)
    return response.status(200)
  }
}
