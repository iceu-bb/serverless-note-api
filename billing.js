import stripePackage from 'stripe';
import { calculateCost } from './libs/billing-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context) {
  const { storage, source } = JSON.parse(event.body);
  const amount = calculateCost(storage);
  const description = 'Scratch charge';

  // Load our secret key from the  environment variables
  const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

  try {
    await stripe.charges.create({
      source,
      amount,
      description,
      currency: 'usd'
    });
    return success({ status: true });
  } catch (e) {
    return failure({ message: e.message });
  }
}

// Inovke our function in terminal
//serverless invoke local --function billing --path mocks/billing-event.json
