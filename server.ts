import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("⚠️ Warning: GEMINI_API_KEY is not defined. AI functionality will fallback to high-fidelity mocks unless configured.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const app = express();
app.use(express.json());

const PORT = 3000;

// Programmatic SEO: Sitemap API & Sitemap XML endpoint
app.get("/sitemap.xml", (req, res) => {
  res.header("Content-Type", "application/xml");
  const baseUrl = process.env.APP_URL || "https://ai-koora-analytics.com";
  
  // Date format: YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/matches</loc>
    <lastmod>${today}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/analysis</loc>
    <lastmod>${today}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/predictions</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy</loc>
    <lastmod>2026-06-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`;
  res.send(xml);
});

// Programmatic SEO: robots.txt
app.get("/robots.txt", (req, res) => {
  const baseUrl = process.env.APP_URL || "https://ai-koora-analytics.com";
  res.header("Content-Type", "text/plain");
  res.send(`User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml`);
});

// API endpoint to generate high-fidelity tactical match analysis
app.post("/api/analysis/generate", async (req, res) => {
  const { matchDetails } = req.body;
  if (!matchDetails) {
    return res.status(400).json({ error: "Match details are required" });
  }

  const { homeTeam, awayTeam, score, stats, events, type } = matchDetails;

  const prompt = `أنت معلق ومحلل رياضي تكتيكي تعمل لصالح أكبر الصحف الرياضية العربية.
المهمة: كتابة تحليل تكتيكي عميق واحترافي باللغة العربية، غني بالمصطلحات الرياضية والتحليلية التي تجذب القراء وتجعل الموقع محبوباً ومتوافقاً مع معايير جودة المحتوى لـ Google AdSense وسهل الأرشفة في Google Search.

تفاصيل المباراة:
- الفريق المضيف: ${homeTeam}
- الفريق الضيف: ${awayTeam}
- النتيجة النهائية: ${score}
- الحالة/النوع: ${type === "live" ? "مباراة جارية حالياً (تحليل للأداء حتى الآن)" : "مباراة منتهية (تحليل شامل)"}

الإحصائيات:
- الاستحواذ: مضيف ${stats.homePossession}% - ضيف ${stats.awayPossession}%
- التسديدات على المرمى: مضيف ${stats.homeShotsOnTarget} - ضيف ${stats.awayShotsOnTarget}
- التسديدات الكلية: مضيف ${stats.homeShots} - ضيف ${stats.awayShots}
- الركنيات: مضيف ${stats.homeCorners} - ضيف ${stats.awayCorners}
- الأخطاء: مضيف ${stats.homeFouls} - ضيف ${stats.awayFouls}

الأحداث المهمة الموثقة في اللقاء:
${JSON.stringify(events)}

الرجاء إنشاء تحليل مقسم إلى العناوين التالية بطريقة سردية مشوقة وأنيقة:
1. الخلاصة التكتيكية والتحول الرئيسي في المباراة.
2. تقييم أداء المدربين والخطط المتبعة (مثال: 4-3-3 أو 4-2-3-1) وكيف تعاملوا مع مجريات اللقاء.
3. معركة خط الوسط ونقاط القوة والضعف المستغلة.
4. رجل المباراة وتأثيره التكتيكي والفردي على النتيجة.
5. النظرة والآفاق المستقبلية للفريقين في جدول الترتيب.

اكتب التحليل بأسلوب صحفي راقٍ ومقنع، لا تستخدم جملاً مكررة أو تملأ بمحتوى تافه. اجعلها جاهزة كلياً للنشر الإعلاني المفيد لجوجل أدسنس.`;

  try {
    if (!apiKey) {
      // High-quality Arab Journalist fallback description if no API key is set
      const mockAnalysis = `### الخلاصة التكتيكية للمواجهة
أظهرت قمة الليلة بين **${homeTeam}** و **${awayTeam}** تفوقاً تكتيكياً مرناً وصراعاً هجومياً شرساً في وسط الميدان. النتيجة التي استقرت عند **${score}** تعكس السيناريو المتقلب ومحاولات غلق المساحات. مع نسبة استحواذ بلغت ${stats.homePossession}% لأصحاب الأرض مقابل ${stats.awayPossession}% للضيوف، تمكن الطرف الأفضل حركياً من فرض إيقاعه في الثلث الأخير بفضل التمريرات القطرية الذكية.

### تقييم أداء المدربين والخطط التكتيكية
دخل مدرب **${homeTeam}** اللقاء بخطة كلاسيكية معتمداً على تضييق الخناق من خلال الضغط العالي بمجرد فقدان الكرة. على الجانب الآخر، فضل مدرب **${awayTeam}** التراجع المنظم والاعتماد على الكرات المرتدة السريعة مستغلاً خط الحوار الطولي للأجنحة. التغييرات المنتصفية لعبت دوراً كبيراً في تنشيط الشق الهجومي وصناعة الفارق التكتيكي.

### معركة خط الوسط ونقاط القوة والضعف
كانت دائرة المنتصف هي مسرح العمليات الأساسي والمدخل لفرض الكلمة العليا. عانى ${homeTeam} نسبياً من بطء الارتداد الدفاعي مما سمح للضيوف بالتحضير الفعّال. بينما شكّلت الركنيات والكرات العرضية المنظمة مصدر خطورة مطلق لـ ${stats.homeCorners === stats.awayCorners ? "كلا الفريقين" : stats.homeCorners > stats.awayCorners ? homeTeam : awayTeam}.

### نجم المباراة والتأثير الفردي
برز لاعب وسط الميدان بتحركه الذكي بين الخطوط وصناعة الفرص الحاسمة، مكن فريقه من الحفاظ على التوازن بين الدفاع والهجوم وتخفيف الضغط المتواصل خلال اللحظات الحرجة، مما يجعله دون منازع "رجل اللقاء الأول".

### آفاق الصراع في جدول الترتيب
هذه المواجهة تدفع بكلا الطاقمين نحو إعادة النظر في ترسانتهما الفنية؛ لتبقى التحسينات الدفاعية فرض عين في قادم الجولات لضمان البقاء في دائرة المنافسة الشرسة على الصدارة.`;
      
      return res.json({ analysis: mockAnalysis });
    }

    const ai = getGeminiClient();
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    res.json({ analysis: result.text });
  } catch (err: any) {
    console.error("Gemini Error:", err);
    res.status(500).json({ error: "Error communicating with AI services: " + err.message });
  }
});

// API endpoint to simulate and programmatically generate entire match results and events
app.post("/api/match/simulate", async (req, res) => {
  const { homeTeam, awayTeam, league } = req.body;
  if (!homeTeam || !awayTeam) {
    return res.status(400).json({ error: "Both home and away teams are required for simulation." });
  }

  const prompt = `أنت مولّد محتوى ومحاكي مباريات كرة قدم ذكي.
المهمة: محاكاة مباراة واقعية ومثيرة بين **${homeTeam}** و **${awayTeam}** في دوري أو بطولة **${league || "البطولة الكبرى"}**.
يجب أن ترجع النتيجة ككائن JSON دقيق يحتوي على معلومات المباراة الكاملة متوافقة مع واجهة المستخدم.

تنسيق الإخراج المتوقع (كجسم JSON نقي فقط وبدون أي علامات ماركداون للرمز \`\`\`json):
{
  "homeTeam": "${homeTeam}",
  "awayTeam": "${awayTeam}",
  "score": "مثال: 2 - 1",
  "homeScore": 2,
  "awayScore": 1,
  "status": "finished",
  "stadium": "اسم ملعب واقعي للفريق صاحب الأرض",
  "attendance": 54000,
  "referee": "اسم حكم واقعي معروف",
  "possessions": { "home": 54, "away": 46 },
  "stats": {
    "homePossession": 54,
    "awayPossession": 46,
    "homeShots": 14,
    "awayShots": 10,
    "homeShotsOnTarget": 7,
    "awayShotsOnTarget": 4,
    "homeCorners": 6,
    "awayCorners": 3,
    "homeFouls": 11,
    "awayFouls": 13,
    "homeYellowCards": 2,
    "awayYellowCards": 3,
    "homeRedCards": 0,
    "awayRedCards": 0
  },
  "events": [
    { "minute": 12, "type": "goal", "team": "home", "player": "اسم لاعب هداف معروف", "detail": "تسديدة قوية بيمناه سكنت الزاوية العليا" },
    { "minute": 28, "type": "card", "team": "away", "player": "اسم مدافع", "detail": "بطاقة صفراء لتدخل عنيف في منتصف الملعب" },
    { "minute": 65, "type": "goal", "team": "away", "player": "اسم نجم الضيف", "detail": "ضربة رأسية متقنة بعد ركلة ركنية" },
    { "minute": 81, "type": "goal", "team": "home", "player": "اسم بديل هجومي", "detail": "متابعة ذكية لخطأ من الحارس داخل الست ياردات" }
  ],
  "preMatchAnalysis": "تحليل تكتيكي سريع ومثير وموجز كتب خصيصاً قبل اللقاء بفقرة واحدة.",
  "aiCommentary": "تعليق نهائي حماسي للمباراة يعلق فيه الذكاء الاصطناعي على الإثارة والروح الرياضية ومستوى المدربين بفقرة واحدة مشوقة."
}`;

  try {
    if (!apiKey) {
      // Precise Mock Simulated Outcome if key is missing
      const homeScoreNum = Math.floor(Math.random() * 4);
      const awayScoreNum = Math.floor(Math.random() * 3);
      const scoreString = `${homeScoreNum} - ${awayScoreNum}`;
      
      const responseMock = {
        homeTeam,
        awayTeam,
        score: scoreString,
        homeScore: homeScoreNum,
        awayScore: awayScoreNum,
        status: "finished",
        stadium: `ملعب ${homeTeam} الرئيسي`,
        attendance: 48500 + Math.floor(Math.random() * 20000),
        referee: "جمال الغندور / حكم دولي",
        possessions: { home: 52, away: 48 },
        stats: {
          homePossession: 52,
          awayPossession: 48,
          homeShots: 13,
          awayShots: 9,
          homeShotsOnTarget: 6,
          awayShotsOnTarget: 4,
          homeCorners: 5,
          awayCorners: 4,
          homeFouls: 12,
          awayFouls: 14,
          homeYellowCards: 1,
          awayYellowCards: 2,
          homeRedCards: 0,
          awayRedCards: 0
        },
        events: [
          { minute: 23, type: "goal", team: homeScoreNum > 0 ? "home" : "away", player: homeScoreNum > 0 ? "الهداف الرئيسي الأول" : "نجم خط الهجوم للضيف", detail: "انفراد تام وتسديدة أرضية زاحفة تسكن الشباك ببراعة." },
          { minute: 41, type: "card", team: "away", player: "خط الدفاع الخلفي", detail: "بطاقة صفراء إثر ارتكاب خطأ تكتيكي لعرقلة هجمة واعدة." },
          { minute: 76, type: "goal", team: awayScoreNum > 0 ? "away" : "home", player: awayScoreNum > 0 ? "صانع الألعاب البرازيلي" : "نجم الجناح السريع", detail: "تسديدة كيرف رائعة من خارج مربع العمليات تخادع الحارس." }
        ],
        preMatchAnalysis: `لقاء كلاسيكي مثير يحظى بمتابعة جماهيرية غفيرة. صراع ناري تكتيكي مرتقب بين الخطوط الدفاعية الصلبة وقوة الأطراف المحركة للمدربين في مواجهة حاسمة لترتيب الدوري.`,
        aiCommentary: `يا لها من تسعين دقيقة حبست الأنفاس! أثبتت المباراة أن التفاصيل الصغيرة هي التي تصنع الفارق الكروي. تفوق تكتيكي تبادلي وسط تشجيع منقطع النظير ينتهي بصافرة الحكم الدولي معلناً تقاسم الروح القتالية الرائعة.`
      };
      return res.json(responseMock);
    }

    const ai = getGeminiClient();
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.8,
      }
    });

    const parsedData = JSON.parse(result.text.trim());
    res.json(parsedData);
  } catch (err: any) {
    console.error("Simulation error:", err);
    res.status(500).json({ error: "Failed to simulate match through AI: " + err.message });
  }
});

// Serve static assets from build output "dist" or configure Vite middleware in development
const isProd = process.env.NODE_ENV === "production";

if (!isProd) {
  // We'll dynamically import createServer to avoid development-only dependencies in production builds
  const { createServer } = await import("vite");
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  
  // SEO fallback for unmatched React routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`⚽ AI Koora Analytics Server running at http://0.0.0.0:${PORT}`);
});
