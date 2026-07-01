require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Plan amounts in cents
const PLAN_AMOUNTS = {
  professional_monthly: 39900,         // $399
  professional_annual:  382800,        // $319 × 12 = $3828
  business_monthly:     79900,         // $799
  business_annual:      766800,        // $639 × 12 = $7668
  enterprise_monthly:   120000,        // $1200
  enterprise_annual:    1152000,       // $960 × 12 = $11520
};

const PLAN_DISPLAY = {
  professional: 'UPRECRUIT Professional',
  business:     'UPRECRUIT Business',
  enterprise:   'UPRECRUIT Enterprise',
};

// POST /api/billing/create-checkout-session
exports.createCheckoutSession = async (req, res) => {
  try {
    const { plan, billingPeriod, companyName, email } = req.body;

    if (!plan || !billingPeriod || !email) {
      return res.status(400).json({ error: 'plan, billingPeriod and email are required.' });
    }

    const key    = `${plan.toLowerCase()}_${billingPeriod}`;
    const amount = PLAN_AMOUNTS[key];
    const name   = PLAN_DISPLAY[plan.toLowerCase()];

    if (!amount || !name) {
      return res.status(400).json({ error: `Invalid plan "${plan}" or billingPeriod "${billingPeriod}".` });
    }

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name,
              description: `${billingPeriod === 'annual' ? 'Annual' : 'Monthly'} plan — ${companyName || 'My Company'}`,
            },
            unit_amount: amount,
            recurring: {
              interval: billingPeriod === 'annual' ? 'year' : 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${clientUrl}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${clientUrl}/billing?cancelled=true`,
      metadata: {
        plan,
        billingPeriod,
        companyName: companyName || '',
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('[Billing] createCheckoutSession error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/billing/session/:sessionId  — confirm a completed session
exports.getSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId, {
      expand: ['subscription'],
    });
    res.json({
      status:       session.payment_status,
      customerEmail: session.customer_email,
      plan:         session.metadata?.plan,
      billingPeriod: session.metadata?.billingPeriod,
      companyName:  session.metadata?.companyName,
      subscriptionId: session.subscription?.id,
      currentPeriodEnd: session.subscription?.current_period_end,
    });
  } catch (err) {
    console.error('[Billing] getSession error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// POST /api/billing/webhook  — Stripe sends events here (use Stripe CLI locally)
exports.webhook = (req, res) => {
  const sig    = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, secret);
  } catch (err) {
    console.error('[Billing] Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      console.log(`[Billing] New subscription — ${session.customer_email} — ${session.metadata?.plan}`);
      // TODO: persist to DB, send confirmation email, provision tenant
      break;
    }
    case 'invoice.payment_succeeded':
      console.log('[Billing] Renewal payment succeeded:', event.data.object.customer_email);
      break;
    case 'customer.subscription.deleted':
      console.log('[Billing] Subscription cancelled:', event.data.object.id);
      break;
    default:
      // ignore unhandled events
  }

  res.json({ received: true });
};
