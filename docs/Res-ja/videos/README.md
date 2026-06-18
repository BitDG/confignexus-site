# ビデオリソースフォルダ

このフォルダは、日本語版のデモビデオファイル（WebM形式）を保存するために使用されます。

## 使用方法

Markdownファイルで次の構文を使用してビデオを参照します：

```markdown
video:Res/ja/videos/demo.webm
```

またはタイトル付きの構文を使用します：

```markdown
video:Res/ja/videos/demo.webm|これはビデオタイトルです
```

## ファイル命名規則

- 小文字とハイフンを使用
- 例：`excel-import-demo.webm`、`ai-translation.webm`

## 注意事項

- ビデオ形式はWebM（VP8/VP9コーデック）である必要があります
- 推奨ビデオ解像度：1920x1080まで
- 推奨ビデオサイズ：50MBまで
- ビデオコントロールが自動的に追加されます
- WebM形式はMP4と比較して、より良い圧縮率とオープンソースの利点があります
