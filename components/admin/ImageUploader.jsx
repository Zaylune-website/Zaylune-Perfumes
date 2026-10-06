"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Star, X } from "lucide-react";

export default function ImageUploader({
  value,
  onChange,
  multiple = false,
  folder = "zaylune",
  previewClassName = "h-24 w-24",
  showCoverPicker = false,
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const urls = multiple ? value || [] : value ? [value] : [];

  const handleFiles = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    const newUrls = [];
    for (const file of Array.from(files)) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", `/${folder}`);
        const res = await fetch("/api/imagekit/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) newUrls.push(data.url);
      } catch {}
    }
    setUploading(false);
    if (!newUrls.length) return;
    if (multiple) {
      const next = [...(value || []), ...newUrls];
      onChange(next);
    } else {
      onChange(newUrls[0]);
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeAt = (idx) => {
    if (multiple) onChange((value || []).filter((_, i) => i !== idx));
    else onChange(null);
  };

  const setCover = (idx) => {
    if (idx === 0) return;
    const rest = urls.filter((_, i) => i !== idx);
    onChange([urls[idx], ...rest]);
  };

  const showCover = multiple && showCoverPicker && urls.length > 1;

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {urls.map((url, idx) => (
          <div
            key={url}
            className={`relative overflow-hidden rounded-xl border ${
              idx === 0 && showCover ? "border-[#a8451a]/60" : "border-[#a8451a]/15"
            } ${previewClassName}`}
          >
            <Image src={url} alt="" fill sizes="(max-width: 640px) 100vw, 448px" className="object-cover" />
            <button
              type="button"
              onClick={() => removeAt(idx)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
            >
              <X className="h-3 w-3" />
            </button>
            {showCover && (
              <button
                type="button"
                onClick={() => setCover(idx)}
                disabled={idx === 0}
                title={idx === 0 ? "Cover image" : "Set as cover image"}
                className={`absolute bottom-1 left-1 flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide backdrop-blur-sm ${
                  idx === 0
                    ? "bg-gold-gradient text-[#1c1109]"
                    : "bg-black/60 text-[#2b1d12]/82 hover:text-[#a8451a]"
                }`}
              >
                <Star className={`h-2.5 w-2.5 ${idx === 0 ? "fill-ink" : ""}`} />
                {idx === 0 ? "Cover" : "Set"}
              </button>
            )}
          </div>
        ))}

        {(multiple || urls.length === 0) && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#a8451a]/15 text-[#2b1d12]/70 transition-colors hover:border-[#a8451a]/50 hover:text-[#a8451a] disabled:opacity-50 ${previewClassName}`}
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ImagePlus className="h-5 w-5" />
            )}
            <span className="text-[10px]">{uploading ? "Uploading..." : "Upload"}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
