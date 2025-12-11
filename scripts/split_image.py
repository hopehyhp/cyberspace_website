#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
将图片切分成3x3九宫格的脚本
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import sys

def create_cyberpunk_shinchan():
    """创建一个赛博朋克风格的蜡笔小新占位图"""
    # 创建一个600x600的图片（可以切分成9个200x200的部分）
    width, height = 600, 600
    img = Image.new('RGB', (width, height), color='#0a0a0a')
    draw = ImageDraw.Draw(img)
    
    # 赛博朋克配色
    colors = {
        'cyan': '#00d9ff',
        'pink': '#ff00ff',
        'purple': '#9d00ff',
        'green': '#00ff88',
        'yellow': '#ffd700'
    }
    
    # 绘制赛博朋克风格的背景网格
    grid_size = 20
    for x in range(0, width, grid_size):
        draw.line([(x, 0), (x, height)], fill=colors['cyan'], width=1)
    for y in range(0, height, grid_size):
        draw.line([(0, y), (width, y)], fill=colors['cyan'], width=1)
    
    # 添加霓虹效果
    for i in range(5):
        x1 = i * 150
        y1 = i * 120
        draw.ellipse([x1, y1, x1+100, y1+100], outline=colors['pink'], width=3)
        draw.ellipse([width-x1-100, y1, width-x1, y1+100], outline=colors['purple'], width=3)
    
    # 在中心绘制一个简单的蜡笔小新轮廓（使用文字或简单图形）
    # 由于无法真正绘制蜡笔小新，我们创建一个赛博朋克风格的占位
    center_x, center_y = width // 2, height // 2
    
    # 绘制一个赛博朋克风格的头像轮廓
    # 头部（圆形）
    head_radius = 80
    draw.ellipse(
        [center_x - head_radius, center_y - head_radius - 20,
         center_x + head_radius, center_y + head_radius - 20],
        fill=colors['yellow'],
        outline=colors['cyan'],
        width=3
    )
    
    # 眼睛
    eye_size = 15
    draw.ellipse(
        [center_x - 30 - eye_size, center_y - 40 - eye_size,
         center_x - 30 + eye_size, center_y - 40 + eye_size],
        fill='#000000',
        outline=colors['pink'],
        width=2
    )
    draw.ellipse(
        [center_x + 30 - eye_size, center_y - 40 - eye_size,
         center_x + 30 + eye_size, center_y - 40 + eye_size],
        fill='#000000',
        outline=colors['pink'],
        width=2
    )
    
    # 嘴巴
    draw.arc(
        [center_x - 30, center_y - 10, center_x + 30, center_y + 20],
        start=0,
        end=180,
        fill=colors['pink'],
        width=3
    )
    
    # 添加霓虹光晕效果
    for offset in range(5, 20, 5):
        draw.ellipse(
            [center_x - head_radius - offset, center_y - head_radius - 20 - offset,
             center_x + head_radius + offset, center_y + head_radius - 20 + offset],
            outline=colors['cyan'],
            width=1
        )
    
    # 添加文字标签（如果字体可用）
    try:
        # 尝试使用系统字体
        font = ImageFont.truetype("arial.ttf", 24)
    except:
        try:
            font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 24)
        except:
            font = ImageFont.load_default()
    
    # 添加赛博朋克文字
    text = "CYBER SHINCHAN"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_x = (width - text_width) // 2
    text_y = center_y + head_radius + 30
    
    # 文字描边效果
    for adj in [(-1,-1), (-1,0), (-1,1), (0,-1), (0,1), (1,-1), (1,0), (1,1)]:
        draw.text((text_x + adj[0], text_y + adj[1]), text, font=font, fill='#000000')
    draw.text((text_x, text_y), text, font=font, fill=colors['cyan'])
    
    return img

def split_image(image_path, output_dir='src/assets/grid'):
    """将图片切分成3x3九宫格"""
    # 打开图片
    if image_path and os.path.exists(image_path):
        img = Image.open(image_path)
    else:
        # 如果没有提供图片，创建占位图
        print("未找到图片，正在创建赛博朋克风格占位图...")
        img = create_cyberpunk_shinchan()
    
    # 确保图片是正方形且尺寸合适
    # 调整大小为600x600（可以被3整除）
    img = img.resize((600, 600), Image.Resampling.LANCZOS)
    
    # 创建输出目录
    os.makedirs(output_dir, exist_ok=True)
    
    # 计算每个格子的尺寸
    cell_width = img.width // 3
    cell_height = img.height // 3
    
    # 切分图片（按行优先顺序：1-2-3, 4-5-6, 7-8-9）
    parts = []
    for row in range(3):
        for col in range(3):
            left = col * cell_width
            top = row * cell_height
            right = left + cell_width
            bottom = top + cell_height
            
            # 裁剪
            cell = img.crop((left, top, right, bottom))
            
            # 保存
            part_num = row * 3 + col + 1
            filename = f'grid-part-{part_num}.png'
            filepath = os.path.join(output_dir, filename)
            cell.save(filepath, 'PNG')
            parts.append(filepath)
            print(f"已保存: {filepath}")
    
    print(f"\n成功切分图片为9部分！")
    print(f"输出目录: {output_dir}")
    return parts

if __name__ == '__main__':
    # 如果提供了图片路径，使用它；否则创建占位图
    image_path = sys.argv[1] if len(sys.argv) > 1 else None
    split_image(image_path)

