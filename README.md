# Assignment 09 – 도서관리 CRUD 프로젝트 보고서

---

## Deployment

| 항목 | URL |
|---|---|
| GitHub | `https://github.com/[본인 GitHub ID]/assign09-c01-22300705` |
| Vercel | `https://assign09-c01-22300705.vercel.app` |
| MockAPI Endpoint | `https://6adea6ec4e88f1bba4a53b07.mockapi.io/user` |

---

## Service

**주제**: 도서관리 시스템

**Field (MockAPI 스키마)**

| 필드명 | 타입 | 설명 |
|---|---|---|
| `id` | Object ID | 자동 생성 고유 식별자 |
| `title` | String | 도서 제목 |
| `author` | String | 저자명 |
| `publisher` | String | 출판사명 |
| `year` | Date | 출판년도 |

**CRUD 기능**

| 기능 | HTTP 메서드 | 설명 |
|---|---|---|
| Create | POST | 폼 입력 후 도서 등록 → MockAPI에 저장 |
| Read | GET | 페이지 로드 시 전체 목록 조회 및 출력, 로컬 배열로 검색 필터링 |
| Update | PUT | 수정 버튼 클릭 → crud.html로 이동, 기존 데이터 불러와 수정 후 저장 |
| Delete | DELETE | 삭제 버튼 클릭 → `confirm()` 확인 후 서버에서 삭제 및 목록 갱신 |

**페이지 구성**

- `index.html` + `main.js` : 목록 조회, 검색, 삭제
- `crud.html` + `sub.js` : 등록 / 수정 폼, Validation

---
