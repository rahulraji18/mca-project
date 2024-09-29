// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { rules, schema } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";
import { DateTime } from "luxon";
import { string } from "@ioc:Adonis/Core/Helpers";
import Database from "@ioc:Adonis/Lucid/Database";
import Env from "@ioc:Adonis/Core/Env";
import Mail from "@ioc:Adonis/Addons/Mail";
import { Roles_ } from "App/Helper/Enum";
import Hash from "@ioc:Adonis/Core/Hash";
import Drive from '@ioc:Adonis/Core/Drive'
// import Config from "@ioc:Adonis/Core/Config";
export default class AuthController {
  public async login({ auth, request }) {
    try {
      const newPostSchema = schema.create({
        email: schema.string(),
        password: schema.string(),
      });
      await request.validate({ schema: newPostSchema });
      const email = request.input("email");
      const password = request.input("password");
      let user = await User.query()
        .select(
          "id",
          "name",
          "email",
          "password",
          "user_type",
          "role",
          "avatar_url"
        )
        .where("email", email)
        .where("active", 1)
        .first();
      if (!user) {
        return {
          status: false,
          message: "No User Found",
          data: null,
          email_not_verfied: false,
        };
      }
      try {
        const token = await auth.use("api").attempt(email, password);
        let data = { token: token.token, user: user };
        await User.query()
          .where("email", email)
          .update({
            last_login_at: DateTime.local().toFormat("yyyy-MM-d H:m:ss"),
          });
        return {
          status: true,
          message: "Login Success",
          data: data,
          email_not_verfied: false,
        };
      } catch {
        return {
          status: false,
          message: "Invalid Credentials",
          data: null,
          email_not_verfied: false,
        };
      }
    } catch (error) {
      return { status: false, message: "Something went wrong", data: null };
    }
  }
  public async forgot_password({ request }) {
    try {
      const newPostSchema = schema.create({
        email: schema.string(),
      });
      await request.validate({ schema: newPostSchema });
      let user = await User.query()
        .where("email", request.input("email"))
        .first();
      if (user) {
        let emailID = Env.get("TEST_MAIL") || user?.email;
        let token = string.generateRandom(99);
        await Database.table("user_verification_tokens").insert({
          user_id: user.id,
          role: user.role,
          token_type: 3,
          token: token,
          created_at: DateTime.local().toFormat("yyyy-MM-d H:m:ss"),
        });
        let url = "";
        url = `${Env.get(
          "FRONT_END_ADMIN_URL"
        )}/forgot-password?token=${token}`;
        try {
          await Mail.send((message) => {
            message
              //   .from(Config.get("mail.from"), Config.get("mail.name"))
              .from(Env.get("SMTP_USERNAME"), Env.get("APPNAME"))
              .to(emailID)
              .subject("Reset Password")
              .htmlView("emails/forgot_password", {
                user: user,
                token: url,
              });
          });
        } catch (err) {
          console.log(err);
        }

        return {
          status: true,
          message:
            "Token to reset your password has been sent to email - " +
            request.input("email"),
          data: null,
        };
      }
      return {
        status: false,
        message: "No Accounts associated with " + request.input("email"),
        data: null,
      };
    } catch (error) {
      return { status: false, message: "Something went wrong", data: error };
    }
  }
  public async register({ request }) {
    try {
      const newPostSchema = schema.create({
        email: schema.string(),
        password: schema.string(),
        mobile: schema.string(),
        name: schema.string(),
      });
      await request.validate({ schema: newPostSchema });
      const { email, password, mobile, name } = request.all();
      let user = await User.findBy("email", email);
      if (user)
        return { status: false, message: "User already exist", data: user };
      let data = await User.create({
        name: name,
        email: email,
        mob: mobile,
        password: await Hash.make(password),
        role: Roles_?.PUBLIC,
      });
      return { status: true, message: "Registration successful!", data: data };
    } catch (error) {
      return { status: false, message: "Something went wrong", data: error };
    }
  }
  public async updatePassword({ auth, request }) {
    await request.validate({
        schema: schema.create({
            password: schema.string([rules.confirmed()]),
            current_password: schema.string(),
        }),
        messages: {
            'password.required': 'Password is required',
            'current_password.required': 'Current Password is required',
            'password_confirmation.required':
                'Confirm Password is required',
            'password_confirmation.confirmed':
                'Password and confirm password must match',
        },
    })
    await auth.use('api').authenticate()

    let user = auth.use('api').user

    if (
        await Hash.verify(user.password, request.input('current_password'))
    ) {
        user.password = await Hash.make(request.input('password'))
        await user.save()

        return { status: true, message: 'Password Updated', data: null }
    }

    return {
        status: false,
        message: 'Your current password is incorrect',
        data: null,
    }
}
public async myprofile({ auth }) {
  let staff = auth.use('api').user
  return { status: true, message: 'Loading', data: staff }
}
public async updateprofile({ auth, request }) {
  await request.validate({
      schema: schema.create({
          name: schema.string(),
          // mobile: schema.string(),
          profile_image: schema.file.nullableAndOptional({
              size: '1mb',
              // extnames: ['jpg', 'jpeg', 'png', 'PNG', 'JPG', 'JPEG'],
              extnames: [
                  'jpg',
                  'gif',
                  'png',
                  'PNG',
                  'jpeg',
                  'JPG',
                  'JPEG',
              ],
          }),
      }),
      messages: {
          'name.required': '*Name is required',
          'mobile.required': '* mobile Number is required',
      },
  })
  let user = auth.use('api').user
  user.name = request.input('name') ?? user.name
  user.mob = request.input('mob') ?? user.mob

  // if (request.input('active') == 1 || request.input('active') == true || request.input('active') == '1')
  //     user.active = true
  // if (request.input('active') == 0 || request.input('active') == false || request.input('active') == '0')
  //     user.active = false

  const Image = request.file('profile_image')
  if (Image) {
      const d = new Date()
      let day = d.getDate()
      let year = d.getFullYear()
      let month = d.getMonth() + 1
      let folder = year + '/' + month + '/' + day + '/'
      await Image.moveToDisk('./profile/' + folder)

      if (user.avatar_url)
          await Drive.delete(user.avatar_url.replace('asset/', '')) // deleting old image

      user.avatar_url = `asset/profile/${folder + Image.fileName}`
  }

  await user.save()

  return {
      status: true,
      message: 'Profile Updated Successfully',
      data: user,
  }
}
public async saveUser({ request }) {
  try {
    const newPostSchema = schema.create({
      email: schema.string(),
      password: schema.string(),
      mobile: schema.string(),
      name: schema.string(),
      role: schema.string(),
    });
    await request.validate({ schema: newPostSchema });
    const { email, password, mobile, name, role } = request.all();
    let user = await User.findBy("email", email);
    if (user)
    {
     await User.query().where({email: email}).update({
      name: name,
      email: email,
      mobile: mobile,
      // password: await Hash.make(password),
     })
     let resp = await User.query().where({email: email}).first();
      return { status: true, message: "Updated successfully", data: resp };
    }
    let data = await User.create({
      name: name,
      email: email,
      mob: mobile,
      password: await Hash.make(password),
      role: role || Roles_?.PUBLIC,
    });
    return { status: true, message: "Created successfull!", data: data };
  } catch (error) {
    return { status: false, message: "Something went wrong", data: error };
  }
}
public async listUser({ request }) {
  try {
    const page = request.input("page", 1);
    const limit = request.input("per_page", 20);
    const search = request.input("search", "");
    const { orderBy, sortBy, role } = request.all();

    // Query the Camprequest with filtering options
    let data = await User.query()
      .select("*")
      .where({role: role || Roles_.PUBLIC})
      .if(search, (query) => {
          query.where("name", "like", `%${search}%`)
      })
      .if(orderBy && sortBy && (orderBy !== 'undefined' && sortBy !== 'undefined'), (query) => {
        query.orderBy(sortBy, orderBy);
      })
      .paginate(page, limit);

      return {
      status: true,
      message: "User listed successfully!",
      data: data,
    };
  } catch (error) {
    return { status: false, message: "Something went wrong!", data: error };
  }
}
}
