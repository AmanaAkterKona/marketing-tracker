import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Sparkles,
  Info
} from 'lucide-react';

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  onOpenMediaPicker?: (onSelect: (url: string, alt?: string) => void) => void;
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({
  content,
  onChange,
  onOpenMediaPicker
}) => {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4]
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'rounded-xl bg-[#0f2d3a] text-slate-100 p-4 font-mono text-sm overflow-x-auto my-4'
          }
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-teal-600 bg-teal-50/60 pl-4 py-2 my-4 italic text-slate-700'
          }
        }
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-teal-700 underline font-medium hover:text-teal-900'
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full my-6 border border-slate-200 shadow-sm'
        }
      })
    ],
    content: content || '<p>Write your article here...</p>',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  if (!editor) {
    return <div className="p-8 text-center text-slate-400 font-mono text-xs">Loading editor...</div>;
  }

  const setLink = () => {
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }
    setShowLinkModal(false);
    setLinkUrl('');
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt }).run();
      setShowImageModal(false);
      setImageUrl('');
      setImageAlt('');
    }
  };

  const handleMediaPick = () => {
    if (onOpenMediaPicker) {
      onOpenMediaPicker((url, alt) => {
        editor.chain().focus().setImage({ src: url, alt: alt || '' }).run();
      });
    } else {
      setShowImageModal(true);
    }
  };

  const insertCallout = () => {
    editor.chain().focus().insertContent(`
      <blockquote class="border-l-4 border-teal-600 bg-teal-50/70 p-4 my-4 rounded-r-lg text-slate-800 not-italic">
        <p><strong>Technical Note:</strong> Add critical signal parameter or verification advice here.</p>
      </blockquote>
    `).run();
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 text-slate-700">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded hover:bg-teal-50 ${editor.isActive('heading', { level: 2 }) ? 'bg-teal-100 text-teal-800 font-bold' : ''}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded hover:bg-teal-50 ${editor.isActive('heading', { level: 3 }) ? 'bg-teal-100 text-teal-800 font-bold' : ''}`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-teal-50 ${editor.isActive('bold') ? 'bg-teal-100 text-teal-800' : ''}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-teal-50 ${editor.isActive('italic') ? 'bg-teal-100 text-teal-800' : ''}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-teal-50 ${editor.isActive('bulletList') ? 'bg-teal-100 text-teal-800' : ''}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-teal-50 ${editor.isActive('orderedList') ? 'bg-teal-100 text-teal-800' : ''}`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-teal-50 ${editor.isActive('blockquote') ? 'bg-teal-100 text-teal-800' : ''}`}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded hover:bg-teal-50 ${editor.isActive('codeBlock') ? 'bg-teal-100 text-teal-800' : ''}`}
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={insertCallout}
          className="p-1.5 rounded hover:bg-teal-50 text-teal-600"
          title="Insert Callout Box"
        >
          <Info className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => {
            const prevUrl = editor.getAttributes('link').href;
            setLinkUrl(prevUrl || '');
            setShowLinkModal(true);
          }}
          className={`p-1.5 rounded hover:bg-teal-50 ${editor.isActive('link') ? 'bg-teal-100 text-teal-800' : ''}`}
          title="Add or Edit Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleMediaPick}
          className="p-1.5 rounded hover:bg-teal-50 text-slate-700"
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded hover:bg-teal-50 disabled:opacity-30"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded hover:bg-teal-50 disabled:opacity-30"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* TipTap Document Area */}
      <div className="p-6 min-h-[380px] bg-white cursor-text text-[#0f2d3a] leading-relaxed focus:outline-none article-prose">
        <EditorContent editor={editor} />
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com or /conversion-tracking"
            className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setLink();
              }
            }}
          />
          <button
            type="button"
            onClick={setLink}
            className="px-3 py-1.5 text-xs bg-teal-700 text-white rounded font-medium hover:bg-teal-600"
          >
            Apply Link
          </button>
          <button
            type="button"
            onClick={() => setShowLinkModal(false)}
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-teal-700"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL (https://... or /uploads/...)"
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
            />
            <input
              type="text"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="Descriptive alt text"
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowImageModal(false)}
              className="px-3 py-1 text-xs text-slate-600 hover:text-teal-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addImage}
              className="px-3 py-1 text-xs bg-teal-700 text-white rounded font-medium hover:bg-teal-600"
            >
              Insert Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};