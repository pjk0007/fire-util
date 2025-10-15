function truncateMiddleByLength(str: string, maxLen: number, ellipsis = "...") {
  if (str.length <= maxLen) return str;
  const ellLen = ellipsis.length;
  if (maxLen <= ellLen + 1) return str.slice(0, 1) + ellipsis;
  const leftLen = Math.floor((maxLen - ellLen) / 2);
  const rightLen = maxLen - ellLen - leftLen;
  return str.slice(0, leftLen) + ellipsis + str.slice(str.length - rightLen);
}

export default function truncateFilenameMiddle(
  filename: string,
  maxLen: number = 12,
  ellipsis: string = "..."
) {
  const dot = filename.lastIndexOf(".");
  const name = dot >= 0 ? filename.slice(0, dot) : filename;
  const ext = dot >= 0 ? filename.slice(dot) : "";
  const bodyMax = Math.max(1, maxLen - ext.length);
  const body = truncateMiddleByLength(name.normalize('NFC'), bodyMax, ellipsis);
  return body + ext;
}