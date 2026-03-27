import { useMemo } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const modules = {
    toolbar: [
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
    ],
};

const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "link",
];

export default function RichTextEditor({
    value,
    onChange,
    placeholder,
    editorKey,
}) {
    // Ensure value is always a string
    const safeValue = useMemo(() => value || "", [value]);
    return (
        <div className="rich-text-editor">
            <style>{`
                .rich-text-editor .ql-container {
                    background: rgba(0, 0, 0, 0.2);
                    border: none;
                    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    font-size: 14px;
                    min-height: 100px;
                }
                .rich-text-editor .ql-container:focus-within {
                    border-bottom-color: #22d3ee;
                }
                .rich-text-editor .ql-editor {
                    padding: 12px;
                    min-height: 100px;
                }
                .rich-text-editor .ql-editor.ql-blank::before {
                    color: rgba(255, 255, 255, 0.4);
                    font-style: normal;
                }
                .rich-text-editor .ql-toolbar {
                    background: rgba(0, 0, 0, 0.3);
                    border: none;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                .rich-text-editor .ql-toolbar .ql-stroke {
                    stroke: rgba(255, 255, 255, 0.6);
                }
                .rich-text-editor .ql-toolbar .ql-fill {
                    fill: rgba(255, 255, 255, 0.6);
                }
                .rich-text-editor .ql-toolbar .ql-picker {
                    color: rgba(255, 255, 255, 0.6);
                }
                .rich-text-editor .ql-toolbar .ql-picker-options {
                    background: #0a121d;
                    border: 1px solid rgba(34, 211, 238, 0.3);
                }
                .rich-text-editor .ql-toolbar button:hover .ql-stroke,
                .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
                    stroke: #22d3ee;
                }
                .rich-text-editor .ql-toolbar button:hover .ql-fill,
                .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
                    fill: #22d3ee;
                }
                .rich-text-editor .ql-toolbar .ql-picker-label:hover,
                .rich-text-editor .ql-toolbar .ql-picker-label.ql-active {
                    color: #22d3ee;
                }
                .rich-text-editor .ql-snow.ql-toolbar button:hover,
                .rich-text-editor .ql-snow .ql-toolbar button:hover {
                    color: #22d3ee;
                }
                .rich-text-editor .ql-editor a {
                    color: #22d3ee;
                }
            `}</style>
            <ReactQuill
                key={editorKey}
                theme="snow"
                value={safeValue}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
            />
        </div>
    );
}
