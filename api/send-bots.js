import Kahoot from "kahoot.js-updated";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const { pin, amount } = req.body;
  const N_BOTS = parseInt(amount) || 10;
  const NAME_PREFIX = "Bot_";

  if (!pin) return res.status(400).json({ error: "Missing Kahoot PIN" });

  for (let i = 0; i < N_BOTS; i++) {
    const client = new Kahoot();
    client.join(pin, NAME_PREFIX + i).then(() => {
      console.log(`✅ Bot ${NAME_PREFIX + i} joined`);
    }).catch(err => {
      console.log(`❌ Error bot ${i}: ${err.message}`);
    });
  }

  res.status(200).json({ success: true, count: N_BOTS });
}
