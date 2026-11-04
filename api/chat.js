import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, mode } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "اكتبي رسالة أولاً" });
    }

    if (message.length > 3000) {
      return res.status(400).json({ error: "الرسالة طويلة وايد" });
    }

    const instructions = `
أنت مساعد ذكي متخصص في التوعية بالتنمر الإلكتروني لمعرض مدرسي اسمه BEHIND THE SCREEN.
تحدث باللغة العربية وبأسلوب بحريني بسيط وواضح.
كن لطيفاً ومحايداً ولا تحكم على الأشخاص من تعليق واحد.
لا تفترض أن كل تعليق سلبي هو تنمر؛ وضّح الفرق بين المزاح والإساءة والانتقاد المحترم.
لا تكرر الإهانة أكثر من اللازم، ولا تشجع الانتقام أو نشر المعلومات الشخصية.

إذا كان المطلوب تحليل تعليق:
1. حدد هل يحتوي على تنمر أو إساءة أو نقد أو لا يمكن الجزم.
2. اذكر النوع المحتمل: لفظي، تهديد، تشهير، إقصاء، انتحال شخصية، أو غيره.
3. وضّح سبب التصنيف.
4. اشرح التأثير النفسي المحتمل.
5. اقترح طريقة آمنة للتعامل معه.

إذا كان المطلوب محادثة عادية:
أجب عن السؤال مباشرة، وقدّم نصائح عملية وآمنة.
اجعل الإجابة مختصرة ومناسبة للزوار والطلاب.
`;

    const response = await client.responses.create({
      model: "gpt-5.5",
      instructions,
      input: (mode === "analyze" ? "حلل التعليق التالي:\n" : "رسالة الزائر:\n") + message
    });

    return res.status(200).json({
      reply: response.output_text || "ما قدرت أجهز إجابة، جرب مرة ثانية."
    });

  } catch (error) {
    console.error("AI error:", error);
    return res.status(500).json({
      error: "صار خطأ في الاتصال بالذكاء الاصطناعي"
    });
  }
}