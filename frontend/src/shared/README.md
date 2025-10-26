# Shared

**역할**: 모든 Feature에서 공유하는 공통 코드

**포함 내용**:
- components/: 재사용 가능한 공통 컴포넌트 (Button, Modal, Loading 등)
- hooks/: 공통 훅 (useApi 등)
- utils/: 유틸리티 함수 (API 클라이언트, 검증 등)

**원칙**:
- Feature에 종속되지 않은 범용 코드만 포함
- 특정 도메인 로직 포함 금지
