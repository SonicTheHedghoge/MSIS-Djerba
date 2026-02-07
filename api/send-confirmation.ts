import { Resend } from 'resend';

// Initialize Resend with API Key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Add CORS headers to allow requests from the frontend
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, firstName, lastName, orderTotal, products, googleMapsUrl } = req.body;

    const data = await resend.emails.send({
      from: 'MSIS DJERBA <onboarding@resend.dev>', // Use verified domain in prod
      to: [email],
      subject: `Order Confirmation - #${Math.floor(Math.random() * 10000)}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1d1d1f;">Thank you, ${firstName}!</h1>
          <p>We have received your order request. One of our team members will contact you at <strong>${firstName} ${lastName}</strong> shortly to confirm delivery details.</p>
          
          <div style="background-color: #f5f5f7; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Summary</h3>
            <ul style="padding-left: 20px;">
              ${products.map((p) => `
                <li style="margin-bottom: 10px;">
                  <strong>${p.quantity}x ${p.name}</strong><br/>
                  <span style="color: #666;">${p.price} TND each</span>
                </li>
              `).join('')}
            </ul>
            <div style="border-top: 1px solid #ddd; margin-top: 10px; padding-top: 10px; font-weight: bold; font-size: 18px;">
              Total: ${orderTotal}
            </div>
          </div>

          <p><strong>Delivery Location:</strong> <a href="${googleMapsUrl}">View on Maps</a></p>
          
          <p style="font-size: 12px; color: #888; margin-top: 30px;">
            MSIS DJERBA - Corniche, Houmt Souk<br/>
            +216 75 652 793
          </p>
        </div>
      `,
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("Resend Error:", error);
    // Don't leak error details to client, but return 500
    return res.status(500).json({ error: 'Failed to send confirmation email' });
  }
}