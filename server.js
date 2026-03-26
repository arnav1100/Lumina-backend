const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.ANTHROPIC_API_KEY;

app.post('/chat', async (req, res) => {
  try {
    const { messages, system, max_tokens } = req.body;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: max_tokens || 800,
        system,
        messages
      })
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.json({ text: data.content?.[0]?.text || '' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/', (req, res) => res.send('Lumina Backend Running ✓'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Lumina backend running on port ${PORT}`));
