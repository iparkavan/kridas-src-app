const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

/**
 * Method to create create-checkout-session
 * @param {JSON} body
 * @returns
 */
const createCheckOutSession = async (body, connectionObj = null) => {
  try {
    let result = null;
    const value = body;
    const storeItems = new Map([
      [1, { priceInCents: 10000, name: "Learn React Today" }],
      [2, { priceInCents: 20000, name: "Learn CSS Today" }],
    ]);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: value.map((item) => {
        const storeItem = storeItems.get(item.id);
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.CLIENT_URL}/success.html`,
      cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
    });
    // res.json({ url: session.url });
    return (result = { url: session.url });
  } catch (error) {
    console.log("Error occurred in createCheckOutSession", error);
    throw error;
  }
};

module.exports = {
  createCheckOutSession,
};
