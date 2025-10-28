// Simple, reversible encodings for educational use only
function base64Encode(text) {
  return Buffer.from(text, 'utf8').toString('base64');
}

function base64Decode(b64) {
  return Buffer.from(b64, 'base64').toString('utf8');
}

function caesarEncode(text, shift = 3) {
  return text.replace(/[a-z]/gi, (c) => {
    const base = c >= 'a' && c <= 'z' ? 'a'.charCodeAt(0) : 'A'.charCodeAt(0);
    const code = c.charCodeAt(0) - base;
    return String.fromCharCode(((code + shift) % 26) + base);
  });
}

function caesarDecode(text, shift = 3) {
  return caesarEncode(text, 26 - (shift % 26));
}

module.exports = {
  base64Encode,
  base64Decode,
  caesarEncode,
  caesarDecode,
};
