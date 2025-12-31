const express = require('express');
const app = express();
app.use(express.json());

const API_KEY = process.env.CEREBRAS_API_KEY;

app.post('/webhook', async (req, res) => {
  const userMsg = req.body?.query?.message;
  
  if (!userMsg) {
    return res.json({
      replies: [{
        message: '✨ أهلاً بيك! رسالتك وصلت ✅\n⚡️ للاستفسار السريع: 📞 01112572656'
      }]
    });
  }

  try {
    const r = await fetch("https://api.cerebras.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-oss-120b",
        stream: false,
        max_tokens: 250,
        messages: [
          { role: "system", content: "أنت مساعد مبيعات... (السيستم برومبت كامل)" },
          { role: "user", content: userMsg }
        ]
      })
    });

    const data = await r.json();
    const answer = data?.choices?.[0]?.message?.content || 'خطأ';

    res.json({
      replies: [{ message: answer }]
    });
  } catch {
    res.json({
      replies: [{
        message: '✨ أهلاً بيك! رسالتك وصلت ✅'
      }]
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
