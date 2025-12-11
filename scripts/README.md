# 九宫格图片生成说明

## 方法一：使用HTML工具（推荐）

1. 在浏览器中打开 `scripts/generate_grid.html`
2. 页面会自动生成一张赛博朋克风格的图片
3. 点击"切分并下载"按钮
4. 将下载的9个图片文件（grid-part-1.png 到 grid-part-9.png）复制到 `src/assets/grid/` 目录

## 方法二：使用Python脚本

如果您有Python环境并安装了PIL库：

```bash
# 安装依赖
pip install Pillow

# 运行脚本（会自动创建占位图）
python scripts/split_image.py

# 或者使用您自己的图片
python scripts/split_image.py path/to/your/image.jpg
```

## 方法三：使用Node.js脚本

如果您安装了canvas库：

```bash
# 安装依赖
npm install canvas

# 运行脚本
node scripts/split_image.js
```

## 注意事项

- 图片尺寸应为 600x600 像素（或能被3整除的正方形）
- 切分后的9个图片会按照以下顺序排列：
  ```
  1  2  3
  4  5  6
  7  8  9
  ```
- 确保所有图片文件都放在 `src/assets/grid/` 目录下

