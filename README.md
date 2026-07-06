# 试题管家 Web

离线可打开的静态网页版空 UI 原型。当前版本不调用 API、不联网、不内置题库或知识点数据，适合作为后续接入 API 前的界面骨架。

## 本地预览

直接双击打开：

```text
index.html
```

也可以用本地静态服务预览：

```powershell
python -m http.server 4173
```

然后访问：

```text
http://127.0.0.1:4173
```

## GitHub Pages

这个目录可以直接作为 GitHub 仓库根目录上传。发布 Pages 时选择：

- Source: Deploy from a branch
- Branch: main
- Folder: /root

## 后续接入点

- API 解析入口：`app.js` 中的 `startDigitize()`
- 题库数据：当前 `users`、`papers`、`outlines`、`questionBank` 都是空数组
- 文件选择：当前仅用于 UI 占位，不会上传或解析文件
