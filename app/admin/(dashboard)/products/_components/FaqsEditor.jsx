"use client";

import { Plus, Trash2 } from "lucide-react";

const inputClass = "w-full rounded-lg border border-[#a8451a]/15 bg-white px-3 py-2 text-sm text-[#1c1109] placeholder:text-[#2b1d12]/67 focus:border-[#a8451a]/50 focus:outline-none";

export default function FaqsEditor({ faqs, onChange }) {
  const update = (idx, key, value) => {
    onChange(faqs.map((f, i) => (i === idx ? { ...f, [key]: value } : f)));
  };

  const add = () => onChange([...faqs, { question: "", answer: "" }]);
  const remove = (idx) => onChange(faqs.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <div key={i} className="space-y-2 rounded-xl border border-[#a8451a]/15 p-3">
          <div className="flex items-center gap-2">
            <input
              placeholder="Question"
              value={f.question}
              onChange={(e) => update(i, "question", e.target.value)}
              className={inputClass}
            />
            <button type="button" onClick={() => remove(i)} className="shrink-0 rounded-lg p-2 text-[#2b1d12]/70 hover:bg-white hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <textarea
            placeholder="Answer"
            rows={2}
            value={f.answer}
            onChange={(e) => update(i, "answer", e.target.value)}
            className={inputClass}
          />
        </div>
      ))}

      <button type="button" onClick={add} className="flex items-center gap-1.5 text-sm text-[#a8451a] hover:text-[#a8451a]">
        <Plus className="h-4 w-4" /> Add FAQ
      </button>
    </div>
  );
}
