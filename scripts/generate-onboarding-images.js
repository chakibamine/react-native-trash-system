const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

const width = 800;
const height = 800;

const images = [
  {
    name: 'onboarding-1.png',
    icon: '🚛',
    title: 'Smart Waste',
    subtitle: 'Management',
    gradientColors: ['#4A90E2', '#357ABD']
  },
  {
    name: 'onboarding-2.png',
    icon: '🗺️',
    title: 'Route',
    subtitle: 'Optimization',
    gradientColors: ['#50E3C2', '#3CC8A9']
  },
  {
    name: 'onboarding-3.png',
    icon: '📊',
    title: 'Real-time',
    subtitle: 'Monitoring',
    gradientColors: ['#9013FE', '#7B11D4']
  }
];

function createGradient(ctx, colors) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);
  return gradient;
}

function drawCircle(ctx, x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

async function generateImage({ icon, title, subtitle, gradientColors, name }) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fill background with gradient
  ctx.fillStyle = createGradient(ctx, gradientColors);
  ctx.fillRect(0, 0, width, height);

  // Add decorative circles
  drawCircle(ctx, width * 0.8, height * 0.2, 100, 'rgba(255, 255, 255, 0.1)');
  drawCircle(ctx, width * 0.1, height * 0.7, 150, 'rgba(255, 255, 255, 0.1)');
  drawCircle(ctx, width * 0.6, height * 0.9, 80, 'rgba(255, 255, 255, 0.1)');

  // Add icon
  ctx.font = '180px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(icon, width / 2, height * 0.4);

  // Add title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 72px Arial';
  ctx.fillText(title, width / 2, height * 0.65);

  // Add subtitle
  ctx.font = 'bold 64px Arial';
  ctx.fillText(subtitle, width / 2, height * 0.75);

  // Add decorative line
  ctx.beginPath();
  ctx.moveTo(width * 0.3, height * 0.82);
  ctx.lineTo(width * 0.7, height * 0.82);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`assets/images/${name}`, buffer);
}

// Create images directory if it doesn't exist
if (!fs.existsSync('assets/images')) {
  fs.mkdirSync('assets/images', { recursive: true });
}

// Generate images
async function generateAllImages() {
  for (const img of images) {
    await generateImage(img);
    console.log(`Generated ${img.name}`);
  }
}

generateAllImages().catch(console.error); 