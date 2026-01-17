# wireweave-vscode

VSCode/Cursor 확장. 와이어프레임 미리보기 및 문법 지원.

## 목적

- `.wf`, `.wireframe` 파일 문법 하이라이팅
- 실시간 미리보기 패널
- 마크다운 코드블록 내 와이어프레임 렌더링
- HTML/SVG 내보내기

## 배포

- **공개 여부**: 오픈소스
- **배포처**: VSCode Marketplace
- **퍼블리셔**: seungwoo321
- **레포지토리**: github.com/wireweave/vscode-extension

## 패키지 구조

```
src/
├── extension.ts    # 확장 진입점, 명령어 등록
├── preview.ts      # 미리보기 웹뷰 패널
└── language.ts     # 언어 지원 (자동완성 등)
syntaxes/
└── wireframe.tmLanguage.json  # TextMate 문법 정의
styles/
└── wireframe-preview.css      # 미리보기 스타일
```

## 기술 스택

- **VSCode API**: vscode ^1.85.0
- **빌더**: tsup
- **패키징**: vsce

## 지원 파일 확장자

- `.wf` (주 확장자)
- `.wireframe` (별칭)

## 주요 명령어

| 명령어 | 단축키 | 설명 |
|--------|--------|------|
| `wireframe.preview` | - | 미리보기 열기 |
| `wireframe.previewToSide` | `Cmd+K V` | 옆에 미리보기 열기 |
| `wireframe.exportSvg` | - | SVG로 내보내기 |
| `wireframe.exportHtml` | - | HTML로 내보내기 |

## 설정 옵션

```json
{
  "wireframe.theme": "auto",       // auto, light, dark
  "wireframe.autoPreview": false,  // 파일 열 때 자동 미리보기
  "wireframe.previewWidth": 1200   // 미리보기 기본 너비
}
```

## 빌드 및 배포

```bash
# 빌드
pnpm build

# 패키징
pnpm package  # .vsix 파일 생성

# 마켓플레이스 배포 (수동)
vsce publish
```

## 의존 패키지

- `@wireweave/core` - 파싱/렌더링
- `@wireweave/language-data` - 자동완성 데이터

## 의존받는 패키지

없음 (최종 사용자 도구)

<!-- TODO: 자동 배포 설정 (GitHub Actions) -->
<!-- TODO: 마켓플레이스 등록 절차 문서화 -->
<!-- TODO: 마크다운 미리보기 통합 방식 설명 -->
