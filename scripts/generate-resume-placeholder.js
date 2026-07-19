const fs = require("fs");
const path = require("path");

const lines = [
  "Himanshu Aashish",
  "Full-Stack Developer & Generative AI Engineer",
  "Bhubaneswar, Odisha, India",
  "Email: himanshuaashish4@gmail.com",
  "GitHub: https://github.com/himanshxsr",
  "LinkedIn: https://linkedin.com/in/himanshu-aashish-0a5554243",
  "",
  "Experience",
  "SDE — Elisium Space Pvt. Ltd.",
  "Building enterprise web apps, real-time systems, and GenAI workflows.",
  "",
  "Core skills",
  "React, Next.js, TypeScript, Node.js, MongoDB, AWS, Socket.io, LangChain",
  "",
  "Replace this placeholder with your full resume PDF.",
];

const escapePdf = (s) =>
  s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const content = ["BT", "/F1 11 Tf", "50 750 Td", "16 TL"];
lines.forEach((line, i) => {
  if (i === 0) {
    content.push("/F1 20 Tf", `(${escapePdf(line)}) Tj`, "T*", "/F1 11 Tf");
  } else {
    content.push(`(${escapePdf(line)}) Tj`, "T*");
  }
});
content.push("ET");

const stream = content.join("\n");
const objs = [
  "1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj\n",
  "2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj\n",
  "3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources<< /Font<< /F1 5 0 R >> >> >>endobj\n",
  `4 0 obj<< /Length ${Buffer.byteLength(stream, "utf8")} >>stream\n${stream}\nendstream\nendobj\n`,
  "5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj\n",
];

let pdf = "%PDF-1.4\n";
const offsets = [0];
for (const obj of objs) {
  offsets.push(Buffer.byteLength(pdf, "utf8"));
  pdf += obj;
}

const xrefStart = Buffer.byteLength(pdf, "utf8");
pdf += `xref\n0 ${objs.length + 1}\n`;
pdf += "0000000000 65535 f \n";
for (let i = 1; i < offsets.length; i++) {
  pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
}
pdf += `trailer<< /Size ${objs.length + 1} /Root 1 0 R >>\n`;
pdf += `startxref\n${xrefStart}\n%%EOF`;

const out = path.join(__dirname, "..", "public", "resume.pdf");
fs.writeFileSync(out, pdf);
console.log(`wrote ${out} (${fs.statSync(out).size} bytes)`);
