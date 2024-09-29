import Env from '@ioc:Adonis/Core/Env';

const stripeConfig = {
    apiKey: Env.get('STRIPE_SECRET_KEY') as string,
  }
  
  export default stripeConfig;
