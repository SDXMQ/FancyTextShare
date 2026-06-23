# FancyTextShare ✨

FancyTextShare는 텍스트에 감성적인 디자인을 입혀 고해상도 카드 이미지로 저장하거나, 커스텀 링크로 다른 사람에게 그대로 공유할 수 있는 프리미엄 정적 웹 애플리케이션입니다.

GitHub Pages를 통해 간편하게 호스팅할 수 있도록 설계되었으며, 별도의 서버나 빌드 프로세스가 필요하지 않은 순수 Vanilla HTML, CSS, JavaScript 프로젝트입니다.

---

## 🎨 주요 기능

1. **실시간 텍스트 스타일링**: 텍스트를 입력하면 프리뷰 카드에 실시간으로 반영됩니다.
2. **다양한 프리미엄 테마**: 8가지 감각적인 그라데이션 테마 배경을 원클릭으로 적용할 수 있습니다.
3. **타이포그래피 커스텀**: 다양한 글꼴 패밀리(Sans-serif, Serif, Monospace 등), 정렬 방식, 글자 크기를 세부 조절할 수 있습니다.
4. **고해상도 PNG 다운로드**: html2canvas를 활용하여 디자인한 카드를 고화질 이미지(2x Scale)로 즉시 다운로드합니다.
5. **커스텀 공유 링크 생성**: 현재 편집 중인 카드 상태(텍스트, 배경 테마, 폰트 스타일 등)를 쿼리 매개변수에 포함한 공유용 URL을 원클릭으로 클립보드에 복사해 줍니다. 수신자가 해당 링크로 접속하면 내가 편집한 상태 그대로 카드가 나타납니다.

---

## 🚀 GitHub Pages 배포 방법 (GitHub Actions 기반)

본 프로젝트는 푸시할 때마다 자동으로 배포가 이루어지는 GitHub Actions 워크플로우(`.github/workflows/static.yml`)가 포함되어 있습니다. 아래 단계를 통해 GitHub Pages 호스팅을 활성화하세요.

1. **GitHub 저장소 생성 및 연동**:
   - GitHub에 새 저장소를 생성하고 이 로컬 프로젝트를 커밋 후 푸시합니다.
   ```bash
   git add .
   git commit -m "Initialize FancyTextShare project"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **GitHub 저장소 설정 변경 (중요)**:
   - GitHub 웹사이트의 생성한 저장소로 이동합니다.
   - 상단 메뉴의 **Settings** 탭을 클릭합니다.
   - 왼쪽 사이드바의 **Pages** 메뉴로 이동합니다.
   - **Build and deployment** 섹션 내 **Source** 설정을 `Deploy from a branch`에서 **`GitHub Actions`**로 변경합니다.

3. **자동 배포 확인**:
   - `main` 브랜치에 소스가 푸시되면 **Actions** 탭에서 워크플로우가 자동으로 실행되는 것을 볼 수 있습니다.
   - 배포가 완료되면 제공되는 링크(`https://<username>.github.io/<repository-name>/`)를 통해 전 세계 어디서든 웹사이트에 접속할 수 있습니다.

---

## 📂 프로젝트 구조

```text
FancyTextShare/
├── .github/
│   └── workflows/
│       └── static.yml    # GitHub Pages Actions 워크플로우
├── app.js                # 앱 동작 로직 및 공유 상태 복구
├── index.html            # 메인 마크업 (SEO 최적화)
├── README.md             # 프로젝트 안내 가이드
└── style.css             # 모던 UI/글라스모피즘 스타일시트
```
