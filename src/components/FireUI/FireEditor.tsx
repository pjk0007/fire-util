import sanitizeHtml from '@/lib/FireChat/utils/sanitizeHtml';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react';

interface FireEditorProps {
  defaultHTML?: string;
  onChange?: (html: string) => void;
  className?: string;
  placeholder?: string;
}

export default function FireEditor({
  defaultHTML = '',
  onChange,
  className,
  placeholder = '여기에 입력하세요…',
}: FireEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState<string>(sanitizeHtml(defaultHTML || '<br>'));

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = html || '<br>';
  }, []); // 초기 mount 시 1회

  const syncFromDOM = () => {
    if (!ref.current) return;
    const safe = sanitizeHtml(ref.current.innerHTML || '');
    setHtml(safe);
    onChange?.(safe);
  };

  // 현재 selection range (contenteditable 내부인지 확인)
  const getLiveRange = (): Range | null => {
    const root = ref.current;
    if (!root) return null;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const r = sel.getRangeAt(0);
    // selection이 root 내부인지 검사
    let n: Node | null = r.commonAncestorContainer;
    while (n && n !== root) n = n.parentNode;
    if (n !== root) return null;
    return r;
  };

  // 문자열 HTML → DocumentFragment
  const htmlToFragment = (safeHTML: string): DocumentFragment => {
    const tpl = document.createElement('template');
    tpl.innerHTML = safeHTML;
    return tpl.content;
  };

  // 커서를 특정 노드 뒤로 이동
  const placeCaretAfterNode = (node: Node) => {
    const sel = window.getSelection();
    if (!sel) return;
    const r = document.createRange();
    r.setStartAfter(node);
    r.collapse(true);
    sel.removeAllRanges();
    sel.addRange(r);
  };

  // 커서 위치에 HTML fragment 삽입
  const insertHTML = (safeHTML: string) => {
    const r = getLiveRange();
    if (!r) return;
    const frag = htmlToFragment(safeHTML);
    r.deleteContents();
    // 마지막 삽입된 노드를 추적해서 커서를 그 뒤로
    const last = frag.lastChild ?? document.createTextNode('');
    r.insertNode(frag);
    placeCaretAfterNode(last);
  };

  // 줄바꿈 (<br>) 삽입
  const insertLineBreak = () => {
    const r = getLiveRange();
    if (!r) return;
    r.deleteContents();
    const br = document.createElement('br');
    r.insertNode(br);
    placeCaretAfterNode(br);
  };

  // 마지막 줄에 <br> 보장(커서가 항상 내려갈 수 있게)
  const ensureTrailingBr = () => {
    const root = ref.current;
    if (!root) return;
    if (!root.lastChild) {
      root.appendChild(document.createElement('br'));
      return;
    }
    const last = root.lastChild;
    if (last.nodeName === 'BR') return;
    if (last.nodeType === Node.ELEMENT_NODE) {
      const el = last as HTMLElement;
      if (!el.lastChild || el.lastChild.nodeName !== 'BR') {
        el.appendChild(document.createElement('br'));
      }
    } else {
      root.appendChild(document.createElement('br'));
    }
  };

  // 인라인 스타일: 선택 래핑
  const wrapSelection = (styler: (span: HTMLSpanElement) => void) => {
    const r = getLiveRange();
    if (!r) return;
    if (r.collapsed) return;
    const span = document.createElement('span');
    styler(span);
    try {
      r.surroundContents(span);
      placeCaretAfterNode(span);
    } catch {
      // 부분 겹침 등으로 surround 실패 시 extract→append→insert
      const frag = r.extractContents();
      span.appendChild(frag);
      r.insertNode(span);
      placeCaretAfterNode(span);
    }
  };

  // 툴바 액션
  const applyBold = () => wrapSelection((s) => (s.style.fontWeight = '700'));
  const applyColor = (color: string) => wrapSelection((s) => (s.style.color = color));
  const clearFormatting = () => {
    const r = getLiveRange();
    if (!r) return;
    if (r.collapsed) return;
    const text = r.toString();
    r.deleteContents();
    const tn = document.createTextNode(text);
    r.insertNode(tn);
    placeCaretAfterNode(tn);
    ensureTrailingBr();
    syncFromDOM();
  };

  // 키/이벤트
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Shift+Enter도 동일하게 <br> (원하시면 분기 가능)
      insertLineBreak();
      ensureTrailingBr();
      syncFromDOM();
      return;
    }
    // Cmd/Ctrl+B, Cmd/Ctrl+K 같은 단축키 예시
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      applyBold();
      ensureTrailingBr();
      syncFromDOM();
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log(e.clipboardData.types);
    console.log(e.clipboardData.items.length);
    
    console.log(e.clipboardData.getData('text/plain'));
    
    const rawHtml = e.clipboardData.getData('text/html');
    const rawText = e.clipboardData.getData('text/plain');
    const safe = sanitizeHtml(rawHtml || rawText.replace(/\n/g, '<br>'));
    insertHTML(safe);
    ensureTrailingBr();
    syncFromDOM();
  };

  const onInput = () => {
    ensureTrailingBr();
    syncFromDOM();
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button className="px-2 py-1 border rounded" onClick={applyBold}>Bold</button>
        <button className="px-2 py-1 border rounded" onClick={() => applyColor('#e11d48')}>Red</button>
        <button className="px-2 py-1 border rounded" onClick={() => applyColor('#2563eb')}>Blue</button>
        <button className="px-2 py-1 border rounded" onClick={clearFormatting}>Clear</button>
      </div>

      <div
        ref={ref}
        className={cn(
          'prose max-w-none w-full min-h-40 rounded-2xl border p-4 outline-none',
          'focus:ring-2 focus:ring-primary/30',
          'fire-editor'
        )}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onInput={onInput}
      />
    </div>
  );
}
