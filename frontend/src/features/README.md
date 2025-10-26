# Features

**역할**: Bounded Context별 기능 모듈

**폴더 구조**:
```
features/
├─ editor/        # 에디터 기능 (Monaco Editor, 코드 입력)
├─ rendering/     # 렌더링 기능 (다이어그램 프리뷰)
└─ export/        # Export 기능 (PNG, SVG 다운로드)
```

**각 Feature 내부 구조**:
- components/: Feature 전용 컴포넌트
- hooks/: API 호출, 비즈니스 로직 훅
- stores/: Zustand 스토어 (상태 관리)

**원칙**:
- Feature 간 직접 import 금지
- shared 폴더 통해 공통 코드 공유
- 각 Feature는 독립적으로 동작
