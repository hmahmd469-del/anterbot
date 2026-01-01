import os
from flask import Flask, request, jsonify
import openai

app = Flask(__name__)

# إعداد العميل للتواصل مع Cerebras كأنه OpenAI
client = openai.OpenAI(
    base_url="https://api.cerebras.ai/v1",
    api_key=os.environ.get("CEREBRAS_API_KEY")
)

@app.route('/webhook', methods=['POST'])
def webhook():
    try:
        data = request.json
        # تطبيق AutoResponder يرسل الرسالة في حقل 'query'
        user_query = data.get("query", "")

        response = client.chat.completions.create(
            model="llama3.1-8b",  # أو النموذج الأقوى إذا كان متاحاً لك
            messages=[{"role": "user", "content": user_query}]
        )
        
        reply = response.choices[0].message.content
        # يجب أن يكون الرد بصيغة JSON ليفهمها التطبيق
        return jsonify({"replies": [{"message": reply}]})
    except Exception as e:
        return jsonify({"replies": [{"message": "حدثت مشكلة في السيرفر"}]}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))
