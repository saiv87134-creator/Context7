import React, { useState, useEffect } from "react";
import { 
  Tv, 
  Flame, 
  TrendingUp, 
  Bot, 
  Calendar, 
  Play, 
  Award, 
  Search, 
  Share2, 
  ExternalLink, 
  Shield, 
  Check, 
  MapPin, 
  Users, 
  AlertCircle, 
  Coins, 
  FileCode, 
  Sparkles, 
  RefreshCw,
  ChevronRight,
  Info,
  Clock
} from "lucide-react";
import { INITIAL_MATCHES, INITIAL_NEWS } from "./data";
import { Match, MatchEvent, NewsItem } from "./types";

export default function App() {
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [selectedMatch, setSelectedMatch] = useState<Match>(INITIAL_MATCHES[0]);
  const [activeTab, setActiveTab] = useState<'matches' | 'simulator' | 'seo-ads' | 'ai-news'>('matches');
  
  // Simulations & AI State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simHomeTeam, setSimHomeTeam] = useState("الاتحاد");
  const [simAwayTeam, setSimAwayTeam] = useState("الهلال");
  const [simLeague, setSimLeague] = useState("دوري روشن السعودي");
  
  // Tactical detailed AI Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string>("");
  const [activeMatchTab, setActiveMatchTab] = useState<'timeline' | 'stats' | 'ai-report'>('timeline');

  // AdSense & SEO Helper details
  const [showCopiedAlert, setShowCopiedAlert] = useState(false);
  const [adSenseApproved, setAdSenseApproved] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");
  const [leagueFilter, setLeagueFilter] = useState("all");

  // UTC clock ticker state
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // Keep ticking the simulated clock
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateClock();
    const interval = setInterval(updateClock, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter matches based on search and league
  const filteredMatches = matches.filter(m => {
    const matchesSearch = m.homeTeam.includes(searchFilter) || 
                          m.awayTeam.includes(searchFilter) || 
                          m.league.includes(searchFilter);
    const matchesLeague = leagueFilter === "all" || m.league.includes(leagueFilter);
    return matchesSearch && matchesLeague;
  });

  // Handle Match Simulation using server-side Gemini endpoint
  const handleSimulateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simHomeTeam.trim() || !simAwayTeam.trim()) return;
    
    setIsSimulating(true);
    try {
      const response = await fetch("/api/match/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homeTeam: simHomeTeam,
          awayTeam: simAwayTeam,
          league: simLeague
        })
      });

      if (!response.ok) throw new Error("Simulation request failed");
      const simulatedMatchData = await response.json();
      
      // Inject unique ID
      const newMatch: Match = {
        ...simulatedMatchData,
        id: "sim-" + Date.now(),
        date: "الآن مباشر",
        time: "انتهت بالذكاء الاصطناعي",
        status: "finished"
      };

      setMatches(prev => [newMatch, ...prev]);
      setSelectedMatch(newMatch);
      setActiveTab("matches");
      setActiveMatchTab("ai-report");
      setAiAnalysisResult(""); // Reset analysis to allow freshly generated analysis
      
      // Automatically generate professional commentary
      if (newMatch.aiCommentary) {
        setAiAnalysisResult(newMatch.aiCommentary);
      }
    } catch (error) {
      console.error("Error simulating match:", error);
      // Fallback local robust generation
      const mockResult: Match = {
        id: "fallback-" + Date.now(),
        homeTeam: simHomeTeam,
        awayTeam: simAwayTeam,
        league: simLeague,
        score: "3 - 2",
        homeScore: 3,
        awayScore: 2,
        status: "finished",
        stadium: `ملعب فريق ${simHomeTeam}`,
        referee: "طاقم تحكيم رقمي",
        attendance: 44250,
        stats: {
          homePossession: 55,
          awayPossession: 45,
          homeShots: 16,
          awayShots: 11,
          homeShotsOnTarget: 8,
          awayShotsOnTarget: 5,
          homeCorners: 6,
          awayCorners: 4,
          homeFouls: 10,
          awayFouls: 12,
          homeYellowCards: 1,
          awayYellowCards: 2,
          homeRedCards: 0,
          awayRedCards: 0
        },
        events: [
          { minute: 14, type: "goal", team: "home", player: "مهاجم الفريق المضيف", detail: "انطلاقة قوية وتسديدة صاروخية في الشباك" },
          { minute: 34, type: "goal", team: "away", player: "نجم الفريق الضيف", detail: "رأسية مذهلة ارتدت من العارضة وللداخل" },
          { minute: 58, type: "goal", team: "home", player: "صانع الألعاب المبدع", detail: "ضربة حرة مباشرة متقنة تخطت الحائط البشري" },
          { minute: 72, type: "card", team: "away", player: "المدافع الصلب", detail: "بطاقة صفراء لإعاقة هجوم محقق" },
          { minute: 85, type: "goal", team: "away", player: "رأس الحربة الذهبي", detail: "متابعة ذكية لضربة ركنية" },
          { minute: 89, type: "goal", team: "home", player: "المهاجم البديل", detail: "مرتدة قاتلة يترجمها بدقة عالية في الدقائق الأخيرة" }
        ],
        preMatchAnalysis: `توقعت خوارزمية السحابة الرقمية مواجهة هجومية مجنونة بين رغبة ${simHomeTeam} في الهيمنة وتوازن ${simAwayTeam} السريع للخطوط الخلفية.`,
        aiCommentary: `مباراة تكتيكية رفيعة المستوى حسمتها الفوارق الفردية المذهلة والتغييرات الجريئة من قبل المدربين في ديربي ${simLeague} المشتعل.`
      };
      setMatches(prev => [mockResult, ...prev]);
      setSelectedMatch(mockResult);
      setActiveTab("matches");
      setActiveMatchTab("ai-report");
      setAiAnalysisResult(mockResult.aiCommentary || "");
    } finally {
      setIsSimulating(false);
    }
  };

  // Generate deeper tactical analysis using backend call
  const generateTacticalAnalysis = async (match: Match) => {
    setIsAnalyzing(true);
    setAiAnalysisResult("");
    try {
      const response = await fetch("/api/analysis/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchDetails: match })
      });
      if (!response.ok) throw new Error("Analysis generation failed");
      const data = await response.json();
      setAiAnalysisResult(data.analysis);
    } catch (error) {
      console.error("Error generating analysis:", error);
      setAiAnalysisResult(`### التحليل الفوري للمباراة\nلم نتمكن من الوصول للمساعد الذكي مؤقتاً، ولكن استقراء أرقام المباراة الرسمية لـ **${match.homeTeam}** ضد **${match.awayTeam}** يوضح تفوقاً هجومياً لأصحاب الأرض بفضل الاستحواذ البالغ ${match.stats.homePossession}% وتسديد ${match.stats.homeShots} خطة منظمة.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyUrlToClipboard = () => {
    const sitemapUrl = `${window.location.origin}/sitemap.xml`;
    navigator.clipboard.writeText(sitemapUrl);
    setShowCopiedAlert(true);
    setTimeout(() => setShowCopiedAlert(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-emerald-500 selection:text-white pb-12">
      
      {/* Upper Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo & Slogan */}
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="bg-emerald-600 text-slate-950 p-2.5 rounded-xl shadow-lg ring-2 ring-emerald-400/20 flex items-center justify-center">
              <Tv className="w-6 h-6 animate-pulse text-slate-900" />
            </div>
            <div>
              <div className="flex items-center space-x-1 space-x-reverse">
                <h1 className="text-xl font-black tracking-tight text-white font-display">مُحلل كورة الـ AI</h1>
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">ذكاء فوري</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">المنصة الرياضية الذكية المتوافقة مع أرشفة جوجل وAdSense</p>
            </div>
          </div>

          {/* Time & Quick Stats */}
          <div className="hidden lg:flex items-center space-x-4 space-x-reverse text-xs border-r border-slate-850 pr-4">
            <span className="flex items-center text-slate-300">
              <Clock className="w-3.5 h-3.5 ml-1.5 text-emerald-400" />
              <span>توقيت غرينتش:</span>
              <span className="font-mono text-emerald-400 mr-1 bg-slate-950 px-2 py-1 rounded">
                {currentTime || "2026-06-13 20:00:00"}
              </span>
            </span>
            <div className="flex items-center space-x-1.5 space-x-reverse bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-bold">مباشر الآن:</span>
              <span className="font-mono font-bold">1</span>
            </div>
          </div>

          {/* Header Action Buttons for Tabs */}
          <nav className="flex space-x-1 sm:space-x-2 space-x-reverse">
            <button
              onClick={() => setActiveTab('matches')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'matches' 
                ? 'bg-emerald-600 text-slate-950 shadow-md shadow-emerald-600/10' 
                : 'text-slate-350 hover:bg-slate-800 hover:text-white'
              }`}
            >
              النتائج المباشرة
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'simulator' 
                ? 'bg-emerald-600 text-slate-950 shadow-md shadow-emerald-600/10' 
                : 'text-slate-350 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>محاكي المباريات اللحظي</span>
            </button>
            <button
              onClick={() => setActiveTab('seo-ads')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'seo-ads' 
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 shadow-md' 
                : 'text-slate-350 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Coins className="w-4 h-4 text-emerald-950" />
              <span>ربح أدسنس وأرشفة جوجل</span>
            </button>
          </nav>

        </div>
      </header>

      {/* Hero Banner with custom AdSense space placeholder for Google approval */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Mock AdSense Responsive High-Value Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 mb-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 bg-amber-500/10 border-r border-b border-amber-500/30 px-2 py-0.5 rounded-br text-[9px] font-bold text-amber-400 tracking-wider font-mono">
            مساحة إعلانية متوافقة مع GOOGLE ADSENSE CODE
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="p-3 bg-amber-500/15 rounded-xl border border-amber-500/20 text-amber-400 flex-shrink-0">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">موقعك مهيأ تقنياً وعضوياً للربح من الإعلانات</h4>
                <p className="text-xs text-slate-400 mt-1">توليد المحتوى الحصري بالطلب يزيد من سرعة القبول في AdSense ويزيد من الزيارات اليومية لمحركات البحث.</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800">حجم تلقائي متجاوب (Responsive Ad Block)</span>
              <button 
                onClick={() => setActiveTab('seo-ads')}
                className="bg-slate-800 hover:bg-slate-700 text-xs text-amber-400 font-bold px-3 py-1.5 rounded-lg border border-amber-500/30 transition-all flex items-center gap-1"
              >
                <span>طريقة التفعيل</span>
                <ChevronRight className="w-3.5 h-3.5 rotate-180" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Layout Grid */}
        {activeTab === 'matches' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Right Side: Matches List & Live Scoring Filters (4 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Filter controls */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-emerald-400" />
                    <span>مباريات وجداول اليوم</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">نتائج مباشرة محدثة تلقائياً</span>
                </div>

                <div className="space-y-3">
                  {/* Search component */}
                  <div className="relative">
                    <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="ابحث عن فريق، دوري أو مباراة..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pr-9 pl-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* League custom Quick Pill selectors */}
                  <div className="flex flex-wrap gap-1">
                    {[
                      { key: "all", label: "الكل" },
                      { key: "دوري روشن", label: "روشن 🇸🇦" },
                      { key: "إسباني", label: "الأسباني 🇪🇸" },
                      { key: "إنجليزي", label: "الدوري الإنجليزي 🇬🇧" },
                      { key: "مصري", label: "الدوري المصري 🇪🇬" },
                    ].map((btn) => (
                      <button
                        key={btn.key}
                        onClick={() => setLeagueFilter(btn.key)}
                        className={`text-[11px] px-2.5 py-1 rounded-md transition-all ${
                          leagueFilter === btn.key 
                          ? 'bg-slate-800 text-emerald-400 border border-emerald-500/35 font-bold' 
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Match Feed Cards */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {filteredMatches.length === 0 ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
                    <AlertCircle className="w-8 h-8 text-slate-550 mx-auto mb-2" />
                    <span>لم يتم العثور على مباريات تطابق هذا البحث حالياً. جرب كتابة اسم فريق آخر أو اضغط على محاكي المباريات!</span>
                  </div>
                ) : (
                  filteredMatches.map((m) => {
                    const isSelected = selectedMatch.id === m.id;
                    const isLive = m.status === 'live';
                    return (
                      <div
                        key={m.id}
                        onClick={() => {
                          setSelectedMatch(m);
                          setAiAnalysisResult(""); // Reset analysis to allow new generation for selected match
                        }}
                        className={`p-4 rounded-xl cursor-pointer transition-all ${
                          isSelected 
                          ? 'bg-slate-850/90 border-2 border-emerald-500/80' 
                          : 'bg-slate-900 hover:bg-slate-850 border border-slate-800/80'
                        }`}
                      >
                        {/* League Header */}
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[11px] bg-slate-950 px-2 py-0.5 rounded text-slate-400 font-bold border border-slate-850">
                            {m.league}
                          </span>
                          {isLive ? (
                            <span className="flex items-center space-x-1 space-x-reverse bg-red-500/10 text-red-500 border border-red-500/25 text-[10px] px-2 py-0.5 rounded-full font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-live"></span>
                              <span>الشوط الثاني {m.minute}'</span>
                            </span>
                          ) : m.status === 'finished' ? (
                            <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-emerald-400 font-bold border border-emerald-500/20">
                              منتهية
                            </span>
                          ) : (
                            <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-blue-400 font-bold border border-blue-500/20">
                              {m.time}
                            </span>
                          )}
                        </div>

                        {/* Teams & Goals */}
                        <div className="grid grid-cols-7 items-center text-center">
                          {/* Home team */}
                          <div className="col-span-3 text-right">
                            <span className="text-xs sm:text-sm font-bold text-slate-100 block truncate">{m.homeTeam}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">مستضيف</span>
                          </div>

                          {/* Score Board */}
                          <div className="col-span-1 flex flex-col justify-center items-center">
                            <span className="font-mono text-base font-black px-2 py-1 rounded bg-slate-950 border border-slate-800 text-emerald-400">
                              {m.score}
                            </span>
                          </div>

                          {/* Away team */}
                          <div className="col-span-3 text-left">
                            <span className="text-xs sm:text-sm font-bold text-slate-100 block truncate">{m.awayTeam}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">ضيف</span>
                          </div>
                        </div>

                        {/* Quick dynamic mini features */}
                        {m.aiCommentary && (
                          <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-start gap-1">
                            <Bot className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <p className="text-[11px] text-slate-400 line-clamp-1 italic">{m.aiCommentary}</p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Informative widget for user: AI Commentary Generation */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">النتائج اللحظية والتحليل التلقائي</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      يتم تفعيل محاكي المباراة التكتيكي لإرسال البيانات إلى محرك Gemini ومحاكاة الأحداث الكروية الواقعية فوراً وبدقة.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('simulator')}
                  className="w-full bg-slate-950 hover:bg-slate-850 text-xs text-slate-300 font-bold py-2 rounded-lg border border-slate-800 transition-all text-center block"
                >
                  افتح لوحة المحاكاة التوليدية ⚡
                </button>
              </div>

            </div>

            {/* Left Side: Live Stats Details, Match Timeline, and Gemini Match Analysis (7 Cols) */}
            <div className="lg:col-span-7">
              
              {/* Detailed Match Block Overview */}
              <div className="bg-slate-900 rounded-2xl border border-slate-850 overflow-hidden relative shadow-2xl">
                
                {/* Visual Cover Header */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950 z-0" />
                <div className="h-28 bg-[url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=40')] bg-cover bg-center" />

                {/* Match Information overlay */}
                <div className="relative z-10 px-6 -mt-14 pb-6 border-b border-slate-800">
                  <div className="flex justify-between items-end mb-4">
                    <div className="bg-emerald-600/90 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wide">
                      {selectedMatch.league}
                    </div>
                    {selectedMatch.stadium && (
                      <span className="text-xs text-slate-300 flex items-center gap-1 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-800">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>{selectedMatch.stadium}</span>
                      </span>
                    )}
                  </div>

                  {/* High Fidelity Score Board */}
                  <div className="grid grid-cols-9 items-center text-center mt-3">
                    
                    {/* Home Side */}
                    <div className="col-span-3 flex flex-col items-center">
                      <div className="w-14 h-14 bg-slate-800 border-2 border-slate-700 rounded-2xl flex items-center justify-center font-bold text-white text-xl shadow-inner mb-2 select-none">
                        {selectedMatch.homeTeam.substring(0, 2)}
                      </div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-100">{selectedMatch.homeTeam}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">الفريق المضيف</p>
                    </div>

                    {/* Results / Time middle panel */}
                    <div className="col-span-3 flex flex-col justify-center items-center">
                      <span className="text-[11px] text-slate-400 font-semibold mb-2 bg-slate-950 px-2 py-0.5 rounded">
                        {selectedMatch.status === 'live' ? "الشوط الثاني جاري" : "النتيجة النهائية"}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-3xl font-black text-white leading-none">
                          {selectedMatch.homeScore}
                        </span>
                        <span className="text-slate-650 font-mono text-xl animate-pulse font-bold">-</span>
                        <span className="font-mono text-3xl font-black text-white leading-none">
                          {selectedMatch.awayScore}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-[11px]">
                        {selectedMatch.status === 'live' ? (
                          <span className="bg-red-500/15 text-red-500 font-mono font-bold px-2 py-0.5 rounded border border-red-500/10">
                            +74'
                          </span>
                        ) : (
                          <span className="bg-emerald-500/10 text-emerald-400 font-mono font-bold px-2.5 py-0.5 rounded border border-emerald-500/20">
                            انتهت المواجهة
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Away Side */}
                    <div className="col-span-3 flex flex-col items-center">
                      <div className="w-14 h-14 bg-slate-800 border-2 border-slate-700 rounded-2xl flex items-center justify-center font-bold text-white text-xl shadow-inner mb-2 select-none">
                        {selectedMatch.awayTeam.substring(0, 2)}
                      </div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-100">{selectedMatch.awayTeam}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">الفريق الضيف</p>
                    </div>

                  </div>
                </div>

                {/* Sub-Tabs Selector inside single-view Match detail */}
                <div className="bg-slate-950 p-2 flex border-b border-slate-850">
                  <button
                    onClick={() => setActiveMatchTab('timeline')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      activeMatchTab === 'timeline' 
                      ? 'bg-slate-900 text-emerald-400 border border-slate-800' 
                      : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    شريط الأحداث المباشرة (Goal Feed)
                  </button>
                  <button
                    onClick={() => setActiveMatchTab('stats')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      activeMatchTab === 'stats' 
                      ? 'bg-slate-900 text-emerald-400 border border-slate-800' 
                      : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    أرقام وإحصائيات الاستحواذ
                  </button>
                  <button
                    onClick={() => setActiveMatchTab('ai-report')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 text-emerald-400 ${
                      activeMatchTab === 'ai-report' 
                      ? 'bg-slate-900 text-emerald-400 border border-slate-800' 
                      : 'text-emerald-500 hover:text-emerald-400'
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5 animate-bounce" />
                    <span>تقرير التكتيك بالذكاء الاصطناعي (AdSense)</span>
                  </button>
                </div>

                {/* Tab content 1: Timeline of Events */}
                <div className="p-6">
                  {activeMatchTab === 'timeline' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">أحداث اللقاء الرسمية</h4>
                        <span className="text-[10px] text-slate-500">محدثة بواسطة AI Stream</span>
                      </div>

                      {selectedMatch.events.length === 0 ? (
                        <div className="text-center py-10">
                          <AlertCircle className="w-10 h-10 text-slate-700 mx-auto mb-2" />
                          <p className="text-xs text-slate-400">لا توجد أحداث مسجلة بعد لهذه المباراة المجدولة.</p>
                          <p className="text-[11px] text-slate-500 mt-1">انقر على "محاكي المباريات" في الأعلى لمحاكاة اللقاء فورا بالذكاء الاصطناعي وتوليد الإحصائيات.</p>
                        </div>
                      ) : (
                        <div className="relative border-r-2 border-slate-800 mr-3 pr-6 space-y-6">
                          {selectedMatch.events.map((ev, idx) => (
                            <div key={idx} className="relative">
                              {/* Icon marker */}
                              <span className={`absolute -right-9 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                                ev.type === 'goal' 
                                ? 'bg-emerald-950 text-emerald-400 border-emerald-500' 
                                : ev.type === 'card' && ev.player.includes('حمراء')
                                ? 'bg-red-950 text-red-500 border-red-500'
                                : 'bg-amber-950 text-amber-500 border-amber-500'
                              }`}>
                                {ev.type === 'goal' ? '⚽' : '🟨'}
                              </span>

                              <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-850">
                                <div className="flex justify-between items-start mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-slate-200">{ev.player}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                      ev.team === 'home' ? 'bg-slate-900 text-slate-350' : 'bg-slate-900 text-emerald-400'
                                    }`}>
                                      {ev.team === 'home' ? selectedMatch.homeTeam : selectedMatch.awayTeam}
                                    </span>
                                  </div>
                                  <span className="text-xs font-mono font-bold text-emerald-400">{ev.minute}'</span>
                                </div>
                                {ev.detail && <p className="text-xs text-slate-400 mt-1">{ev.detail}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab content 2: Statistics with Custom Visual Bars */}
                  {activeMatchTab === 'stats' && (
                    <div className="space-y-5">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">إحصائيات الأداء الدقيقة</h4>
                        <span className="text-[10px] text-slate-500">حسابات حركية فورية</span>
                      </div>

                      {/* Possession Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span>{selectedMatch.stats.homePossession}%</span>
                          <span className="text-slate-400">الاستحواذ الكلي على الكرة</span>
                          <span>{selectedMatch.stats.awayPossession}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-3 rounded-full flex overflow-hidden border border-slate-850">
                          <div 
                            className="bg-emerald-500 transition-all duration-500" 
                            style={{ width: `${selectedMatch.stats.homePossession}%` }}
                          />
                          <div 
                            className="bg-slate-700 transition-all duration-500" 
                            style={{ width: `${selectedMatch.stats.awayPossession}%` }}
                          />
                        </div>
                      </div>

                      {/* Stat Rows Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {[
                          { title: "التسديدات الكلية", home: selectedMatch.stats.homeShots, away: selectedMatch.stats.awayShots },
                          { title: "التسديدات على المرمى", home: selectedMatch.stats.homeShotsOnTarget, away: selectedMatch.stats.awayShotsOnTarget },
                          { title: "الضربات الركنية", home: selectedMatch.stats.homeCorners, away: selectedMatch.stats.awayCorners },
                          { title: "الأخطاء المرتكبة", home: selectedMatch.stats.homeFouls, away: selectedMatch.stats.awayFouls },
                          { title: "البطاقات الملونة الصفراء", home: selectedMatch.stats.homeYellowCards, away: selectedMatch.stats.awayYellowCards },
                          { title: "البطاقات الملونة الحمراء", home: selectedMatch.stats.homeRedCards, away: selectedMatch.stats.awayRedCards },
                        ].map((stat, idx) => {
                          const total = (stat.home + stat.away) || 1;
                          const homePct = (stat.home / total) * 100;
                          return (
                            <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                              <span className="text-[11px] text-slate-400 font-bold block mb-2 text-center">{stat.title}</span>
                              <div className="grid grid-cols-5 items-center text-center">
                                <span className="text-xs font-mono font-bold text-slate-200">{stat.home}</span>
                                <div className="col-span-3 px-2">
                                  <div className="w-full bg-slate-900 h-1.5 rounded-full flex overflow-hidden">
                                    <div className="bg-emerald-500 h-full" style={{ width: `${homePct}%` }}></div>
                                  </div>
                                </div>
                                <span className="text-xs font-mono font-bold text-emerald-400">{stat.away}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {selectedMatch.referee && (
                        <div className="mt-4 pt-4 border-t border-slate-855 text-center flex justify-around text-xs text-slate-450 text-slate-400">
                          <span>👤 حكم المباراة: <strong>{selectedMatch.referee}</strong></span>
                          <span>🏟️ الحضور الجماهيري: <strong>{selectedMatch.attendance?.toLocaleString() || "غير معروف"} مشجع</strong></span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab content 3: AI Report Generator (AdSense SEO secret weapon) */}
                  {activeMatchTab === 'ai-report' && (
                    <div className="space-y-4">
                      
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-855">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-3">
                          <div>
                            <span className="bg-emerald-500/15 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20 block w-max">
                              تحليل مدعوم بـ Gemini 3.5 Flash
                            </span>
                            <h4 className="text-xs font-bold text-slate-200 mt-1">التقرير التكتيكي التفصيلي الفوري</h4>
                          </div>
                          
                          <button
                            onClick={() => generateTacticalAnalysis(selectedMatch)}
                            disabled={isAnalyzing}
                            className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 transition-all w-full md:w-auto justify-center"
                          >
                            {isAnalyzing ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>جاري توليد التقرير التكتيكي...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>توليد تحليل تكتيكي عميق ⚡</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          هذه الأداة تولّد مقالاً تكتيكياً احترافياً بالكامل بناءً على مجريات المباراة وإعدادات المدربين والخطط. المقالات مجهّزة تقنياً لتكون متوافقة مع شروط محتوى Google AdSense وتجذب قراء جوجل العضويين.
                        </p>
                      </div>

                      {/* Display generated AI Content */}
                      {aiAnalysisResult ? (
                        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 prose prose-invert prose-emerald max-w-none text-right">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Bot className="w-4 h-4 text-emerald-400" />
                              <span>التقرير معتمد رياضياً ونوعياً</span>
                            </span>
                            <span className="text-[10px] text-slate-500">جاهز للأرشفة والنشر</span>
                          </div>
                          <div className="text-xs text-slate-300 leading-relaxed space-y-4 whitespace-pre-line">
                            {aiAnalysisResult}
                          </div>

                          {/* AdSense Placement Inner-Article */}
                          <div className="bg-slate-900 border border-emerald-500/10 p-3.5 rounded-lg text-center mt-5">
                            <span className="text-[9px] text-amber-400 block mb-1 font-mono uppercase">إعلان مفضل داخل المقال (AdSense In-Article Template)</span>
                            <div className="bg-slate-950 py-4 px-2 rounded text-slate-500 text-[11.5px] italic border border-slate-850">
                              (ضع رمز إعلانات AdSense التلقائية للظهور هنا لتحسين الأرباح بناءً على نقرات المحللين)
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-950/60 rounded-xl p-8 border border-slate-850 text-center text-slate-450">
                          <Bot className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                          <p className="text-xs text-slate-400">لم يتم توليد التحليل التكتيكي لهذه المواجهة بعد.</p>
                          <p className="text-[11px] text-slate-500 mt-1">اضغط على زر <strong>"توليد تحليل تكتيكي عميق ⚡"</strong> أعلاه لكتابة وتصدير التحليل تلقائياً.</p>
                        </div>
                      )}

                    </div>
                  )}

                </div>

              </div>
              
              {/* Extra Live News Items Section - Good for AdSense Content Volume */}
              <div className="mt-6 bg-slate-900 p-5 rounded-2xl border border-slate-850">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-300 text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>آخر التقارير وعلوم البيانات المكتوبة بالذكاء الاصطناعي</span>
                  </h3>
                  <span className="text-[10px] text-slate-500">محتوى غني للأرشفة السريعة</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {news.map((item) => (
                    <div key={item.id} className="bg-slate-950/80 p-3 rounded-xl border border-slate-850 flex flex-col justify-between hover:border-slate-800 transition-all">
                      <div>
                        {item.teamTag && (
                          <span className="text-[9px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded font-mono">
                            {item.teamTag}
                          </span>
                        )}
                        <h4 className="text-xs font-bold text-slate-200 mt-2 line-clamp-2 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-[10.5px] text-slate-450 text-slate-450 mt-1.5 line-clamp-3">
                          {item.summary}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-850 flex items-center justify-between text-[10px] text-slate-500">
                        <span>{item.date}</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                          <Bot className="w-3 h-3" />
                          <span>تحليل AI</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Dynamic Interactive Matches Simulator View */}
        {activeTab === 'simulator' && (
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl max-w-4xl mx-auto">
            <div className="flex items-center space-x-3 space-x-reverse mb-6 border-b border-slate-800 pb-4">
              <div className="p-3 bg-emerald-600/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <Bot className="w-6 h-6 animate-pulse text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-display">محاكاة المباريات الفورية واللحظية بالذكاء الاصطناعي</h2>
                <p className="text-xs text-slate-400 mt-0.5">اكتب أي فريقين في عالم كرة القدم، وسيتولى الذكاء الاصطناعي توليد تفاصيل المواجهة فورياً بالأحداث والأهداف والتقارير</p>
              </div>
            </div>

            <form onSubmit={handleSimulateMatch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                
                {/* Home Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">اسم الفريق المضيف (الأول)</label>
                  <input
                    type="text"
                    value={simHomeTeam}
                    onChange={(e) => setSimHomeTeam(e.target.value)}
                    placeholder="مثال: الاتحاد، الهلال، ريال مدريد"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-right"
                    required
                  />
                  <span className="text-[10px] text-slate-500 block">الأرض وتأثير الجماهير في صالحه</span>
                </div>

                {/* VS Connector with League */}
                <div className="space-y-4 text-center">
                  <span className="inline-block text-slate-300 font-black text-xl bg-slate-950 py-1.5 px-4 rounded-full border border-slate-850">
                    ضد (VS)
                  </span>
                  
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-450 text-slate-400 block">البطولة أو الدوري</label>
                    <input
                      type="text"
                      value={simLeague}
                      onChange={(e) => setSimLeague(e.target.value)}
                      placeholder="مثال: دوري أبطال أوروبا، الدوري الإنجليزي"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 text-center focus:outline-none"
                    />
                  </div>
                </div>

                {/* Away Input */}
                <div className="space-y-2 text-left md:text-right">
                  <label className="text-xs font-bold text-slate-300 block">اسم الفريق الضيف (الثاني)</label>
                  <input
                    type="text"
                    value={simAwayTeam}
                    onChange={(e) => setSimAwayTeam(e.target.value)}
                    placeholder="مثال: النصر، برشلونة، ليفربول"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-right"
                    required
                  />
                  <span className="text-[10px] text-slate-500 block">تحت وطأة الضيوف وضغط الهجمات</span>
                </div>

              </div>

              {/* Advanced metrics explanation block for Adsense optimization */}
              <div className="bg-slate-955 bg-slate-950 p-4 rounded-xl border border-slate-850 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>مخرجات اللقاء التوليدية</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    سيقوم محرك الذكاء الاصطناعي بكتابة وتشكيل نتيجة المباراة بدقة بناءً على جودة الأسماء، توليد خط زمني بالدقائق الدقيقة لتسجيل الأهداف، والبطاقات الملونة إثر التدخلات الخشنة وتوفير ملخص نهائي سريع.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>مزايا الأرشفة السريعة</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    كل نتيجة يتم محاكاتها تعزز من مخزون الكلمات المفتاحية في موقعك، مما يجعل روبوتات جوجل (Googlebot) تزحف وتؤرشف الصفحات باسم الفريقين بأقصى سرعة في نتائج البحث الفورية.
                  </p>
                </div>
              </div>

              {/* Submit Trigger Action Button */}
              <div className="text-center pt-2">
                <button
                  type="submit"
                  disabled={isSimulating}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-550 text-slate-950 font-black text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-emerald-650/15 transition-all inline-flex items-center gap-2"
                >
                  {isSimulating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>جاري المحاكاة بالذكاء الاصطناعي وصياغة النتيجة فوراً...</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-4.5 h-4.5 text-slate-950" />
                      <span>صافرة البداية: ابدأ المحاكاة التوليدية 🚀</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* AdSense Approval & SEO Integration Guide Center */}
        {activeTab === 'seo-ads' && (
          <div className="space-y-6">
            
            {/* SEO Overview Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                  <FileCode className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-display">أرشفة محركات بحث جوجل (Google Search Index) السريعة</h2>
                  <p className="text-xs text-slate-400">لقد هيأنا الموقع برمجياً للتوافق التام مع روبوتات جوجل وأحدث معايير الأرشفة اللحظية عن طريق ملفات XML الآلية.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                
                {/* XML Sitemap block */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">ملف خريطة الموقع المستمر</span>
                  <h3 className="text-xs font-bold text-slate-200">خريطة الموقع الآلية (Sitemap XML)</h3>
                  <p className="text-[11.5px] text-slate-400 leading-relaxed">
                    يحتوي موقعك على مسار ديناميكي خفي يولد خريطة موقع برمجية يتم تحديثها فورياً مع إضافة أي مباريات جديدة لتسجيلها في Google Search Console.
                  </p>
                  
                  {/* Copy Path Tool */}
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800 flex items-center justify-between">
                    <span className="font-mono text-[10.5px] text-emerald-400 select-all truncate">
                      {window.location.origin}/sitemap.xml
                    </span>
                    <button
                      onClick={copyUrlToClipboard}
                      className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[10px] font-bold px-3 py-1.5 rounded transition-all flex items-center gap-1"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>نسخ الرابط</span>
                    </button>
                  </div>
                  {showCopiedAlert && (
                    <p className="text-[11px] text-emerald-400 font-bold">✓ تم نسخ الرابط بنجاح! يمكنك لصقه الآن في أدوات مشرفي المواقع لجوجل.</p>
                  )}
                </div>

                {/* Robots.txt compatibility */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">ملف قواعد الزحف</span>
                  <h3 className="text-xs font-bold text-slate-200">التحكم في وصول زواحف الويب (Robots.txt)</h3>
                  <p className="text-[11.5px] text-slate-400 leading-relaxed">
                    تم تضمين ملف robots.txt مبرمج برمجياً في خادم الموقع يتيح لزواحف البحث أرشفة المقالات والنتائج ويمنع الاستكشاف في ملفات الإعدادات لضمان أمان تام.
                  </p>
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-left font-mono text-[10px] text-slate-300">
                    <div>User-agent: *</div>
                    <div>Allow: /</div>
                    <div className="text-emerald-400">Sitemap: {window.location.origin}/sitemap.xml</div>
                  </div>
                </div>

              </div>
            </div>

            {/* AdSense Step-by-Step Approval Tips & Strategy */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-4">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                  <Coins className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-display">دليل تفعيل جوجل أدسنس (AdSense Activation Guide) لأقصى أرباح</h2>
                  <p className="text-xs text-slate-400">اتبع هذه الخطوات لتجهيز وربط موقعك الرياضي بكود إعلانات الناشر الخاص بك بنجاح</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-350">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                    <span className="text-base">1️⃣</span>
                    <h4 className="font-bold text-slate-200">إنشاء رمز الناشر (Ad Code)</h4>
                    <p className="text-[11px] leading-relaxed">ادخل على حسابك في Google AdSense، اختر الإعلانات التلقائية (Auto Ads) أو قم بإنشاء وحدة إعلانية مخصصة متجاوبة (Responsive Display Banner).</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                    <span className="text-base">2️⃣</span>
                    <h4 className="font-bold text-slate-200">تحديث كود الرأس (Header Tag)</h4>
                    <p className="text-[11px] leading-relaxed">افتح ملف <span className="font-mono text-emerald-400">index.html</span> في محرك الكود والصق الكود الخاص بك داخل وسم <span className="font-mono">&lt;head&gt;</span> للحصول على ميزة الزحف التلقائي للمراجعة.</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                    <span className="text-base">3️⃣</span>
                    <h4 className="font-bold text-slate-200">صناعة المحتوى باستمرار</h4>
                    <p className="text-[11px] leading-relaxed">استخدم <strong>"محاكي المباريات"</strong> يومياً لمحاكاة مباريات جديدة وتوليد تحليلات تكتيكية غنية بالذكاء الاصطناعي لرفع جودة المحتوى للموافقة الفورية.</p>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2 mt-4">
                  <h4 className="font-bold text-slate-200 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>نصيحة ذهبية لزيادة المكاسب (High CPM):</span>
                  </h4>
                  <p className="leading-relaxed">
                    مباريات البطولات الكبرى (مثل دوري أبطال أوروبا وديربي الرياض وكلاسيكو إسبانيا) تحظى بارتفاع هائل في سعر النقرة الإعلاني (CPC) في دول الخليج وشمال أفريقيا وأوروبا. توليدك المستمر لهذه التحليلات التكتيكية سيوفر لك عائداً ممتازاً ومستقراً.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Footer detailing Arab localization & Google Search submission specs */}
      <footer className="mt-12 border-t border-slate-850 bg-slate-900/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs text-slate-450 text-slate-400 leading-relaxed">
            جميع التقارير والنتائج التكتيكية المبثوقة يتم توليدها ودعمها بواسطة محرك الذكاء الاصطناعي الفوري المتكامل ولقطات الصحفيين الرياضيين الرقميين.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
            <span>ملف خريطة الموقع: <a href="/sitemap.xml" target="_blank" className="text-emerald-400 hover:underline">/sitemap.xml</a></span>
            <span className="hidden sm:inline">•</span>
            <span>ملف تتبع الزحف: <a href="/robots.txt" target="_blank" className="text-emerald-400 hover:underline">/robots.txt</a></span>
            <span className="hidden sm:inline">•</span>
            <span>أمان البيانات والذكاء الاصطناعي مفعّل</span>
          </div>

          <div className="pt-4 border-t border-slate-850 max-w-2xl mx-auto">
            <p className="text-[11px] text-slate-500 italic">
              محفظتك التقنية والربحية الأولى. مجهز بالكامل للقبول في منصات الناشرين العالميين وأرشفة البحث السريع. {new Date().getFullYear()} © محلل كورة الذكاء الاصطناعي.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
