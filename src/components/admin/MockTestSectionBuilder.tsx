"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";

export const SECTION_TYPES = [
  { value: "overview", label: "Overview" },
  { value: "examPattern", label: "Exam Pattern Table" },
  { value: "cutoff", label: "Cutoffs Table" },
  { value: "strategy", label: "Strategy Blocks" },
  { value: "syllabus", label: "Syllabus Categories" },
  { value: "topics", label: "Topics Grid" },
  { value: "faq", label: "FAQ Accordion" },
  { value: "resources", label: "Downloadable Resources" },
  { value: "features", label: "Key Features" },
  { value: "cta", label: "Call to Action" },
];

type Section = {
  type: string;
  title?: string;
  content: any;
};

type Props = {
  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
};

export const createDefaultContent = (type: string) => {
  if (type === "overview") return { description: "", highlights: [""] };
  if (type === "faq") return [{ q: "", a: "" }];
  if (type === "cutoff") return [{ institute: "", cutoff: "", safeScore: "" }];
  if (type === "examPattern") return [{ sectionName: "", questions: "", marks: "", duration: "" }];
  if (type === "strategy") return [{ strategyName: "", description: "" }];
  if (type === "syllabus") return [{ section: "", topics: [""] }];
  if (type === "topics") return [{ subject: "", topics: [""] }];
  if (type === "resources") return [{ name: "", fileUrl: "" }];
  if (type === "features") return [""];
  if (type === "cta") return { heading: "", description: "", buttonText: "", buttonLink: "" };
  return "";
};

export const normalizeMockTestSection = (section: Section): Section => {
  if (section.type === "overview") {
    if (typeof section.content === "string") {
      return { ...section, content: { description: section.content, highlights: [] } };
    }
    return {
      ...section,
      content: {
        description: section.content?.description || "",
        highlights: Array.isArray(section.content?.highlights) ? section.content.highlights : [],
      },
    };
  }

  if (section.type === "resources") {
    const resources = Array.isArray(section.content) ? section.content : [];
    return {
      ...section,
      content: resources.map((resource: any) => ({
        name: resource.name || resource.resourceName || "",
        fileUrl: resource.fileUrl || resource.link || "",
      })),
    };
  }

  if (section.type === "features") {
    const features = Array.isArray(section.content) ? section.content : [];
    return {
      ...section,
      content: features.map((feature: any) => (
        typeof feature === "string" ? feature : feature.feature || feature.description || ""
      )),
    };
  }

  if (section.type === "cta") {
    return {
      ...section,
      content: {
        heading: section.content?.heading || section.title || "",
        description: section.content?.description || section.content?.text || "",
        buttonText: section.content?.buttonText || "",
        buttonLink: section.content?.buttonLink || section.content?.link || "",
      },
    };
  }

  if (section.type === "syllabus") {
    const categories = Array.isArray(section.content) ? section.content : [];
    return {
      ...section,
      content: categories.map((category: any) => ({
        section: category.section || category.subject || "",
        topics: Array.isArray(category.topics) ? category.topics : [""],
      })),
    };
  }

  return section;
};

export default function MockTestSectionBuilder({ sections, setSections }: Props) {
  const addSection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    if (!type) return;

    setSections((current) => [...current, { type, title: "", content: createDefaultContent(type) }]);
    e.target.value = "";
  };

  const removeSection = (index: number) => {
    setSections((current) => current.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, field: string, value: any) => {
    setSections((current) => current.map((section, i) => (
      i === index ? { ...section, [field]: value } : section
    )));
  };

  const updateContent = (sectionIndex: number, value: any) => {
    setSections((current) => current.map((section, i) => (
      i === sectionIndex ? { ...section, content: value } : section
    )));
  };

  const addArrayItem = (sectionIndex: number, defaultItem: any) => {
    setSections((current) => current.map((section, i) => (
      i === sectionIndex
        ? { ...section, content: [...asArray(section.content), defaultItem] }
        : section
    )));
  };

  const removeArrayItem = (sectionIndex: number, itemIndex: number) => {
    setSections((current) => current.map((section, i) => (
      i === sectionIndex
        ? { ...section, content: asArray(section.content).filter((_, idx) => idx !== itemIndex) }
        : section
    )));
  };

  const updateArrayItem = (sectionIndex: number, itemIndex: number, field: string, value: any) => {
    setSections((current) => current.map((section, i) => (
      i === sectionIndex
        ? {
            ...section,
            content: asArray(section.content).map((item, idx) => (
              idx === itemIndex ? { ...item, [field]: value } : item
            )),
          }
        : section
    )));
  };

  const updateStringItem = (sectionIndex: number, itemIndex: number, value: string) => {
    setSections((current) => current.map((section, i) => (
      i === sectionIndex
        ? {
            ...section,
            content: asArray(section.content).map((item, idx) => (idx === itemIndex ? value : item)),
          }
        : section
    )));
  };

  const updateNestedTopic = (sectionIndex: number, categoryIndex: number, topicIndex: number, value: string) => {
    setSections((current) => current.map((section, i) => {
      if (i !== sectionIndex) return section;
      return {
        ...section,
        content: asArray(section.content).map((category, idx) => {
          if (idx !== categoryIndex) return category;
          const topics = asArray(category.topics).map((topic, tIdx) => (tIdx === topicIndex ? value : topic));
          return { ...category, topics };
        }),
      };
    }));
  };

  const addNestedTopic = (sectionIndex: number, categoryIndex: number) => {
    setSections((current) => current.map((section, i) => {
      if (i !== sectionIndex) return section;
      return {
        ...section,
        content: asArray(section.content).map((category, idx) => (
          idx === categoryIndex ? { ...category, topics: [...asArray(category.topics), ""] } : category
        )),
      };
    }));
  };

  const removeNestedTopic = (sectionIndex: number, categoryIndex: number, topicIndex: number) => {
    setSections((current) => current.map((section, i) => {
      if (i !== sectionIndex) return section;
      return {
        ...section,
        content: asArray(section.content).map((category, idx) => (
          idx === categoryIndex
            ? { ...category, topics: asArray(category.topics).filter((_, tIdx) => tIdx !== topicIndex) }
            : category
        )),
      };
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center gap-4">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Page Content Blocks</h2>
        <select
          onChange={addSection}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 bg-white cursor-pointer font-medium"
        >
          <option value="">+ Add Section Block</option>
          {SECTION_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
        </select>
      </div>

      <div className="p-6 space-y-8 min-h-[400px]">
        {sections.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
            <Plus className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No content blocks added.</p>
            <p className="text-sm text-gray-400 mt-1">Select a block from the dropdown above to start building.</p>
          </div>
        ) : (
          sections.map((section, sIndex) => (
            <div key={sIndex} className="bg-white border border-gray-200 rounded-xl shadow-sm relative group overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                  <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                    {SECTION_TYPES.find((type) => type.value === section.type)?.label || section.type}
                  </span>
                </div>
                <button type="button" onClick={() => removeSection(sIndex)} className="text-gray-400 hover:text-red-500 transition-colors" aria-label="Remove section">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Section Title</label>
                  <input
                    type="text"
                    value={section.title || ""}
                    onChange={(e) => updateSection(sIndex, "title", e.target.value)}
                    placeholder="e.g. Overview, Expected Cutoffs..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none"
                  />
                </div>

                {section.type === "overview" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Description</label>
                      <textarea
                        rows={5}
                        value={section.content?.description || ""}
                        onChange={(e) => updateContent(sIndex, { ...section.content, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none resize-none"
                        placeholder="Enter a clear overview for this mock test..."
                      />
                    </div>
                    <DynamicStringList
                      label="Highlights"
                      values={asArray(section.content?.highlights)}
                      onAdd={() => updateContent(sIndex, { ...section.content, highlights: [...asArray(section.content?.highlights), ""] })}
                      onRemove={(i) => updateContent(sIndex, { ...section.content, highlights: asArray(section.content?.highlights).filter((_, idx) => idx !== i) })}
                      onChange={(i, value) => updateContent(sIndex, { ...section.content, highlights: asArray(section.content?.highlights).map((item, idx) => idx === i ? value : item) })}
                      placeholder="e.g. Includes 5 full-length timed tests"
                    />
                  </div>
                )}

                {section.type === "examPattern" && (
                  <div className="space-y-3">
                    {asArray(section.content).map((item: any, i: number) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_80px_80px_110px_36px] gap-2 items-start bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <input type="text" placeholder="Section Name" value={item.sectionName || ""} onChange={(e) => updateArrayItem(sIndex, i, "sectionName", e.target.value)} className="px-3 py-1.5 text-sm border rounded-md" />
                        <input type="number" placeholder="Qs" value={item.questions || ""} onChange={(e) => updateArrayItem(sIndex, i, "questions", e.target.value)} className="px-3 py-1.5 text-sm border rounded-md" />
                        <input type="number" placeholder="Marks" value={item.marks || ""} onChange={(e) => updateArrayItem(sIndex, i, "marks", e.target.value)} className="px-3 py-1.5 text-sm border rounded-md" />
                        <input type="text" placeholder="Duration" value={item.duration || ""} onChange={(e) => updateArrayItem(sIndex, i, "duration", e.target.value)} className="px-3 py-1.5 text-sm border rounded-md" />
                        <IconRemoveButton onClick={() => removeArrayItem(sIndex, i)} />
                      </div>
                    ))}
                    <AddButton onClick={() => addArrayItem(sIndex, { sectionName: "", questions: "", marks: "", duration: "" })}>Add Row</AddButton>
                  </div>
                )}

                {section.type === "cutoff" && (
                  <div className="space-y-3">
                    {asArray(section.content).map((item: any, i: number) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_130px_130px_36px] gap-2 items-start bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <input type="text" placeholder="Institute Name" value={item.institute || ""} onChange={(e) => updateArrayItem(sIndex, i, "institute", e.target.value)} className="px-3 py-1.5 text-sm border rounded-md" />
                        <input type="text" placeholder="Cutoff %ile" value={item.cutoff || ""} onChange={(e) => updateArrayItem(sIndex, i, "cutoff", e.target.value)} className="px-3 py-1.5 text-sm border rounded-md" />
                        <input type="text" placeholder="Safe Score" value={item.safeScore || ""} onChange={(e) => updateArrayItem(sIndex, i, "safeScore", e.target.value)} className="px-3 py-1.5 text-sm border rounded-md" />
                        <IconRemoveButton onClick={() => removeArrayItem(sIndex, i)} />
                      </div>
                    ))}
                    <AddButton onClick={() => addArrayItem(sIndex, { institute: "", cutoff: "", safeScore: "" })}>Add Institute</AddButton>
                  </div>
                )}

                {section.type === "strategy" && (
                  <div className="space-y-3">
                    {asArray(section.content).map((item: any, i: number) => (
                      <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex gap-2 items-start">
                        <div className="flex-1 space-y-2">
                          <input type="text" placeholder="Strategy Title" value={item.strategyName || ""} onChange={(e) => updateArrayItem(sIndex, i, "strategyName", e.target.value)} className="w-full px-3 py-1.5 text-sm border rounded-md font-bold" />
                          <textarea rows={2} placeholder="Description details..." value={item.description || ""} onChange={(e) => updateArrayItem(sIndex, i, "description", e.target.value)} className="w-full px-3 py-1.5 text-sm border rounded-md resize-none" />
                        </div>
                        <IconRemoveButton onClick={() => removeArrayItem(sIndex, i)} />
                      </div>
                    ))}
                    <AddButton onClick={() => addArrayItem(sIndex, { strategyName: "", description: "" })}>Add Strategy Card</AddButton>
                  </div>
                )}

                {section.type === "syllabus" && (
                  <div className="space-y-4">
                    {asArray(section.content).map((category: any, i: number) => (
                      <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                        <div className="flex gap-2 items-start">
                          <input
                            type="text"
                            placeholder="Category / Section name"
                            value={category.section || ""}
                            onChange={(e) => updateArrayItem(sIndex, i, "section", e.target.value)}
                            className="flex-1 px-3 py-1.5 text-sm border rounded-md font-bold"
                          />
                          <IconRemoveButton onClick={() => removeArrayItem(sIndex, i)} />
                        </div>
                        <div className="space-y-2 pl-0 md:pl-4">
                          {asArray(category.topics).map((topic: string, topicIndex: number) => (
                            <div key={topicIndex} className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Topic"
                                value={topic || ""}
                                onChange={(e) => updateNestedTopic(sIndex, i, topicIndex, e.target.value)}
                                className="flex-1 px-3 py-1.5 text-sm border rounded-md"
                              />
                              <IconRemoveButton onClick={() => removeNestedTopic(sIndex, i, topicIndex)} />
                            </div>
                          ))}
                          <AddButton onClick={() => addNestedTopic(sIndex, i)}>Add Topic</AddButton>
                        </div>
                      </div>
                    ))}
                    <AddButton onClick={() => addArrayItem(sIndex, { section: "", topics: [""] })}>Add Category</AddButton>
                  </div>
                )}

                {section.type === "topics" && (
                  <div className="space-y-4">
                    {asArray(section.content).map((subject: any, i: number) => (
                      <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                        <div className="flex gap-2 items-start">
                          <input type="text" placeholder="Subject" value={subject.subject || ""} onChange={(e) => updateArrayItem(sIndex, i, "subject", e.target.value)} className="flex-1 px-3 py-1.5 text-sm border rounded-md font-bold" />
                          <IconRemoveButton onClick={() => removeArrayItem(sIndex, i)} />
                        </div>
                        {asArray(subject.topics).map((topic: string, topicIndex: number) => (
                          <div key={topicIndex} className="flex gap-2">
                            <input type="text" placeholder="Topic" value={topic || ""} onChange={(e) => updateNestedTopic(sIndex, i, topicIndex, e.target.value)} className="flex-1 px-3 py-1.5 text-sm border rounded-md" />
                            <IconRemoveButton onClick={() => removeNestedTopic(sIndex, i, topicIndex)} />
                          </div>
                        ))}
                        <AddButton onClick={() => addNestedTopic(sIndex, i)}>Add Topic</AddButton>
                      </div>
                    ))}
                    <AddButton onClick={() => addArrayItem(sIndex, { subject: "", topics: [""] })}>Add Subject</AddButton>
                  </div>
                )}

                {section.type === "faq" && (
                  <div className="space-y-3">
                    {asArray(section.content).map((item: any, i: number) => (
                      <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex gap-2 items-start">
                        <div className="flex-1 space-y-2">
                          <input type="text" placeholder="Question?" value={item.q || ""} onChange={(e) => updateArrayItem(sIndex, i, "q", e.target.value)} className="w-full px-3 py-1.5 text-sm border rounded-md font-medium" />
                          <textarea rows={2} placeholder="Answer..." value={item.a || ""} onChange={(e) => updateArrayItem(sIndex, i, "a", e.target.value)} className="w-full px-3 py-1.5 text-sm border rounded-md resize-none" />
                        </div>
                        <IconRemoveButton onClick={() => removeArrayItem(sIndex, i)} />
                      </div>
                    ))}
                    <AddButton onClick={() => addArrayItem(sIndex, { q: "", a: "" })}>Add FAQ</AddButton>
                  </div>
                )}

                {section.type === "resources" && (
                  <div className="space-y-3">
                    {asArray(section.content).map((resource: any, i: number) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_36px] gap-2 items-start bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <input type="text" placeholder="Resource name" value={resource.name || ""} onChange={(e) => updateArrayItem(sIndex, i, "name", e.target.value)} className="px-3 py-1.5 text-sm border rounded-md" />
                        <input type="url" placeholder="File URL" value={resource.fileUrl || ""} onChange={(e) => updateArrayItem(sIndex, i, "fileUrl", e.target.value)} className="px-3 py-1.5 text-sm border rounded-md" />
                        <IconRemoveButton onClick={() => removeArrayItem(sIndex, i)} />
                      </div>
                    ))}
                    <AddButton onClick={() => addArrayItem(sIndex, { name: "", fileUrl: "" })}>Add Resource</AddButton>
                  </div>
                )}

                {section.type === "features" && (
                  <DynamicStringList
                    label="Feature Points"
                    values={asArray(section.content)}
                    onAdd={() => addArrayItem(sIndex, "")}
                    onRemove={(i) => removeArrayItem(sIndex, i)}
                    onChange={(i, value) => updateStringItem(sIndex, i, value)}
                    placeholder="e.g. Detailed section-wise analytics"
                  />
                )}

                {section.type === "cta" && (
                  <div className="space-y-3">
                    <input type="text" placeholder="Heading" value={section.content?.heading || ""} onChange={(e) => updateContent(sIndex, { ...section.content, heading: e.target.value })} className="w-full px-3 py-1.5 text-sm border rounded-md font-bold" />
                    <textarea rows={3} placeholder="Description" value={section.content?.description || ""} onChange={(e) => updateContent(sIndex, { ...section.content, description: e.target.value })} className="w-full px-3 py-1.5 text-sm border rounded-md resize-none" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input type="text" placeholder="Button text" value={section.content?.buttonText || ""} onChange={(e) => updateContent(sIndex, { ...section.content, buttonText: e.target.value })} className="px-3 py-1.5 text-sm border rounded-md" />
                      <input type="text" placeholder="Button link" value={section.content?.buttonLink || ""} onChange={(e) => updateContent(sIndex, { ...section.content, buttonLink: e.target.value })} className="px-3 py-1.5 text-sm border rounded-md" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function DynamicStringList({
  label,
  values,
  onAdd,
  onRemove,
  onChange,
  placeholder,
}: {
  label: string;
  values: any[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{label}</label>
      {values.map((value, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(i, e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-1.5 text-sm border rounded-md"
          />
          <IconRemoveButton onClick={() => onRemove(i)} />
        </div>
      ))}
      <AddButton onClick={onAdd}>Add Item</AddButton>
    </div>
  );
}

function IconRemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md mt-0.5" aria-label="Remove item">
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="text-xs font-bold text-primary hover:underline">
      + {children}
    </button>
  );
}

function asArray(value: any): any[] {
  return Array.isArray(value) ? value : [];
}
