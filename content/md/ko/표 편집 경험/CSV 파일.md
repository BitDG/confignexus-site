# CSV 파일 지원

표준 CSV 형식의 가져오기 및 사용을 지원합니다.

createtab:Res/zh/templates/CSV导入演示.cnx

## 기능 개요

| 기능 | 설명 |
|------|------|
| Web Worker 비동기 처리 | 대용량 CSV 파일도 UI 차단 없이 처리 |
| 인코딩 자동 감지 | UTF-8, GBK 등 다양한 인코딩 자동 인식 |
| 구분자 감지 | 쉼표, 탭, 세미콜론 등 구분자를 자동 판별 |
| 드래그 앤 드롭 가져오기 | 파일을 인터페이스에 드래그하여 빠르게 가져오기 |

## CSV 가져오기

두 가지 가져오기 방법을 지원합니다:

### 방법 1: 메뉴 가져오기

파일 → CSV 가져오기 → CSV 파일을 선택하여 가져오기

video:Res/zh/videos/导入csv.webm|CSV 가져오기

### 방법 2: 드래그 앤 드롭 가져오기

CSV 파일을 ConfigNexus 인터페이스에 직접 드래그 앤 드롭하여 가져오기

video:Res/zh/videos/拖拽csv.webm|CSV 드래그 앤 드롭 가져오기

## CSV 형식 설명

> [!NOTE]
> CSV 형식은 데이터 내용만 포함하며 표시 형식(글꼴, 색상 등 스타일 정보)은 포함하지 않습니다.

## 지원되는 인코딩

- UTF-8 (기본값)
- GBK / GB2312
- Shift-JIS
- EUC-KR
- ISO-8859-1
