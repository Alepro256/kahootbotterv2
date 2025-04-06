import Kahoot from "kahoot.js-updated";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { pin, amount } = req.body;
  const N_BOTS = parseInt(amount) || 10;
  const NAME_PREFIX = "Bot_";

  if (!pin) {
    return res.status(400).json({ error: "Falta el PIN del Kahoot" });
  }

  let errors = [];
  console.log(`Iniciando bots para el PIN: ${pin}, Cantidad: ${N_BOTS}`);

  // Intentamos unir cada bot al PIN
  for (let i = 0; i < N_BOTS; i++) {
    const client = new Kahoot();
    try {
      await client.join(pin, NAME_PREFIX + i);
      console.log(`✅ Bot ${NAME_PREFIX + i} unido exitosamente al PIN ${pin}`);
    } catch (err) {
      console.log(`❌ Error al unir bot ${i}: ${err.message}`);
      errors.push(`Bot ${NAME_PREFIX + i}: ${err.message}`);
    }
  }

  // Si hubo errores, devuelve un JSON con los errores
  if (errors.length > 0) {
    return res.status(500).json({ success: false, errors });
  }

  // Si no hubo errores, confirmamos el envío exitoso
  return res.status(200).json({ success: true, count: N_BOTS });
}
