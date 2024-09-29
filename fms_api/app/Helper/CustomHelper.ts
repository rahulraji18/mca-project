import Encryption from '@ioc:Adonis/Core/Encryption'
import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env';
// import User from 'App/Models/User';
// import Env from '@ioc:Adonis/Core/Env'
import Config from '@ioc:Adonis/Core/Config'

export default class CustomHelper {
    static encrypt(data: Number): String {
        // const userEncryptor = Encryption.child({
        //     secret: Env.get('APP_KEY'),
        // })

        // return userEncryptor.encrypt(data);
        return Encryption.encrypt(data);
    }
    static decrypt(data): number | null {
        // const userEncryptor = Encryption.child({
        //     secret: Env.get('APP_KEY'),
        // })
        return Encryption.decrypt(data)
    }

    public async sendMail(TYPE: string, ...data: any) {

        if (TYPE == 'EMAILVERIFICATION') {

            let url = `${Env.get('FRONT_END_URL')}/user/verify?token=${data[1]}`
            Mail.send((message) => {
                message
                    // .from('', Env.get('APPNAME'))
                    // .to('assim@syntrio.in')
                    .from(Config.get('mail.from'), Config.get('mail.name'))
                    .to(data[0].email)
                    .subject(`Email Verification`)
                    // .html(`<p> Welcome ${token}</p>`)
                    .htmlView('emails/email_verification', {
                        user: data[1],
                        url: url,
                        reminder: false
                    })
            })
        }

        return;
    }

    public async calculateTotalExperience(experienceArray:[]) {
        let totalExperience = 0;
        const currentDate:any = new Date(); 
        experienceArray.forEach((experience:any) => {
          if (experience.currently_working === 1) {
          let startDate:any = new Date(experience.start_date)
            if (experience?.start_date?.includes('/')) {
                const [month, year] = experience?.start_date.split('/');
                startDate = new Date(parseInt(year), parseInt(month) - 1);
            }
            const yearsOfExperience = (currentDate - startDate) / (1000 * 60 * 60 * 24 * 365.25); // Milliseconds to years
            totalExperience += yearsOfExperience;
          } else {
            const startDate:any = new Date(experience.start_date);
            const endDate:any = new Date(experience.end_date);
            const yearsOfExperience:any = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365.25); // Milliseconds to years
            totalExperience += yearsOfExperience;
          }
        });
        return totalExperience.toFixed(1);
    }
    public async yearRangeView(experience: {start_date: any, end_date: any}) {
        let { start_date = "", end_date = "" } = experience;
        if (start_date || end_date) {
          // format start_date
          if (start_date) {
            start_date = start_date?.split("/");
            start_date = new Date(start_date[1], start_date[0] - 1);
            start_date = start_date?.getFullYear();
          } else start_date = "";
          // format end_date
          if (end_date) {
            end_date = end_date?.split("/");
            end_date = new Date(end_date[1], end_date[0] - 1);
            end_date = end_date?.getFullYear();
          } else end_date = "Present";
          // Combine start and end dates
          if (!start_date && end_date) return `${end_date}`;
          else return `${start_date}-${end_date}`;
        } else return "";
      };
      public async generateRandomId() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        
        let jobId = '#';
    
        // Generate a random uppercase letter for the second position
        jobId += characters.charAt(Math.floor(Math.random() * characters.length));
        
        // Generate a random number for the third position
        jobId += numbers.charAt(Math.floor(Math.random() * numbers.length));
    
        // Generate random numbers for the remaining positions
        for (let i = 0; i < 4; i++) {
            jobId += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }
    
        return jobId;
    };
    
      public async convertToArray (str:any) {
        try {
          return JSON.parse(str.replace(/'/g, '"'));
        } catch (error) {
          console.error('Invalid array-like string:', str);
          return [];
        }
      };
    public removeEmptyStringKeys(obj:any) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key) && obj[key] === '') {
                delete obj[key];
            }
        }
        return obj;
    }   
}