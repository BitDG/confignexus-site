# 비디오 리소스 폴더

이 폴더는 한국어 버전의 데모 비디오 파일(WebM 형식)을 저장하는 데 사용됩니다.

## 사용 방법

Markdown 파일에서 다음 구문을 사용하여 비디오를 참조합니다:

```markdown
video:Res/ko/videos/demo.webm
```

또는 제목이 있는 구문을 사용합니다:

```markdown
video:Res/ko/videos/demo.webm|이것은 비디오 제목입니다
```

## 파일 명명 규칙

- 소문자와 하이픈 사용
- 예: `excel-import-demo.webm`, `ai-translation.webm`

## 주의사항

- 비디오 형식은 WebM(VP8/VP9 코덱)이어야 합니다
- 권장 비디오 해상도: 최대 1920x1080
- 권장 비디오 크기: 최대 50MB
- 비디오 컨트롤이 자동으로 추가됩니다
- WebM 형식은 MP4에 비해 더 나은 압축률과 오픈 소스 이점을 제공합니다
