
import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputDir = "./src/assets/images";

const MAX_WIDTH = 1920;
const QUALITY = 78;

async function optimizeImages() {
  const files = fs.readdirSync(inputDir);

  let totalBefore = 0;
  let totalAfter = 0;
  let count = 0;

  console.log("Starting Orebz Studio image optimization...\n");

  for (const file of files) {
    if (!/\.(jpg|jpeg|png)$/i.test(file)) continue;

    const inputPath = path.join(inputDir, file);
    const name = path.parse(file).name;

    // Save WebP beside the original image
    const outputPath = path.join(inputDir, `${name}.webp`);

    const before = fs.statSync(inputPath).size;

    await sharp(inputPath)
      .rotate()
      .resize({
        width: MAX_WIDTH,
        withoutEnlargement: true,
      })
      .webp({
        quality: QUALITY,
        effort: 6,
      })
      .toFile(outputPath);

    const after = fs.statSync(outputPath).size;

    totalBefore += before;
    totalAfter += after;
    count++;

    console.log(
      `${file}: ${(before / 1024 / 1024).toFixed(2)} MB`
      + ` -> ${(after / 1024).toFixed(0)} KB`
    );
  }

  console.log("\n================================");
  console.log(`Images optimized: ${count}`);
  console.log(`Original size: ${(totalBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`New size: ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
  console.log("Optimization completed!");
}

optimizeImages().catch(console.error);
