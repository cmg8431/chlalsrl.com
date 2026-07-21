/**
 * 한글을 두벌식 키보드로 칠 때의 QWERTY 문자열로 변환한다.
 * 도메인 chlalsrl 은 "최민기"를 두벌식으로 친 결과다.
 */

const CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ".split("");
const JUNG = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ".split("");
const JONG =
  " ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ".split("");

/** 낱자모 → QWERTY 키. 겹자모/이중모음은 구성 낱자로 분해한다. */
const KEY: Record<string, string> = {
  ㅂ: "q", ㅈ: "w", ㄷ: "e", ㄱ: "r", ㅅ: "t",
  ㅛ: "y", ㅕ: "u", ㅑ: "i", ㅐ: "o", ㅔ: "p",
  ㅁ: "a", ㄴ: "s", ㅇ: "d", ㄹ: "f", ㅎ: "g",
  ㅗ: "h", ㅓ: "j", ㅏ: "k", ㅣ: "l",
  ㅋ: "z", ㅌ: "x", ㅊ: "c", ㅍ: "v", ㅠ: "b", ㅜ: "n", ㅡ: "m",
  ㅃ: "Q", ㅉ: "W", ㄸ: "E", ㄲ: "R", ㅆ: "T", ㅒ: "O", ㅖ: "P",
};

/** 겹받침·이중모음 → 낱자 시퀀스 */
const SPLIT: Record<string, string> = {
  ㅘ: "ㅗㅏ", ㅙ: "ㅗㅐ", ㅚ: "ㅗㅣ", ㅝ: "ㅜㅓ", ㅞ: "ㅜㅔ",
  ㅟ: "ㅜㅣ", ㅢ: "ㅡㅣ",
  ㄳ: "ㄱㅅ", ㄵ: "ㄴㅈ", ㄶ: "ㄴㅎ", ㄺ: "ㄹㄱ", ㄻ: "ㄹㅁ",
  ㄼ: "ㄹㅂ", ㄽ: "ㄹㅅ", ㄾ: "ㄹㅌ", ㄿ: "ㄹㅍ", ㅀ: "ㄹㅎ", ㅄ: "ㅂㅅ",
};

function jamoToKeys(jamo: string): string {
  const parts = SPLIT[jamo] ?? jamo;
  let out = "";
  for (const ch of parts) out += KEY[ch] ?? "";
  return out;
}

export function hangulToQwerty(text: string): string {
  let out = "";
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code >= 0xac00 && code <= 0xd7a3) {
      const s = code - 0xac00;
      const cho = Math.floor(s / (21 * 28));
      const jung = Math.floor((s % (21 * 28)) / 28);
      const jong = s % 28;
      out += jamoToKeys(CHO[cho]!) + jamoToKeys(JUNG[jung]!);
      if (jong > 0) out += jamoToKeys(JONG[jong]!);
    } else if (KEY[ch] || SPLIT[ch]) {
      out += jamoToKeys(ch);
    } else {
      out += ch;
    }
  }
  return out;
}
