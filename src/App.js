// App.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Upload,
  Video,
  Scissors,
  Download,
  Play,
  Settings,
  Zap,
  FileVideo,
  Share2,
  Star,
  Clock,
  AlertCircle,
  CheckCircle,
  X,
  Menu,
  Sun,
  Moon,
  Link as LinkIcon,
  CloudUpload,
  User,
} from "lucide-react";

/**
 * Viral Clips AI - Expanded single-file demo (mock)
 *
 * Prereqs: Tailwind CSS + lucide-react available in project.
 *
 * Notes:
 * - All network / backend behaviour is mocked. Replace mocks with real APIs as needed.
 * - Clips are just metadata (start/end/title/score). Download/Export produce JSON metadata for now.
 */

/* ---------- storage helpers ---------- */
const LS = {
  apiKey: "viralclips_api_key",
  settings: "viralclips_settings_v2",
  projectPrefix: "viralclips_project_",
};

const defaultSettings = {
  theme: "dark", // dark | light
  accent: "purple", // purple, blue, green, pink
  autoGenerateOnUpload: true,
  watermark: true,
  maxClips: 5,
};

/* ---------- small helpers ---------- */
const classNames = (...c) => c.filter(Boolean).join(" ");

const uid = (prefix = "") => `${prefix}${Math.random().toString(36).slice(2, 9)}`;

const parseVideoLink = (text) => {
  if (!text) return null;
  text = text.trim();

  // YouTube
  const yt = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/i;
  const vm = /vimeo\.com\/(\d+)/i;
  const tiktok = /tiktok\.com\/@[^/]+\/video\/(\d+)/i;
  const fb = /facebook\.com\/.*\/videos\/(\d+)/i;

  const mY = text.match(yt);
  if (mY) return { kind: "youtube", id: mY[1], url: `https://youtu.be/${mY[1]}` };
  const mV = text.match(vm);
  if (mV) return { kind: "vimeo", id: mV[1], url: `https://vimeo.com/${mV[1]}` };
  const mT = text.match(tiktok);
  if (mT) return { kind: "tiktok", id: mT[1], url: text };
  const mF = text.match(fb);
  if (mF) return { kind: "facebook", id: mF[1], url: text };

  // direct video link check
  if (/\.(mp4|webm|mov|mkv)(\?|$)/i.test(text)) return { kind: "direct", id: uid("direct_"), url: text };

  return null;
};

/* ---------- mock AI helpers ---------- */
// mock transcript: split into sentences, add timecodes
const mockTranscribe = async (source) => {
  // simulate async processing
  await new Promise((r) => setTimeout(r, 600));
  // basic fake transcription based on source string
  const baseText =
    "This is a demo transcription. AI identifies interesting moments, highlights powerful tips, and suggests short clips that perform well on social media.";
  const sentences = baseText.split(".").filter(Boolean).map((s) => s.trim() + ".");
  // generate time offsets for each sentence
  let t = 0;
  const items = sentences.map((s, i) => {
    const dur = 4 + Math.floor(Math.random() * 6);
    const it = { id: uid("seg_"), start: t, end: t + dur, text: s };
    t += dur;
    return it;
  });
  return { text: baseText, segments: items };
};

// mock clip suggestions from transcription
const mockSuggestClips = (transcriptSegments, maxClips = 4) => {
  const out = [];
  const choices = transcriptSegments.slice(0, Math.max(3, transcriptSegments.length));
  for (let i = 0; i < Math.min(maxClips, choices.length); i++) {
    const seg = choices[i];
    const start = Math.max(0, seg.start);
    const end = seg.end + Math.floor(Math.random() * 6);
    const title = `${seg.text.slice(0, 40).trim().replace(/\.$/, "")}...`;
    const score = Math.min(100, 50 + Math.floor(Math.random() * 50));
    out.push({ id: uid("clip_"), start, end, title, score, captionSnippet: seg.text });
  }
  return out;
};

/* ---------- main App ---------- */
export default function App() {
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem(LS.settings);
      return raw ? JSON.parse(raw) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });
  useEffect(() => {
    localStorage.setItem(LS.settings, JSON.stringify(settings));
  }, [settings]);

  const [apiKey, setApiKey] = useState(() => localStorage.getItem(LS.apiKey) || "");
  useEffect(() => {
    localStorage.setItem(LS.apiKey, apiKey || "");
  }, [apiKey]);

  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
  const [videoUrlText, setVideoUrlText] = useState("");
  const [sourceInfo, setSourceInfo] = useState(null);

  const [transcript, setTranscript] = useState(null); // {text, segments}
  const [clips, setClips] = useState([]); // array of clip metadata
  const [selectedClipId, setSelectedClipId] = useState(null);

  const [generating, setGenerating] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  // Collaboration: share tokens saved in localStorage projectPrefix + token -> project JSON
  useEffect(() => {
    // load from URL token if present
    const params = new URLSearchParams(window.location.search);
    const token = params.get("project");
    if (token) {
      const raw = localStorage.getItem(LS.projectPrefix + token);
      if (raw) {
        try {
          const proj = JSON.parse(raw);
          // load project (merging)
          setVideoPreviewUrl(proj.videoPreviewUrl || "");
          setVideoUrlText(proj.videoUrlText || "");
          setClips(proj.clips || []);
          setTranscript(proj.transcript || null);
          setNotification({ type: "success", text: "Loaded shared project from token." });
        } catch {}
      } else {
        setNotification({ type: "error", text: "Share token not found in this browser." });
      }
    }
  }, []);

  // video preview blob URL cleanup
  useEffect(() => {
    if (!videoFile) return;
    const url = URL.createObjectURL(videoFile);
    setVideoPreviewUrl(url);
    setSourceInfo({ kind: "file", name: videoFile.name });
    return () => URL.revokeObjectURL(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoFile]);

  /* ---------- UI helpers ---------- */
  useEffect(() => {
    if (!notification) return;
    const id = setTimeout(() => setNotification(null), 2800);
    return () => clearTimeout(id);
  }, [notification]);

  const accentColor = useMemo(() => {
    const map = { purple: "from-purple-600 to-pink-500", blue: "from-blue-600 to-cyan-500", green: "from-green-500 to-emerald-500", pink: "from-pink-600 to-purple-500" };
    return map[settings.accent] || map.purple;
  }, [settings.accent]);

  /* ---------- file & URL handling ---------- */
  const fileInputRef = useRef(null);
  function handleFilePick(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("video/")) {
      setNotification({ type: "error", text: "Please select a video file." });
      return;
    }
    setVideoFile(f);
    setNotification({ type: "success", text: `Loaded ${f.name}` });
    // auto generate if setting on
    if (settings.autoGenerateOnUpload) {
      handleGenerateAll({ source: "file", file: f });
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("video/")) {
      setNotification({ type: "error", text: "Please drop a video file." });
      return;
    }
    setVideoFile(f);
    setNotification({ type: "success", text: `Dropped ${f.name}` });
    if (settings.autoGenerateOnUpload) handleGenerateAll({ source: "file", file: f });
  }

  function handleUrlProcess() {
    const info = parseVideoLink(videoUrlText);
    if (!info) {
      setNotification({ type: "error", text: "Enter valid YouTube/Vimeo/TikTok/Facebook URL or direct video link." });
      return;
    }
    setSourceInfo(info);
    setVideoPreviewUrl(info.url);
    setNotification({ type: "success", text: `Processed ${info.kind} link.` });
    // auto-generate
    handleGenerateAll({ source: "url", url: info.url, info });
  }

  /* ---------- generation pipeline (mock) ---------- */
  async function handleGenerateAll({ source = "file", file = null, url = "", info = null } = {}) {
    if (generating) return;
    setGenerating(true);
    setClips([]);
    setTranscript(null);
    try {
      // 1) transcript (mock)
      const tSource = source === "file" ? file?.name || "uploaded" : url || info?.url || "remote";
      const t = await mockTranscribe(tSource);
      setTranscript(t);

      // 2) suggest clips
      const suggested = mockSuggestClips(t.segments, settings.maxClips || 4);
      setClips(suggested);

      setNotification({ type: "success", text: `Generated ${suggested.length} clips (mock).` });
    } catch (e) {
      setNotification({ type: "error", text: "Generation failed (mock)." });
    } finally {
      setGenerating(false);
    }
  }

  /* ---------- clip editing (manual trimming) ---------- */
  const selectedClip = useMemo(() => clips.find((c) => c.id === selectedClipId) || (clips[0] || null), [clips, selectedClipId]);

  function updateSelectedClip(updates) {
    setClips((prev) => prev.map((c) => (c.id === (selectedClip?.id || "") ? { ...c, ...updates } : c)));
  }

  /* ---------- analytics ---------- */
  const analytics = useMemo(() => {
    if (!clips?.length) return { avgScore: 0, topClips: [], keywords: [] };
    const avgScore = Math.round(clips.reduce((s, c) => s + (c.score || 0), 0) / clips.length);
    // simple keyword extract from titles
    const allText = clips.map((c) => c.title).join(" ").toLowerCase();
    const words = allText.split(/\W+/).filter(Boolean);
    const freq = {};
    for (const w of words) {
      if (w.length <= 3) continue;
      freq[w] = (freq[w] || 0) + 1;
    }
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 6).map((x) => x[0]);
    const topClips = [...clips].sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 3);
    return { avgScore, topClips, keywords: top };
  }, [clips]);

  /* ---------- download/export/share ---------- */
  function downloadClipJSON(c) {
    const payload = { clip: c, transcript: transcript || null, source: sourceInfo || null, settings };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(c.title || "clip").replace(/\s+/g, "_").slice(0, 40)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setNotification({ type: "success", text: "Clip metadata downloaded." });
  }

  function exportAllClips() {
    if (!clips.length) {
      setNotification({ type: "error", text: "No clips to export." });
      return;
    }
    const payload = { clips, transcript, sourceInfo, settings, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `viralclips_export_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setNotification({ type: "success", text: "All clips exported (JSON)." });
  }

  async function cloudExportMock() {
    // this is a mock: generate a blob and create pseudo cloud URL (object URL) and save mapping in localStorage
    const token = uid("cloud_");
    const payload = { clips, transcript, sourceInfo, settings, exportedAt: new Date().toISOString() };
    localStorage.setItem("cloud_export_" + token, JSON.stringify(payload));
    const link = `${window.location.origin}${window.location.pathname}?cloud=${token}`;
    // copy to clipboard
    try {
      await navigator.clipboard.writeText(link);
      setNotification({ type: "success", text: "Cloud export ready and link copied to clipboard." });
    } catch {
      setNotification({ type: "success", text: `Cloud export ready: ${link}` });
    }
  }

  async function shareClipMock(c) {
    const shareText = `${c.title} (${c.start}s - ${c.end}s) • Score ${c.score}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: c.title, text: shareText, url: sourceInfo?.url || videoPreviewUrl || window.location.href });
        setNotification({ type: "success", text: "Shared via native share." });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${sourceInfo?.url || videoPreviewUrl || window.location.href}`);
        setNotification({ type: "success", text: "Share text copied to clipboard." });
      }
    } catch {
      setNotification({ type: "error", text: "Share failed or canceled." });
    }
  }

  /* ---------- subtitles mock ---------- */
  function generateSubtitlesForClip(c) {
    // create simple caption array from transcript segments that intersect clip time
    if (!transcript?.segments) return [];
    const segs = transcript.segments.filter((s) => s.end >= c.start && s.start <= c.end).map((s) => ({
      start: Math.max(s.start, c.start),
      end: Math.min(s.end, c.end),
      text: s.text,
    }));
    if (!segs.length) {
      // fallback: a single caption using clip.title
      return [{ start: c.start, end: c.end, text: c.title || "Clip" }];
    }
    return segs;
  }

  /* ---------- collaboration / share project mock ---------- */
  function createShareToken() {
    const token = uid("proj_");
    const payload = { videoPreviewUrl, videoUrlText, clips, transcript, settings };
    localStorage.setItem(LS.projectPrefix + token, JSON.stringify(payload));
    const link = `${window.location.origin}${window.location.pathname}?project=${token}`;
    try {
      navigator.clipboard.writeText(link);
      setNotification({ type: "success", text: "Share link copied to clipboard." });
    } catch {
      setNotification({ type: "success", text: `Share link: ${link}` });
    }
  }

  /* ---------- simple UI ---------- */
  const themeIsDark = settings.theme === "dark";

  return (
    <>
      <div className={classNames("min-h-screen transition-all", themeIsDark ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-900")}>
        {/* header */}
        <header className="max-w-6xl mx-auto p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={classNames("p-2 rounded-xl shadow-md", themeIsDark ? "bg-slate-800" : "bg-white")}>
              <Video size={24} className={themeIsDark ? "text-white" : "text-gray-700"} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Viral Clips AI</h1>
              <div className="text-xs opacity-70">Demo — mock AI + export features</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-3 p-2 rounded-xl">
              <div className="text-sm opacity-80">Accent</div>
              <select
                value={settings.accent}
                onChange={(e) => setSettings({ ...settings, accent: e.target.value })}
                className={classNames("px-2 py-1 rounded-md outline-none", themeIsDark ? "bg-slate-800" : "bg-white")}
              >
                <option value="purple">Purple</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="pink">Pink</option>
              </select>
            </div>

            <button
              onClick={() => setSettings({ ...settings, theme: settings.theme === "dark" ? "light" : "dark" })}
              className={classNames("p-2 rounded-xl", themeIsDark ? "bg-slate-800" : "bg-white")}
              title="Toggle theme"
            >
              {themeIsDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button onClick={() => setShowSettings(true)} className={classNames("px-3 py-2 rounded-xl", themeIsDark ? "bg-slate-800" : "bg-white")}>
              <Settings size={16} className="inline mr-2" />
              Settings
            </button>
          </div>
        </header>

        {/* main */}
        <main className="max-w-6xl mx-auto p-4 md:p-6 grid gap-6">
          {/* upload + url + generate */}
          <section className="grid md:grid-cols-3 gap-4">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={classNames("rounded-2xl p-4 h-44 flex flex-col justify-center items-center text-center border-2 border-dashed", themeIsDark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-white")}
            >
              <Upload size={28} />
              <div className="font-semibold mt-2">Drag & drop a video</div>
              <div className="text-xs opacity-70 mt-2">or select file</div>
              <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFilePick} className="mt-3" />
            </div>

            <div className={classNames("rounded-2xl p-4 h-44", themeIsDark ? "bg-slate-800" : "bg-white border")}>
              <label className="text-sm opacity-80">Process from URL</label>
              <div className="flex gap-2 mt-2">
                <input value={videoUrlText} onChange={(e) => setVideoUrlText(e.target.value)} placeholder="YouTube / Vimeo / TikTok / Facebook / direct link" className={classNames("flex-1 px-3 py-2 rounded-xl outline-none", themeIsDark ? "bg-slate-700" : "bg-gray-100")} />
                <button onClick={handleUrlProcess} className="px-4 py-2 rounded-xl bg-blue-600 text-white">Process</button>
              </div>
              <div className="text-xs opacity-70 mt-2">Paste link and Process → then Generate if needed.</div>
            </div>

            <div className={classNames("rounded-2xl p-4 h-44 flex flex-col justify-center", themeIsDark ? "bg-slate-800" : "bg-white border")}>
              <div className="mb-3">AI Clip Generation</div>
              <button onClick={() => handleGenerateAll({ source: "manual", url: videoPreviewUrl })} disabled={generating} className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                <Zap size={16} className="inline mr-2" />
                {generating ? "Generating..." : "Generate Clips (mock)"}
              </button>
              <div className="text-xs opacity-70 mt-2">Transcription + suggested clips (mock). Use manual trimming to tune.</div>
            </div>
          </section>

          {/* preview + transcript + analytics */}
          <section className="grid md:grid-cols-2 gap-4">
            <div className={classNames("rounded-2xl p-4", themeIsDark ? "bg-slate-800" : "bg-white border")}>
              <h3 className="font-semibold mb-3">Preview</h3>
              <div className="bg-black rounded-xl aspect-video overflow-hidden flex items-center justify-center">
                {videoPreviewUrl ? (
                  <video src={videoPreviewUrl} controls className="w-full h-full object-cover" />
                ) : (
                  <div className="text-white/80">No preview yet</div>
                )}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="text-xs opacity-80">Source: {sourceInfo?.kind || "—"}</div>
                <div className="text-xs opacity-80 text-right">Clips: {clips.length}</div>
              </div>
            </div>

            <div className={classNames("rounded-2xl p-4", themeIsDark ? "bg-slate-800" : "bg-white border")}>
              <div className="flex items-start justify-between">
                <h3 className="font-semibold mb-1">Transcript & Captions (mock)</h3>
                <div className="text-sm opacity-70">Segments: {transcript?.segments?.length || 0}</div>
              </div>

              <div className="h-52 overflow-y-auto mt-3 border-t pt-3">
                {transcript ? (
                  transcript.segments.map((s) => (
                    <div key={s.id} className="mb-2">
                      <div className="text-xs opacity-70">[{s.start}s - {s.end}s]</div>
                      <div>{s.text}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm opacity-70">No transcript. Generate clips to create a mock transcript.</div>
                )}
              </div>
            </div>
          </section>

          {/* clips + editor + analytics */}
          <section className="grid lg:grid-cols-3 gap-4">
            <div className={classNames("rounded-2xl p-4 lg:col-span-2", themeIsDark ? "bg-slate-800" : "bg-white border")}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Generated Clips</h3>
                <div className="text-sm opacity-70">{clips.length} items</div>
              </div>

              {clips.length === 0 ? (
                <div className="py-6 text-sm opacity-70">No clips yet — click Generate or upload a file / process a URL.</div>
              ) : (
                <div className="grid md:grid-cols-2 gap-3">
                  {clips.map((c) => (
                    <div key={c.id} className={classNames("p-3 rounded-xl flex flex-col gap-2", selectedClip?.id === c.id ? "ring-2 ring-offset-2 ring-purple-400" : themeIsDark ? "bg-slate-700" : "bg-gray-50")}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">{c.title}</div>
                          <div className="text-xs opacity-70">{c.start}s - {c.end}s</div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">
                            <Star size={12} /> {c.score}
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => { setSelectedClipId(c.id); }} className="px-2 py-1 rounded-md border text-xs">Edit</button>
                            <button onClick={() => downloadClipJSON(c)} className="px-2 py-1 rounded-md bg-green-600 text-white text-xs"><Download size={12} /></button>
                            <button onClick={() => shareClipMock(c)} className="px-2 py-1 rounded-md bg-blue-600 text-white text-xs"><Share2 size={12} /></button>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm opacity-70">{c.captionSnippet}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* editor / analytics */}
            <div className={classNames("rounded-2xl p-4", themeIsDark ? "bg-slate-800" : "bg-white border")}>
              <h3 className="font-semibold mb-3">Clip Editor & Analytics</h3>

              {selectedClip ? (
                <>
                  <div className="mb-2 text-sm opacity-80">Selected: <span className="font-medium">{selectedClip.title}</span></div>
                  <div className="text-xs opacity-70 mb-2">Trim (start / end seconds)</div>
                  <div className="flex gap-2 mb-3">
                    <input type="range" min={0} max={Math.max(60, selectedClip.end + 30)} value={selectedClip.start} onChange={(e) => updateSelectedClip({ start: Number(e.target.value) })} className="flex-1" />
                    <div className="w-16 text-right text-xs">{selectedClip.start}s</div>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <input type="range" min={selectedClip.start + 1} max={Math.max(selectedClip.start + 1, selectedClip.end + 60)} value={selectedClip.end} onChange={(e) => updateSelectedClip({ end: Number(e.target.value) })} className="flex-1" />
                    <div className="w-16 text-right text-xs">{selectedClip.end}s</div>
                  </div>

                  <div className="mb-3">
                    <label className="text-sm block mb-1">Title</label>
                    <input value={selectedClip.title} onChange={(e) => updateSelectedClip({ title: e.target.value })} className={classNames("w-full px-3 py-2 rounded-md", themeIsDark ? "bg-slate-700" : "bg-gray-100")} />
                  </div>

                  <div className="mb-3">
                    <button onClick={() => {
                      const subs = generateSubtitlesForClip(selectedClip);
                      const blob = new Blob([JSON.stringify({ clip: selectedClip, subtitles: subs }, null, 2)], { type: "application/json" });
                      const a = document.createElement("a");
                      a.href = URL.createObjectURL(blob);
                      a.download = `${(selectedClip.title || "clip").replace(/\s+/g, "_")}_subtitles.json`;
                      document.body.appendChild(a); a.click(); a.remove();
                      setNotification({ type: "success", text: "Subtitles exported (mock JSON)." });
                    }} className="px-3 py-2 rounded-xl bg-indigo-600 text-white">Export Subtitles (mock)</button>
                  </div>
                </>
              ) : (
                <div className="text-sm opacity-70">Select a clip to edit.</div>
              )}

              <hr className="my-3" />
              <div className="text-sm mb-2">Analytics</div>
              <div className="text-xs opacity-80 mb-2">Avg score: <span className="font-medium">{analytics.avgScore}</span></div>
              <div className="text-xs opacity-80 mb-2">Top keywords: {analytics.keywords.length ? analytics.keywords.join(", ") : "—"}</div>

              <div className="mt-3 flex flex-col gap-2">
                <button onClick={exportAllClips} className="px-3 py-2 rounded-xl bg-green-600 text-white">Export All Clips</button>
                <button onClick={cloudExportMock} className="px-3 py-2 rounded-xl bg-emerald-500 text-white flex items-center gap-2"><CloudUpload size={14} /> Cloud Export (mock)</button>
                <button onClick={createShareToken} className="px-3 py-2 rounded-xl bg-blue-600 text-white flex items-center gap-2"><User size={14} /> Create Share Link</button>
              </div>
            </div>
          </section>
        </main>

        {/* notification */}
        {notification && (
          <div className={classNames("fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-xl", notification.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white")}>
            <div className="flex items-center gap-2">
              {notification.type === "success" ? <CheckCircle /> : <AlertCircle />} <div className="text-sm">{notification.text}</div>
              <button onClick={() => setNotification(null)} className="ml-3"><X /></button>
            </div>
          </div>
        )}

        {/* settings modal */}
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowSettings(false)} />
            <div className={classNames("relative w-[92%] max-w-2xl rounded-2xl p-5", themeIsDark ? "bg-slate-900 text-white" : "bg-white")}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Settings</h3>
                <button onClick={() => setShowSettings(false)} className="p-2 rounded-md border"><X /></button>
              </div>

              <div className="grid gap-3">
                <div>
                  <label className="text-sm block mb-1">API Key (stored locally)</label>
                  <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." className={classNames("w-full px-3 py-2 rounded-md", themeIsDark ? "bg-slate-800" : "bg-gray-100")} />
                </div>

                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={settings.autoGenerateOnUpload} onChange={(e) => setSettings({ ...settings, autoGenerateOnUpload: e.target.checked })} /> Auto-generate on upload
                </label>

                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={settings.watermark} onChange={(e) => setSettings({ ...settings, watermark: e.target.checked })} /> Apply watermark (mock)
                </label>

                <div className="flex items-center gap-3">
                  <div>Max clips</div>
                  <input type="number" min={1} max={9} value={settings.maxClips} onChange={(e) => setSettings({ ...settings, maxClips: Number(e.target.value) })} className="w-20 px-2 py-1 rounded-md" />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setShowSettings(false)} className="px-3 py-2 rounded-xl border">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
