import sharp from "sharp";
import fs from "fs";
import path from "path";

// Folder with your original photos
const inputDir = "./src/assets/images";

// New folder where the compressed WebP copies will be saved
const outputDir = "./src/assets/images-optimized";

// Max width in pixels (1920 is good for full-screen hero photos)
const MAX_WIDTH = 1920;

fs.mkdirSync(outputDir, { recursive: true });

let totalBefore = 0;
let totalAfter = 0;

for (const file of fs.readdirSync(inputDir)) {
  if (!/\.(jpe?g|png)$/i.test(file)) continue;

  const inputPath = path.join(inputDir, file);
  const name = path.parse(file).name;
  const outputPath = path.join(outputDir, `${name}.webp`);

  await sharp(inputPath)
    .rotate() // keeps phone photos the right way up
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(outputPath);

  const before = fs.statSync(inputPath).size;
  const after = fs.statSync(outputPath).size;
  totalBefore += before;
  totalAfter += after;

  console.log(
    `Done: ${file}  ${(before / 1024 / 1024).toFixed(1)} MB -> ${(
      after /
      1024 /
      1024
    ).toFixed(2)} MB`
  );
}

console.log("----------------------------------------");
console.log(`Before: ${(totalBefore / 1024 / 1024).toFixed(1)} MB`);
console.log(`After:  ${(totalAfter / 1024 / 1024).toFixed(1)} MB`);