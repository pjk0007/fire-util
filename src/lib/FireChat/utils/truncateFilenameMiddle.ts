// 1) 한 글자의 화면 폭 계산 (대부분 케이스 커버: CJK/이모지=2, 그 외=1)
function charDisplayWidth(grapheme:string) {
  // 이모지(대부분) 폭 2로 취급
  // Variation Selector, ZWJ 등 조합도 있으니 그래프림 단위 입력 전제
  if (/\p{Extended_Pictographic}/u.test(grapheme)) return 2;

  // 동아시아 전각/넓은 문자 범위 (한글 포함) => 폭 2
  if (/[\u1100-\u115F\u2E80-\uA4CF\uAC00-\uD7A3\uF900-\uFAFF\uFE10-\uFE19\uFE30-\uFE6F\uFF00-\uFF60\uFFE0-\uFFE6]/.test(grapheme)) {
    return 2;
  }

  // 그 외는 폭 1
  return 1;
}

// 2) 문자열을 그래프림(사용자 눈에 보이는 문자 단위) 배열로 분해
function splitGraphemes(str:string) {
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    const seg = new Intl.Segmenter("ko", { granularity: "grapheme" });
    return [...seg.segment(str)].map(s => s.segment);
  }
  // 폴백(완벽하진 않지만 대부분 안전)
  return Array.from(str);
}

// 3) 가시 폭 계산
function displayWidth(str:string) {
  return splitGraphemes(str).reduce((w, g) => w + charDisplayWidth(g), 0);
}

// 4) 가시 폭 기준 중간 말줄임 (본문만; 확장자 제외)
function truncateMiddleByDisplayWidth(body:string, maxWidth:number, ellipsis:string = "...") {
  const chars = splitGraphemes(body);
  const ellW = displayWidth(ellipsis);
  if (displayWidth(body) <= maxWidth) return body;
  if (maxWidth <= ellW + 1) {
    // 너무 짧으면 첫 글자 + … 로만
    const first = chars[0] ?? "";
    return first + ellipsis;
  }

  // 앞/뒤를 가시 폭 기준으로 분배
  const target = maxWidth - ellW;
  const leftTarget = Math.floor(target / 2);
  const rightTarget = target - leftTarget;

  // 왼쪽 누적
  let left = "";
  let lw = 0;
  for (const g of chars) {
    const w = charDisplayWidth(g);
    if (lw + w > leftTarget) break;
    left += g; lw += w;
  }

  // 오른쪽 누적
  let right = "";
  let rw = 0;
  for (let i = chars.length - 1; i >= 0; i--) {
    const g = chars[i];
    const w = charDisplayWidth(g);
    if (rw + w > rightTarget) break;
    right = g + right; rw += w;
  }

  return left + ellipsis + right;
}

// 5) 파일명 전용: 확장자 유지 + 가시 폭 기준 중간 말줄임
export default function truncateFilenameMiddle(filename:string, maxWidth:number = 12, ellipsis:string = "...") {
  const dot = filename.lastIndexOf(".");
  const name = dot >= 0 ? filename.slice(0, dot) : filename;
  const ext = dot >= 0 ? filename.slice(dot) : "";

  // 확장자도 화면 폭 차지하므로, 본문이 차지할 수 있는 폭 계산
  const extW = displayWidth(ext);
  const bodyMax = Math.max(1, maxWidth - extW);
  const body = truncateMiddleByDisplayWidth(name, bodyMax, ellipsis);

  return body + ext;
}
