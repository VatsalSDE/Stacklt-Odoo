"use client"

import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Emoji from "@tiptap/extension-emoji";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { Smile, Bold as BoldIcon, Italic as ItalicIcon, Strikethrough, List, ListOrdered, Link as LinkIcon, ImageIcon, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Strike,
      BulletList,
      OrderedList,
      ListItem,
      Link.configure({ openOnClick: false }),
      Image,
      Emoji,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: placeholder || "Start typing..." }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "min-h-[200px] p-4 outline-none bg-transparent",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
    // eslint-disable-next-line
  }, [value]);

  if (!editor) return <div className="border rounded-xl bg-background/50 min-h-[200px] p-4 animate-pulse" />;

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        editor.chain().focus().setImage({ src: reader.result }).run();
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`border rounded-xl bg-background/50 backdrop-blur-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/50 ${className}`}>
      <div className="flex flex-wrap gap-1 p-3 border-b bg-muted/30 rounded-t-xl items-center">
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-primary/10' : ''}><BoldIcon className="h-4 w-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-primary/10' : ''}><ItalicIcon className="h-4 w-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'bg-primary/10' : ''}><Strikethrough className="h-4 w-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-primary/10' : ''}><List className="h-4 w-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-primary/10' : ''}><ListOrdered className="h-4 w-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => {
          const url = prompt("Enter URL");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }} className={editor.isActive('link') ? 'bg-primary/10' : ''}><LinkIcon className="h-4 w-4" /></Button>
        <label className="inline-flex items-center cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          <span><Button type="button" variant="ghost" size="sm"><ImageIcon className="h-4 w-4" /></Button></span>
        </label>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().insertContent('😊').run()}><Smile className="h-4 w-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'bg-primary/10' : ''}><AlignLeft className="h-4 w-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'bg-primary/10' : ''}><AlignCenter className="h-4 w-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'bg-primary/10' : ''}><AlignRight className="h-4 w-4" /></Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
