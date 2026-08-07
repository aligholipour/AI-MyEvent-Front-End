import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Smile, List } from 'lucide-react';

function RichTextEditor({
  value,
  onChange,
  placeholder,
  error
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  error?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || 'شروع به نوشتن کنید...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojis = ['😊', '😂', '😍', '🤔', '🙌', '🎉', '🔥', '✨', '📍', '💡', '✅', '❌'];

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-2">
        <label className="text-xs font-black text-gray-500">توضیحات</label>
        {error && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[10px] font-bold text-[#ED1C24]"
          >
            {error}
          </motion.span>
        )}
      </div>

      <div className={`bg-gray-100 border rounded-2xl overflow-hidden transition-all focus-within:ring-2 focus-within:ring-gray-900/5 ${error ? 'border-[#ED1C24]' : 'border-gray-100'}`}>
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
          <button
            onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
            className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
            className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <Italic className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-gray-300 mx-1" />
          <button
            onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
            className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <List className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-gray-300 mx-1" />
          <div className="relative">
            <button
              onClick={(e) => { e.preventDefault(); setShowEmojiPicker(!showEmojiPicker); }}
              className={`p-2 rounded-lg transition-colors ${showEmojiPicker ? 'bg-white text-amber-500 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <Smile className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {showEmojiPicker && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowEmojiPicker(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute top-full left-0 mt-2 p-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 grid grid-cols-4 gap-1 min-w-[120px]"
                  >
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={(e) => {
                          e.preventDefault();
                          editor.chain().focus().insertContent(emoji).run();
                          setShowEmojiPicker(false);
                        }}
                        className="text-lg p-1 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 min-h-[160px] text-sm font-bold text-gray-900 focus:outline-none description-editor">
          <EditorContent editor={editor} />
        </div>
      </div>

      <style>{`
        .description-editor .ProseMirror {
          min-height: 120px;
          outline: none;
        }
        .description-editor .ProseMirror p {
           margin-bottom: 0.5rem;
           line-height: 1.6;
        }
        .description-editor .ProseMirror ul {
          list-style-type: disc;
          padding-right: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .description-editor .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: right;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}

export default RichTextEditor;