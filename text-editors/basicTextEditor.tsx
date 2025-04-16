// import React, { useState, useEffect, useRef } from 'react';
// import {
//     Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
//     List, ListOrdered, Type, Palette, Undo, Redo, Save, X, Link, Unlink,
//     Heading1, Heading2, Heading3, Quote, Code, Strikethrough, Minimize2, Maximize2,
//     Layout, Image
// } from 'lucide-react';

// interface BasicTextEditorProps {
//     value?: string;
//     onSave: (content: string, style: Record<string, string>) => void;
//     placeholder?: string;
// }

// const BasicTextEditor: React.FC<BasicTextEditorProps> = ({ value = '', onSave, placeholder }) => {
//     const [isEditing, setIsEditing] = useState(true);
//     const [content, setContent] = useState(value);
//     const [isFullscreen, setIsFullscreen] = useState(false);
//     const [showLinkInput, setShowLinkInput] = useState(false);
//     const [linkUrl, setLinkUrl] = useState('');
//     const [linkLabel, setLinkLabel] = useState('');
//     const [selectedText, setSelectedText] = useState('');

//     const [history, setHistory] = useState([{
//         content: value,
//         style: {
//             fontWeight: 'normal',
//             fontStyle: 'normal',
//             textDecoration: 'none',
//             textAlign: 'left',
//             color: '#000000',
//             backgroundColor: 'transparent',
//             fontSize: '16px',
//             fontFamily: 'Arial',
//             lineHeight: '1.5',
//             letterSpacing: 'normal',
//             textTransform: 'none',
//             padding: '0px',
//             margin: '0px',
//             borderRadius: '0px',
//             borderWidth: '0px',
//             borderStyle: 'none',
//             borderColor: 'transparent',
//             boxShadow: 'none',
//             opacity: '1'
//         }
//     }]);
//     const [historyIndex, setHistoryIndex] = useState(0);
//     const [style, setStyle] = useState(history[0].style);


//     useEffect(() => {
//         setContent(value);
//         setHistory([{
//             content: value,
//             style: history[0]?.style || {
//                 fontWeight: 'normal',
//                 fontStyle: 'normal',
//                 textDecoration: 'none',
//                 textAlign: 'left',
//                 color: '#000000',
//                 backgroundColor: 'transparent',
//                 fontSize: '16px',
//                 fontFamily: 'Arial',
//                 lineHeight: '1.5',
//                 letterSpacing: 'normal',
//                 textTransform: 'none',
//                 padding: '0px',
//                 margin: '0px',
//                 borderRadius: '0px',
//                 borderWidth: '0px',
//                 borderStyle: 'none',
//                 borderColor: 'transparent',
//                 boxShadow: 'none',
//                 opacity: '1'
//             }
//         }]);
//         setHistoryIndex(0);
//     }, [value]);

//     useEffect(() => {
//         const currentState = { content, style };
//         if (
//             content !== history[historyIndex].content ||
//             JSON.stringify(style) !== JSON.stringify(history[historyIndex].style)
//         ) {
//             const newHistory = history.slice(0, historyIndex + 1);
//             setHistory([...newHistory, currentState]);
//             setHistoryIndex(newHistory.length);
//         }
//     }, [content, style]);

//     const handleUndo = () => {
//         if (historyIndex > 0) {
//             setHistoryIndex(historyIndex - 1);
//             const previousState = history[historyIndex - 1];
//             setContent(previousState.content);
//             setStyle(previousState.style);
//         }
//     };

//     const handleRedo = () => {
//         if (historyIndex < history.length - 1) {
//             setHistoryIndex(historyIndex + 1);
//             const nextState = history[historyIndex + 1];
//             setContent(nextState.content);
//             setStyle(nextState.style);
//         }
//     };

//     interface ListFormatHandlerProps {
//         type: 'bullet' | 'numbered';
//     }

//     const handleListFormat = (type: ListFormatHandlerProps['type']): void => {
//         const lines: string[] = content.split('\n');

//         const updatedContent: string = lines.map((line, index) => {
//             const isBullet: boolean = line.startsWith('•');
//             const isNumbered: boolean = /^\d+\./.test(line);

//             if (type === 'bullet') {
//                 if (isBullet) return line.slice(2);
//                 return `• ${line.replace(/^\d+\.\s/, '')}`;
//             } else if (type === 'numbered') {
//                 if (isNumbered) return line.replace(/^\d+\.\s/, '');
//                 return `${index + 1}. ${line.replace(/^•\s/, '')}`;
//             }

//             return line;
//         }).join('\n');

//         setContent(updatedContent);
//     };

//     const editorRef = useRef(null);

//     const handleInput = (e) => {
//         setContent(e.target.innerHTML);
//     };

//     const editorElement = (
//         <div
//             ref={editorRef}
//             className="w-full min-h-[300px] border rounded p-4 focus:outline-none focus:ring-2 focus:ring-blue-200"
//             style={{ ...style, direction: 'ltr' }}
//             contentEditable
//             suppressContentEditableWarning
//             // dangerouslySetInnerHTML={{ __html: content }}
//             onInput={handleInput}
//             onMouseDown={(e) => {
//                 if (e.target.tagName === 'A') {
//                     e.preventDefault();
//                     window.open(e.target.href, '_blank');
//                 }
//             }}
//         />
//     );


//     const insertLink = () => {
//         if (linkUrl) {
//             const linkText = selectedText || linkLabel || 'Link';
//             const linkHtml = `<a href="${linkUrl}" target="_blank" style="color: blue; text-decoration: underline;">${linkText}</a>`;
//             const updatedContent = content + linkHtml;
//             setContent(updatedContent);
//             setLinkUrl('');
//             setLinkLabel('');
//             setShowLinkInput(false);
//         }
//     };

//     const handleCancel = () => {
//         setLinkUrl('');
//         setShowLinkInput(false);
//     };

//     const insertQuote = () => {
//         if (content) {
//             if (content.startsWith('"') && content.endsWith('"')) {
//                 const unquotedContent = content.slice(1, -1);
//                 setContent(unquotedContent);
//             } else {
//                 const quotedContent = `"${content}"`;
//                 setContent(quotedContent);
//             }
//         }
//     };


//     const applyHeading = (level) => {
//         const prefix = '#'.repeat(level) + ' ';
//         const lines = content.split('\n');
//         const updatedLines = lines.map(line =>
//             line.startsWith('#') ? line.replace(/^#+\s/, prefix) : prefix + line
//         );
//         setContent(updatedLines.join('\n'));
//     };

//     const ToolbarButton = ({ onClick, icon: Icon, title }) => (
//         <button
//             onClick={onClick}
//             className="p-2 rounded hover:bg-gray-100 transition-colors relative group"
//             title={title}
//         >
//             <Icon size={18} />
//             <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
//                 {title}
//             </div>
//         </button>
//     );

//     const editorClass = `
//     ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative'} 
//     transition-all duration-200
//   `;



//     return (
//         <div className={`${editorClass} bg-white rounded-lg shadow-lg border border-gray-200`}>
//             <div className="p-4">
//                 <div className="flex flex-wrap gap-2 mb-4 border-b pb-4">
//                     {/* Text Formatting */}
//                     <div className="flex gap-1 items-center border-r pr-2">
//                         <ToolbarButton onClick={() => setStyle(prev => ({ ...prev, fontWeight: prev.fontWeight === 'bold' ? 'normal' : 'bold' }))} icon={Bold} title="Bold" />
//                         <ToolbarButton onClick={() => setStyle(prev => ({ ...prev, fontStyle: prev.fontStyle === 'italic' ? 'normal' : 'italic' }))} icon={Italic} title="Italic" />
//                         <ToolbarButton onClick={() => setStyle(prev => ({ ...prev, textDecoration: prev.textDecoration === 'underline' ? 'none' : 'underline' }))} icon={Underline} title="Underline" />
//                         <ToolbarButton onClick={() => setStyle(prev => ({ ...prev, textDecoration: prev.textDecoration === 'line-through' ? 'none' : 'line-through' }))} icon={Strikethrough} title="Strikethrough" />
//                     </div>

//                     {/* Headings */}
//                     <div className="flex gap-1 items-center border-r pr-2">
//                         <ToolbarButton onClick={() => applyHeading(1)} icon={Heading1} title="Heading 1" />
//                         <ToolbarButton onClick={() => applyHeading(2)} icon={Heading2} title="Heading 2" />
//                         <ToolbarButton onClick={() => applyHeading(3)} icon={Heading3} title="Heading 3" />
//                     </div>

//                     {/* Alignment */}
//                     <div className="flex gap-1 items-center border-r pr-2">
//                         <ToolbarButton onClick={() => setStyle(prev => ({ ...prev, textAlign: 'left' }))} icon={AlignLeft} title="Align Left" />
//                         <ToolbarButton onClick={() => setStyle(prev => ({ ...prev, textAlign: 'center' }))} icon={AlignCenter} title="Center" />
//                         <ToolbarButton onClick={() => setStyle(prev => ({ ...prev, textAlign: 'right' }))} icon={AlignRight} title="Align Right" />
//                         <ToolbarButton onClick={() => setStyle(prev => ({ ...prev, textAlign: 'justify' }))} icon={AlignJustify} title="Justify" />
//                     </div>

//                     {/* Lists */}
//                     <div className="flex gap-1 items-center border-r pr-2">
//                         <ToolbarButton onClick={() => handleListFormat('bullet')} icon={List} title="Bullet List" />
//                         <ToolbarButton onClick={() => handleListFormat('numbered')} icon={ListOrdered} title="Numbered List" />
//                     </div>

//                     <div className="flex gap-1 items-center border-r pr-2">
//                         {/* Button to toggle the link input field */}
//                         <ToolbarButton
//                             onClick={() => setShowLinkInput(!showLinkInput)}
//                             icon={showLinkInput ? Unlink : Link}
//                             title="Insert Link"
//                         />

//                         {/* Button for inserting a block quote */}
//                         <ToolbarButton onClick={insertQuote} icon={Quote} title="Block Quote" />

//                         {/* Link Input Overlay */}
//                         {showLinkInput && (
//                             <div className="absolute inset-0 z-50 flex justify-center items-center bg-black/50">
//                                 <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-lg space-y-4">
//                                     <h2 className="text-2xl font-semibold text-gray-800">Insert Link</h2>

//                                     {/* Link Label Input */}
//                                     <input
//                                         type="text"
//                                         value={linkLabel}
//                                         onChange={(e) => setLinkLabel(e.target.value)}
//                                         placeholder="Link Label"
//                                         className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out bg-gray-50"
//                                     />

//                                     {/* Link URL Input */}
//                                     <input
//                                         type="text"
//                                         value={linkUrl}
//                                         onChange={(e) => setLinkUrl(e.target.value)}
//                                         placeholder="Enter URL"
//                                         className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out bg-gray-50"
//                                     />

//                                     <div className="flex justify-between items-center gap-3">
//                                         {/* Cancel Button */}
//                                         <button
//                                             onClick={handleCancel}
//                                             className="w-1/2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out"
//                                         >
//                                             Cancel
//                                         </button>

//                                         {/* Insert Button */}
//                                         <button
//                                             onClick={insertLink}
//                                             className="w-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
//                                         >
//                                             Insert
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                     </div>


//                     {/* Font Styling */}
//                     <div className="flex gap-1 items-center border-r pr-2">
//                         <select
//                             onChange={(e) => setStyle(prev => ({ ...prev, fontSize: e.target.value }))}
//                             className="border rounded p-1 text-sm"
//                             value={style.fontSize}
//                         >
//                             {[12, 14, 16, 18, 20, 24, 28, 32, 36, 48].map(size => (
//                                 <option key={size} value={`${size}px`}>{size}px</option>
//                             ))}
//                         </select>
//                         <select
//                             onChange={(e) => setStyle(prev => ({ ...prev, fontFamily: e.target.value }))}
//                             className="border rounded p-1 text-sm"
//                             value={style.fontFamily}
//                         >
//                             {[
//                                 'Arial', 'Times New Roman', 'Verdana', 'Georgia',
//                                 'Courier New', 'Tahoma', 'Helvetica', 'Trebuchet MS',
//                                 'Impact', 'Comic Sans MS'
//                             ].map(font => (
//                                 <option key={font} value={font}>{font}</option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* Colors */}
//                     <div className="flex gap-1 items-center border-r pr-2">
//                         <div className="relative">
//                             <input
//                                 type="color"
//                                 onChange={(e) => setStyle(prev => ({ ...prev, color: e.target.value }))}
//                                 className="absolute w-0 h-0 opacity-0"
//                                 id="textColor"
//                             />
//                             <ToolbarButton onClick={() => document.getElementById('textColor').click()} icon={Type} title="Text Color" />
//                         </div>
//                         <div className="relative">
//                             <input
//                                 type="color"
//                                 onChange={(e) => setStyle(prev => ({ ...prev, backgroundColor: e.target.value }))}
//                                 className="absolute w-0 h-0 opacity-0"
//                                 id="bgColor"
//                             />
//                             <ToolbarButton onClick={() => document.getElementById('bgColor').click()} icon={Palette} title="Background Color" />
//                         </div>
//                     </div>

//                     {/* View Controls */}
//                     <div className="flex gap-1 items-center">
//                         <ToolbarButton
//                             onClick={() => setIsFullscreen(!isFullscreen)}
//                             icon={isFullscreen ? Minimize2 : Maximize2}
//                             title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
//                         />
//                     </div>
//                 </div>



//                 {editorElement}

//                 {/* Bottom Controls */}
//                 <div className="flex justify-between items-center mt-4 pt-4 border-t">
//                     <div className="flex gap-2">
//                         <ToolbarButton onClick={handleUndo} icon={Undo} title="Undo" />
//                         <ToolbarButton onClick={handleRedo} icon={Redo} title="Redo" />
//                     </div>
//                     <div className="flex gap-2">
//                         <button
//                             onClick={() => onSave(content, style)}
//                             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
//                         >
//                             <Save size={20} /> Save
//                         </button>
//                         <button
//                             onClick={() => setIsEditing(false)}
//                             className="border px-4 py-2 rounded hover:bg-gray-100 flex items-center gap-2"
//                         >
//                             <X size={20} /> Cancel
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BasicTextEditor;


