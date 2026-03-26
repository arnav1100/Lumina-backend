const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GROQ_API_KEY;

app.post('/chat', async (req, res) => {
  try {
    const { messages, system, max_tokens } = req.body;

    const groqMessages = [];
    if (system) groqMessages.push({ role: 'system', content: system });
    groqMessages.push(...messages);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: max_tokens || 800,
        messages: groqMessages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq API error:', JSON.stringify(data));
      return res.status(response.status).json({ error: data.error?.message || 'Groq API error' });
    }

    const text = data.choices?.[0]?.message?.content || '';
    res.json({ text });

  } catch (e) {
    console.error('Server error:', e.message);
    res.status(500).json({ error: e.message || 'Internal server error' });
  }
});

app.get('/', (req, res) => res.send('Lumina Backend Running âœ“'));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Lumina backend running on port ${PORT}`));
