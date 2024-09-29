// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CampMember from "App/Models/CampMember";
import { schema } from "@ioc:Adonis/Core/Validator";
import CustomHelper from "App/Helper/CustomHelper";
const Helper = new CustomHelper();
const Model = CampMember
export default class CampMembersController {
    public async save({ request }) {
        try {
          const newPostSchema = schema.create({
            email: schema.string(),
            mob: schema.string(),
            situation: schema.string(),
            qrt_id: schema.string(),
            lat: schema.string(),
            lon: schema.string(),
          });
          let payload = request.all();
          // const randomId = await Helper.generateRandomId();
          const data = await Model.create({
            ...payload,
            // res_id: randomId,
          });
          await request.validate({ schema: newPostSchema });
          return {
            status: true,
            message: "Registration success!",
            data: data,
          };
        } catch (error) {
          return { status: false, message: "Something went wrong!", data: error };
        }
      }
      public async list({ request }) {
        try {
          const page = request.input("page", 1);
          const limit = request.input("per_page", 20);
          const search = request.input("search", "");
          const status = request.input("status");
          const {orderBy, sortBy} = request.all();
          let data = await Model.query()
            .select("*")
            .if(search, (query) => {
              query.where((query) => {
                query.where("situation", "like", `%${search}%`);
              });
            })
            .if(status, (query) => {
              query.where("approved", status);
            })
            .if(orderBy && sortBy && (orderBy !=='undefined' && sortBy !== 'undefined'), (query) => {
               query.orderBy(sortBy, orderBy)
            })
            .paginate(page, limit);
          return {
            status: true,
            message: "Camp member listed successfully!",
            data: data,
          };
        } catch (error) {
          return { status: false, message: "Something went wrong!", data: error };
        }
      }
}
