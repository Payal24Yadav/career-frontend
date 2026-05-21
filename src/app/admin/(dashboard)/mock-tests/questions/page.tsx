"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { Edit2, Loader2, Plus, Save, Search, Trash2, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { createQuestionAPI, deleteQuestionAPI, getMockTestsAPI, getQuestionsAPI, updateQuestionAPI, uploadQuestionAudioAPI, uploadQuestionVideoAPI } from "@/services/api";

const emptyForm = {
  mockTestId: "",
  questionType: "mcq",
  question: "",
  audioUrl: "",
  audioInstructions: "",
  videoUrl: "",
  videoInstructions: "",
  allowReplay: false,
  options: ["", "", "", ""],
  correctAnswer: 0,
  explanation: "",
  sectionName: "General",
  marks: 1,
  negativeMarks: 0,
};

export default function MockTestQuestionsPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedTest, setSelectedTest] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const loadTests = async () => {
    const { data } = await getMockTestsAPI("admin=true");
    const list = data.data || [];
    setTests(list);
    if (!selectedTest && list[0]?._id) {
      const firstSection = Array.isArray(list[0].examSections) && list[0].examSections[0]?.name
        ? list[0].examSections[0].name
        : "General";
      setSelectedTest(list[0]._id);
      setForm((current: any) => ({ ...current, mockTestId: list[0]._id, sectionName: firstSection }));
    }
  };

  const loadQuestions = async (testId = selectedTest) => {
    if (!testId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ mockTestId: testId });
      if (selectedSection) params.set("sectionName", selectedSection);
      const { data } = await getQuestionsAPI(params.toString());
      setQuestions(data.data || []);
    } catch {
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTests().catch(() => toast.error("Failed to load mock tests"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedTest) {
      const test = tests.find((item) => item._id === selectedTest);
      const firstSection = Array.isArray(test?.examSections) && test.examSections[0]?.name ? test.examSections[0].name : "General";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm((current: any) => {
        const availableSections = Array.isArray(test?.examSections) ? test.examSections.map((section: any) => section.name) : [];
        const currentSectionIsAvailable = availableSections.length === 0 || availableSections.includes(current.sectionName);

        return {
          ...current,
          mockTestId: selectedTest,
          sectionName: currentSectionIsAvailable ? (current.sectionName || firstSection) : firstSection,
        };
      });
      loadQuestions(selectedTest);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTest, selectedSection]);

  const selectedTestData = tests.find((test) => test._id === selectedTest);
  const examSections = Array.isArray(selectedTestData?.examSections) && selectedTestData.examSections.length > 0
    ? selectedTestData.examSections
    : [{ name: "General", duration: selectedTestData?.duration || 30, totalQuestions: selectedTestData?.totalQuestions || 0 }];

  const resetForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm, mockTestId: selectedTest, sectionName: examSections[0]?.name || "General" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      correctAnswer: Number(form.correctAnswer),
      marks: Number(form.marks),
      negativeMarks: Number(form.negativeMarks),
      sectionName: form.sectionName || examSections[0]?.name || "General",
      questionType: form.questionType || "mcq",
      audioUrl: form.questionType === "audio" ? form.audioUrl : "",
      audioInstructions: form.questionType === "audio" ? form.audioInstructions : "",
      videoUrl: form.questionType === "video" ? form.videoUrl : "",
      videoInstructions: form.questionType === "video" ? form.videoInstructions : "",
      allowReplay: ["audio", "video"].includes(form.questionType) ? Boolean(form.allowReplay) : false,
    };

    try {
      if (editingId) await updateQuestionAPI(editingId, payload);
      else await createQuestionAPI(payload);
      toast.success(editingId ? "Question updated" : "Question added");
      resetForm();
      loadQuestions(selectedTest);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save question");
    }
  };

  const editQuestion = (question: any) => {
    setEditingId(question._id);
    setForm({
      mockTestId: question.mockTestId?._id || question.mockTestId,
      questionType: question.questionType || "mcq",
      question: question.question || "",
      audioUrl: question.audioUrl || "",
      audioInstructions: question.audioInstructions || "",
      videoUrl: question.videoUrl || "",
      videoInstructions: question.videoInstructions || "",
      allowReplay: Boolean(question.allowReplay),
      options: Array.isArray(question.options) ? question.options : ["", "", "", ""],
      correctAnswer: question.correctAnswer || 0,
      explanation: question.explanation || "",
      sectionName: question.sectionName || question.section || "General",
      marks: question.marks ?? 1,
      negativeMarks: question.negativeMarks ?? 0,
    });
  };

  const removeQuestion = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    try {
      await deleteQuestionAPI(id);
      toast.success("Question deleted");
      loadQuestions(selectedTest);
    } catch {
      toast.error("Failed to delete question");
    }
  };

  const uploadAudio = async (file?: File) => {
    if (!file) return;

    const isValidAudio = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/mpeg3"].includes(file.type) || /\.(mp3|wav)$/i.test(file.name);
    if (!isValidAudio) {
      toast.error("Please upload an MP3 or WAV file");
      return;
    }

    const data = new FormData();
    data.append("file", file);
    setUploadingAudio(true);
    const toastId = toast.loading("Uploading audio...");

    try {
      const response = await uploadQuestionAudioAPI(data);
      const url = response.data?.data?.url;
      if (!url) throw new Error("Upload did not return a URL");
      setForm((current: any) => ({ ...current, questionType: "audio", audioUrl: url }));
      toast.success(response.data?.data?.mock ? "Mock audio URL attached" : "Audio uploaded", { id: toastId });
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to upload audio", { id: toastId });
    } finally {
      setUploadingAudio(false);
    }
  };

  const uploadVideo = async (file?: File) => {
    if (!file) return;

    const isValidVideo = ["video/mp4", "video/webm", "video/quicktime"].includes(file.type) || /\.(mp4|webm|mov)$/i.test(file.name);
    if (!isValidVideo) {
      toast.error("Please upload an MP4, WEBM, or MOV file");
      return;
    }

    const data = new FormData();
    data.append("file", file);
    setUploadingVideo(true);
    const toastId = toast.loading("Uploading video...");

    try {
      const response = await uploadQuestionVideoAPI(data);
      const url = response.data?.data?.url;
      if (!url) throw new Error("Upload did not return a URL");
      setForm((current: any) => ({ ...current, questionType: "video", videoUrl: url }));
      toast.success(response.data?.data?.mock ? "Mock video URL attached" : "Video uploaded", { id: toastId });
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to upload video", { id: toastId });
    } finally {
      setUploadingVideo(false);
    }
  };

  const filteredQuestions = questions.filter((question) => (
    question.question.toLowerCase().includes(search.toLowerCase()) ||
    (question.sectionName || question.section || "").toLowerCase().includes(search.toLowerCase())
  ));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Question Builder</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage MCQs for mock tests.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select value={selectedTest} onChange={(e) => { setSelectedTest(e.target.value); setSelectedSection(""); }} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white">
            {tests.map((test) => <option key={test._id} value={test._id}>{test.title}</option>)}
          </select>
          <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white">
            <option value="">All Sections</option>
            {examSections.map((section: any) => <option key={section.name} value={section.name}>{section.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <label className="relative block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search questions..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
            </label>
          </div>
          <div className="divide-y divide-gray-100">
            {loading ? <div className="p-8 text-center text-gray-500">Loading questions...</div> :
              filteredQuestions.length === 0 ? <div className="p-8 text-center text-gray-500">No questions yet</div> :
                filteredQuestions.map((question, index) => (
                  <div key={question._id} className="p-5 hover:bg-gray-50">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded-full">Q{index + 1}</span>
                          <span className="text-xs text-gray-500 capitalize">{question.questionType || "mcq"}</span>
                          <span className="text-xs text-gray-500">{question.sectionName || question.section}</span>
                          <span className="text-xs text-gray-500">{question.marks} marks</span>
                        </div>
                        <h3 className="font-semibold text-navy text-sm leading-relaxed">{question.question}</h3>
                        <p className="text-xs text-gray-500 mt-2">Answer: {question.options?.[question.correctAnswer]}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => editQuestion(question)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg" aria-label="Edit question"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => removeQuestion(question._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" aria-label="Delete question"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-5 h-fit sticky top-24 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-navy">{editingId ? "Edit Question" : "Add Question"}</h2>
            {editingId && <button type="button" onClick={resetForm} className="p-2 text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.questionType}
              onChange={(e) => setForm({ ...form, questionType: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white"
            >
              <option value="mcq">MCQ</option>
              <option value="audio">Audio</option>
              <option value="video">Video</option>
            </select>
            <label className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 cursor-pointer hover:border-primary">
              {uploadingAudio ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Upload Audio
              <input
                type="file"
                accept=".mp3,.wav,audio/mpeg,audio/wav"
                disabled={uploadingAudio}
                onChange={(e) => uploadAudio(e.target.files?.[0])}
                className="hidden"
              />
            </label>
            {/* <label className="col-span-2 flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 cursor-pointer hover:border-primary">
              {uploadingVideo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Upload Video
              <input
                type="file"
                accept=".mp4,.webm,.mov,video/mp4,video/webm,video/quicktime"
                disabled={uploadingVideo}
                onChange={(e) => uploadVideo(e.target.files?.[0])}
                className="hidden"
              />
            </label> */}
          </div>

          {form.questionType === "audio" && (
            <div className="space-y-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
              <textarea
                rows={3}
                value={form.audioInstructions}
                onChange={(e) => setForm({ ...form, audioInstructions: e.target.value })}
                placeholder="Audio instructions shown before playback"
                className="w-full px-3 py-2 border border-indigo-100 rounded-xl text-sm resize-none"
              />
              <input
                type="url"
                value={form.audioUrl}
                onChange={(e) => setForm({ ...form, audioUrl: e.target.value })}
                placeholder="Audio CDN URL"
                className="w-full px-3 py-2 border border-indigo-100 rounded-xl text-sm"
              />
              {form.audioUrl && (
                <audio controls preload="none" src={form.audioUrl} className="w-full" />
              )}
              <label className="flex items-center gap-2 text-sm font-bold text-indigo-900">
                <input
                  type="checkbox"
                  checked={Boolean(form.allowReplay)}
                  onChange={(e) => setForm({ ...form, allowReplay: e.target.checked })}
                  className="w-4 h-4 text-primary"
                />
                Allow replay during live test
              </label>
            </div>
          )}

          {form.questionType === "video" && (
            <div className="space-y-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
              <textarea
                rows={3}
                value={form.videoInstructions}
                onChange={(e) => setForm({ ...form, videoInstructions: e.target.value })}
                placeholder="Video instructions shown before playback"
                className="w-full px-3 py-2 border border-indigo-100 rounded-xl text-sm resize-none"
              />
              <input
                type="url"
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                placeholder="Video CDN URL"
                className="w-full px-3 py-2 border border-indigo-100 rounded-xl text-sm"
              />
              {form.videoUrl && (
                <video controls preload="none" src={form.videoUrl} className="w-full rounded-xl bg-black" />
              )}
              <label className="flex items-center gap-2 text-sm font-bold text-indigo-900">
                <input
                  type="checkbox"
                  checked={Boolean(form.allowReplay)}
                  onChange={(e) => setForm({ ...form, allowReplay: e.target.checked })}
                  className="w-4 h-4 text-primary"
                />
                Allow replay during live test
              </label>
            </div>
          )}

          <textarea required rows={4} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="Question text" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none" />

          <div className="space-y-2">
            {form.options.map((option: string, index: number) => (
              <div key={index} className="flex gap-2 items-center">
                <input type="radio" name="correctAnswer" checked={Number(form.correctAnswer) === index} onChange={() => setForm({ ...form, correctAnswer: index })} className="w-4 h-4 text-primary" />
                <input required value={option} onChange={(e) => setForm({ ...form, options: form.options.map((item: string, i: number) => i === index ? e.target.value : item) })} placeholder={`Option ${index + 1}`} className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <select value={form.sectionName} onChange={(e) => setForm({ ...form, sectionName: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white">
              {examSections.map((section: any) => <option key={section.name} value={section.name}>{section.name}</option>)}
            </select>
            <input type="number" value={form.marks} onChange={(e) => setForm({ ...form, marks: e.target.value })} placeholder="Marks" className="px-3 py-2 border border-gray-200 rounded-xl text-sm" />
            <input type="number" step="0.25" value={form.negativeMarks} onChange={(e) => setForm({ ...form, negativeMarks: e.target.value })} placeholder="Negative" className="px-3 py-2 border border-gray-200 rounded-xl text-sm" />
          </div>

          <textarea rows={3} value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} placeholder="Explanation" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none" />

          <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90">
            {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editingId ? "Save Question" : "Add Question"}
          </button>
        </form>
      </div>
    </div>
  );
}
