export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Método no permitido");
  const { topic, value } = req.body;
  if (!topic || value === undefined) return res.status(400).json({ error: "Faltan parámetros" });

  const AIO_USERNAME = process.env.AIO_USERNAME;
  const AIO_KEY = process.env.AIO_KEY;
  const url = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${topic}/data`;

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "X-AIO-Key": AIO_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value }),
    });

    if (!resp.ok) return res.status(resp.status).json({ error: await resp.text() });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
