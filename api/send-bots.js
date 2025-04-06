import Kahoot from "kahoot.js-updated";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const { pin, amount } = req.body;
  const N_BOTS = parseInt(amount) || 10;
  const NAME_PREFIX = "Bot_";

  if (!pin) return res.status(400).json({ error: "Missing Kahoot PIN" });

  let errors = [];
  console.log(`Iniciando bots para el PIN: ${pin}, Cantidad: ${N_BOTS}`);

  // Intentar conectar a cada bot
  for (let i = 0; i < N_BOTS; i++) {
    const client = new Kahoot();
    try {
      await client.join(pin, NAME_PREFIX + i);
      console.log(`✅ Bot ${NAME_PREFIX + i} unido al PIN ${pin}`);
    } catch (err) {
      console.log(`❌ Error al unir bot ${i}: ${err.message}`);
      errors.push(`Bot ${NAME_PREFIX + i}: ${err.message}`);
    }
  }

  if (errors.length > 0) {
    return res.status(500).json({ success: false, errors });
  }

  res.status(200).json({ success: true, count: N_BOTS });
}
