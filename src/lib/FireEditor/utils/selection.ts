export type SelectionPathInfo = {
  anchorPath: number[];
  anchorOffset: number;
  focusPath: number[];
  focusOffset: number;
  isBackward: boolean;
};

export function getNodePath(node: Node, rootNode: Node): number[] {
  const path: number[] = [];
  let cur: Node | null = node;
  while (cur && cur !== rootNode) {
    const parent: Node | null = cur.parentNode;
    if (!parent) break;
    const idx = Array.prototype.indexOf.call((parent as Node).childNodes, cur);
    path.unshift(idx);
    cur = parent;
  }
  return path;
}

export function getNodeFromPath(rootNode: Node, path: number[]): Node | null {
  let cur: Node | null = rootNode;
  for (const idx of path) {
    if (!cur || !cur.childNodes || idx >= cur.childNodes.length) return null;
    cur = cur.childNodes[idx];
  }
  return cur;
}

export function saveSelectionPath(root: Node, range: Range): SelectionPathInfo {
  const anchorPath = getNodePath(range.startContainer, root);
  const focusPath = getNodePath(range.endContainer, root);
  let isBackward = false;
  try {
    const temp = window.document.createRange();
    temp.setStart(range.startContainer, range.startOffset);
    temp.setEnd(range.endContainer, range.endOffset);
    isBackward = temp.collapsed;
  } catch (e) {
    console.error('Failed to determine if selection is backward:', e);
    isBackward = false;
  }
  return {
    anchorPath,
    anchorOffset: range.startOffset,
    focusPath,
    focusOffset: range.endOffset,
    isBackward,
  };
}

export function restoreSelectionPath(root: Node, info: SelectionPathInfo) {
  const anchorNode = getNodeFromPath(root, info.anchorPath) ?? root;
  const focusNode = getNodeFromPath(root, info.focusPath) ?? root;
  const range = window.document.createRange();
  const anchorMax = anchorNode.nodeType === Node.TEXT_NODE ? (anchorNode.textContent?.length ?? 0) : anchorNode.childNodes.length;
  const focusMax = focusNode.nodeType === Node.TEXT_NODE ? (focusNode.textContent?.length ?? 0) : focusNode.childNodes.length;
  range.setStart(anchorNode, Math.min(info.anchorOffset, anchorMax));
  range.setEnd(focusNode, Math.min(info.focusOffset, focusMax));
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
}
