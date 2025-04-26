"use client";
import React, { useState, useEffect } from "react";
import {
    Bold, Italic, AlignLeft, AlignCenter, AlignRight,
    Save, X, Edit2, Undo, Redo, Type, Palette,
    List, ListOrdered
} from "lucide-react";

interface FreeTextEditorProps {
    value?: string;
    onSave: (content: string, style: Record<string, string>) => void;
    placeholder?: string;
}

interface EditorState {
    content: string;
    style: Record<string, string>;
}

interface ToolbarButtonProps {
    onClick: () => void;
    icon: React.ComponentType<{ size?: number }>;
    title: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ onClick, icon: Icon, title }) => (
    <button
        onClick={onClick}
        className="p-2 rounded hover:bg-gray-100 transition-colors"
        title={title}
    >
        <Icon size={18} />
    </button>
);

const FreeTextEditor: React.FC<FreeTextEditorProps> = ({ value = "", onSave, placeholder }) => {
    const [isEditing, setIsEditing] = useState<boolean>(true);
    const [content, setContent] = useState<string>(value);
    const [history, setHistory] = useState<EditorState[]>([
        {
            content: value,
            style: {
                fontWeight: "normal",
                fontStyle: "normal",
                textAlign: "left",
                color: "#000000",
                backgroundColor: "transparent",
                fontSize: "16px",
                fontFamily: "Arial",
                lineHeight: "1.5",
                letterSpacing: "normal",
            },
        },
    ]);
    const [historyIndex, setHistoryIndex] = useState<number>(0);
    const [style, setStyle] = useState<Record<string, string>>(history[0].style);

    useEffect(() => {
        setContent(value);
        // Only reset style if it's the initial mount
        if (history.length === 1 && history[0].content === "") {
            setStyle({
                fontWeight: "normal",
                fontStyle: "normal",
                textAlign: "left",
                color: "#000000",
                backgroundColor: "transparent",
                fontSize: "16px",
                fontFamily: "Arial",
                lineHeight: "1.5",
                letterSpacing: "normal",
            });
        }
    }, [value]);

    useEffect(() => {
        const currentState: EditorState = { content, style };
        if (
            content !== history[historyIndex]?.content ||
            JSON.stringify(style) !== JSON.stringify(history[historyIndex]?.style)
        ) {
            const newHistory = history.slice(0, historyIndex + 1);
            setHistory([...newHistory, currentState]);
            setHistoryIndex(newHistory.length);
        }
    }, [content, style]);

    const handleUndo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            const previousState = history[historyIndex - 1];
            setContent(previousState.content);
            setStyle(previousState.style);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            const nextState = history[historyIndex + 1];
            setContent(nextState.content);
            setStyle(nextState.style);
        }
    };

    const handleListFormat = (type: "bullet" | "numbered") => {
        const lines = content.split("\n");
        let formattedContent: string;

        if (type === "bullet") {
            formattedContent = lines.map((line) => (line.trim() ? `• ${line}` : line)).join("\n");
        } else {
            formattedContent = lines
                .map((line, index) => (line.trim() ? `${index + 1}. ${line}` : line))
                .join("\n");
        }

        setContent(formattedContent);
    };

    const handleSave = () => {
        onSave(content, style);
        setIsEditing(false);
    };

    if (!isEditing) {
        return (
            <div className="mt-2">
                {content ? (
                    <div style={style} className="p-3 border rounded-lg mb-2 min-h-[100px]">
                        {content}
                    </div>
                ) : null}
                <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center text-blue-600 gap-2 bg-white cursor-pointer border-none p-2"
                >
                    <Edit2 size={16} /> Edit
                </button>
            </div>
        );
    }

    return (
        <div className="border rounded-lg p-3 mt-2 shadow-sm text-black">
            {/* Toolbar */}
            <div className="flex gap-3 mb-2 flex-wrap pb-2">
                {/* Text Formatting */}
                <div className="flex gap-2 items-center border-r pr-3">
                    <ToolbarButton
                        onClick={() => setStyle((prev) => ({ ...prev, fontWeight: prev.fontWeight === "bold" ? "normal" : "bold" }))}
                        icon={Bold}
                        title="Bold"
                    />
                    <ToolbarButton
                        onClick={() => setStyle((prev) => ({ ...prev, fontStyle: prev.fontStyle === "italic" ? "normal" : "italic" }))}
                        icon={Italic}
                        title="Italic"
                    />
                </div>

                {/* Text Alignment */}
                <div className="flex gap-2 items-center border-r pr-3">
                    <ToolbarButton onClick={() => setStyle((prev) => ({ ...prev, textAlign: "left" }))} icon={AlignLeft} title="Align Left" />
                    <ToolbarButton onClick={() => setStyle((prev) => ({ ...prev, textAlign: "center" }))} icon={AlignCenter} title="Center" />
                    <ToolbarButton onClick={() => setStyle((prev) => ({ ...prev, textAlign: "right" }))} icon={AlignRight} title="Align Right" />
                </div>

                {/* Lists */}
                <div className="flex gap-2 items-center border-r pr-3">
                    <ToolbarButton onClick={() => handleListFormat("bullet")} icon={List} title="Bullet List" />
                    <ToolbarButton onClick={() => handleListFormat("numbered")} icon={ListOrdered} title="Numbered List" />
                </div>

                {/* Font Size, Family, and Line Height */}
                <div className="flex gap-2 items-center border-r pr-3">
                    <select
                        onChange={(e) => setStyle((prev) => ({ ...prev, fontSize: e.target.value }))}
                        className="border rounded p-1 text-sm bg-white"
                        value={style.fontSize}
                        title="Font Size"
                    >
                        {[12, 14, 16, 18, 20, 24, 28, 32].map((size) => (
                            <option key={size} value={`${size}px`}>{size}px</option>
                        ))}
                    </select>
                    <select
                        onChange={(e) => setStyle((prev) => ({ ...prev, fontFamily: e.target.value }))}
                        className="border rounded p-1 text-sm bg-white"
                        value={style.fontFamily}
                        title="Font Family"
                    >
                        {["Arial", "Times New Roman", "Verdana", "Georgia", "Courier New", "Tahoma", "Sans-serif"].map((font) => (
                            <option key={font} value={font}>{font}</option>
                        ))}
                    </select>
                    <select
                        onChange={(e) => setStyle((prev) => ({ ...prev, lineHeight: e.target.value }))}
                        className="border rounded p-1 text-sm bg-white"
                        value={style.lineHeight}
                        title="Line Height"
                    >
                        {["1", "1.15", "1.5", "2", "2.5", "3"].map((height) => (
                            <option key={height} value={height}>{height}x</option>
                        ))}
                    </select>
                </div>

                {/* Text and Background Color */}
                <div className="flex gap-2 items-center">
                    <div className="relative">
                        <ToolbarButton
                            onClick={() => document.getElementById("textColorPicker")?.click()}
                            icon={Type}
                            title="Text Color"
                        />
                        <input
                            type="color"
                            id="textColorPicker"
                            value={style.color}
                            onChange={(e) => setStyle((prev) => ({ ...prev, color: e.target.value }))}
                            className="absolute w-0 h-0 opacity-0"
                        />
                    </div>
                    <div className="relative">
                        <ToolbarButton
                            onClick={() => document.getElementById("bgColorPicker")?.click()}
                            icon={Palette}
                            title="Background Color"
                        />
                        <input
                            type="color"
                            id="bgColorPicker"
                            value={style.backgroundColor === "transparent" ? "#ffffff" : style.backgroundColor}
                            onChange={(e) => setStyle((prev) => ({ ...prev, backgroundColor: e.target.value }))}
                            className="absolute w-0 h-0 opacity-0"
                        />
                    </div>
                </div>
            </div>

            {/* Textarea */}
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[200px] border rounded p-2 mb-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder={placeholder}
                style={style}
            />

            {/* Save and Cancel Buttons */}
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <ToolbarButton onClick={handleUndo} icon={Undo} title="Undo" />
                    <ToolbarButton onClick={handleRedo} icon={Redo} title="Redo" />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Save size={20} /> Save
                    </button>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-2 border border-gray-300 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X size={20} /> Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FreeTextEditor;