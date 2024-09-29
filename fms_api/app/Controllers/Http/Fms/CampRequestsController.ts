// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { schema } from "@ioc:Adonis/Core/Validator";
import CustomHelper from "App/Helper/CustomHelper";
import Camprequest from "App/Models/Camprequest";  // Updated import for Camprequest
const Helper = new CustomHelper();

export default class CampRequestsController {
  // Save a new camp request
  public async save({ request, auth }) {
    try {
      // Define validation schema
      const campRequestSchema = schema.create({
        name: schema.string(),
        description: schema.string(),
        status: schema.string(),
        lat: schema.string(),
        lon: schema.string(),
        // created_by: schema.string(),
      });

      // Validate request payload
      await request.validate({ schema: campRequestSchema });

      // Get all the request data
      let payload = request.all();
      payload.created_by = auth?.user?.id;
      // Generate a random ID using your helper
      const randomId = await Helper.generateRandomId();

      // Create a new Camprequest entry
      const data = await Camprequest.create({
        ...payload,
        res_id: randomId,
      });

      return {
        status: true,
        message: "Camp request submitted successfully!",
        data: data,
      };
    } catch (error) {
      return { status: false, message: "Something went wrong!", data: error };
    }
  }

  // List camp requests with pagination, search, and filtering options
  public async list({ request }) {
    try {
      const page = request.input("page", 1);
      const limit = request.input("per_page", 20);
      const search = request.input("search", "");
      const status = request.input("status");
      const { orderBy, sortBy } = request.all();

      // Query the Camprequest with filtering options
      let data = await Camprequest.query()
        .select("*")
        .if(search, (query) => {
          query.where((query) => {
            query.where("name", "like", `%${search}%`)
              .orWhere("description", "like", `%${search}%`);
          });
        })
        .if(status, (query) => {
          query.where("status", status);
        })
        .if(orderBy && sortBy && (orderBy !== 'undefined' && sortBy !== 'undefined'), (query) => {
          query.orderBy(sortBy, orderBy);
        })
        .paginate(page, limit);

        return {
        status: true,
        message: "Camp requests listed successfully!",
        data: data,
      };
    } catch (error) {
      return { status: false, message: "Something went wrong!", data: error };
    }
  }
}
