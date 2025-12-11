const fs = require('fs');
const path = require('path');

/**
 * 使用Canvas生成赛博朋克风格的图片并切分成九宫格
 * 注意：需要安装canvas包: npm install canvas
 */

function createCyberpunkImage() {
  try {
    // 尝试加载canvas库
    const { createCanvas } = require('canvas');
    
    const size = 600; // 600x600像素，可被3整除
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // 赛博朋克配色
    const colors = {
      bg: '#0a0a0a',
      cyan: '#00d9ff',
      pink: '#ff00ff',
      purple: '#9d00ff',
      green: '#00ff88',
      yellow: '#ffd700'
    };
    
    // 背景
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, size, size);
    
    // 绘制网格
    ctx.strokeStyle = colors.cyan;
    ctx.lineWidth = 1;
    const gridSize = 20;
    for (let x = 0; x <= size; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, size);
      ctx.stroke();
    }
    for (let y = 0; y <= size; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y);
      ctx.stroke();
    }
    
    // 添加霓虹圆圈
    for (let i = 0; i < 5; i++) {
      const x1 = i * 150;
      const y1 = i * 120;
      ctx.strokeStyle = colors.pink;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x1 + 50, y1 + 50, 50, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.strokeStyle = colors.purple;
      ctx.beginPath();
      ctx.arc(size - x1 - 50, y1 + 50, 50, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // 绘制中心头像（简化版蜡笔小新风格）
    const centerX = size / 2;
    const centerY = size / 2;
    const headRadius = 80;
    
    // 头部光晕
    for (let offset = 5; offset < 20; offset += 5) {
      ctx.strokeStyle = colors.cyan;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY - 20, headRadius + offset, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // 头部
    ctx.fillStyle = colors.yellow;
    ctx.strokeStyle = colors.cyan;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY - 20, headRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // 眼睛
    ctx.fillStyle = '#000000';
    ctx.strokeStyle = colors.pink;
    ctx.lineWidth = 2;
    
    // 左眼
    ctx.beginPath();
    ctx.arc(centerX - 30, centerY - 40, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // 右眼
    ctx.beginPath();
    ctx.arc(centerX + 30, centerY - 40, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // 嘴巴
    ctx.strokeStyle = colors.pink;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY + 5, 30, 0, Math.PI);
    ctx.stroke();
    
    // 文字
    ctx.fillStyle = colors.cyan;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    const text = 'CYBER SHINCHAN';
    ctx.strokeText(text, centerX, centerY + headRadius + 30);
    ctx.fillText(text, centerX, centerY + headRadius + 30);
    
    return canvas;
  } catch (error) {
    console.error('Canvas库未安装，请运行: npm install canvas');
    console.error('或者使用Python脚本: python scripts/split_image.py');
    return null;
  }
}

function splitImage(canvas, outputDir) {
  if (!canvas) return;
  
  const size = canvas.width;
  const cellSize = size / 3;
  
  // 创建输出目录
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // 切分图片
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const partNum = row * 3 + col + 1;
      const x = col * cellSize;
      const y = row * cellSize;
      
      // 创建子画布
      const { createCanvas } = require('canvas');
      const cellCanvas = createCanvas(cellSize, cellSize);
      const cellCtx = cellCanvas.getContext('2d');
      
      // 复制对应区域
      cellCtx.drawImage(
        canvas,
        x, y, cellSize, cellSize,
        0, 0, cellSize, cellSize
      );
      
      // 保存
      const filename = `grid-part-${partNum}.png`;
      const filepath = path.join(outputDir, filename);
      const buffer = cellCanvas.toBuffer('image/png');
      fs.writeFileSync(filepath, buffer);
      console.log(`已保存: ${filepath}`);
    }
  }
  
  console.log(`\n成功切分图片为9部分！`);
  console.log(`输出目录: ${outputDir}`);
}

// 主函数
function main() {
  const outputDir = path.join(__dirname, '..', 'src', 'assets', 'grid');
  
  console.log('正在生成赛博朋克风格图片...');
  const canvas = createCyberpunkImage();
  
  if (canvas) {
    console.log('正在切分图片...');
    splitImage(canvas, outputDir);
  } else {
    console.log('\n提示：');
    console.log('1. 安装canvas库: npm install canvas');
    console.log('2. 或者使用Python脚本: python scripts/split_image.py');
    console.log('3. 或者手动准备一张600x600的图片，然后运行此脚本');
  }
}

if (require.main === module) {
  main();
}

module.exports = { createCyberpunkImage, splitImage };

