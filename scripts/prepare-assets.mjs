import sharp from 'sharp';
// Preserve the approved transparent cutout when regenerating website assets.
await sharp('src/assets/brand-mark-transparent-source.png')
  .trim()
  .resize({ width: 180 })
  .png()
  .toFile('src/assets/brand-mark-transparent.png');
await sharp('src/assets/hero.png')
  .resize(1200, 630, { fit: 'cover' })
  .jpeg({ quality: 85 })
  .toFile('public/social.jpg');
