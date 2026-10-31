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

## Key Learning

### 1. `fetch()` + `async/await` 로 비동기 HTTP 요청 처리

콜백이나 `.then()` 없이 `async/await` 를 사용하면 비동기 코드를 동기처럼 순서대로 읽고 작성할 수 있다는 것을 배웠다.
특히 등록 후 바로 목록을 갱신할 때 `await createBook(data)` → `await fetchBooks()` 순서가 보장되어야 한다는 점이 명확해졌다.

```js
const res = await fetch(API_URL, { method: 'POST', ... });
const data = await res.json();
```

### 2. REST API 설계 – URL + HTTP 메서드로 동작 구분

같은 URL이라도 메서드에 따라 동작이 달라진다는 REST 원칙을 실습으로 이해했다.

| URL | 메서드 | 동작 |
|---|---|---|
| `/user` | GET | 전체 조회 |
| `/user` | POST | 생성 |
| `/user/:id` | PUT | 수정 |
| `/user/:id` | DELETE | 삭제 |

### 3. URL 파라미터(`URLSearchParams`)로 페이지 간 데이터 전달

두 페이지(`index.html` ↔ `crud.html`)를 분리했을 때, 수정할 항목의 `id`를 URL 쿼리스트링(`?id=3`)으로 전달하고, `sub.js`에서 `new URLSearchParams(location.search).get('id')` 로 읽어 GET 요청으로 기존 데이터를 불러오는 방법을 익혔다.

---

## AI / Search Usage

| 도구 | 사용 내역 |
|---|---|
| gpt | 에러 디버깅, fetch 등 코드 사용법에 대해서 숙지|

---

## Problem & Solution / Reflection

### 문제 1. `book.year.slice is not a function` 에러

MockAPI의 `year` 필드 타입을 Date로 설정했더니, 응답값이 문자열이 아닌 숫자(타임스탬프) 또는 ISO 전체 문자열로 와서 `.slice()` 호출 시 에러가 발생했다. 그래서 `String(book.year).slice(0, 10)` 으로 타입에 상관없이 문자열로 변환 후 앞 10자리만 잘라서 표시하도록 수정했다.

---

### Reflection

REST API와 `fetch()`를 처음 직접 사용해보면서, 이론으로만 알던 CRUD가 실제로 어떻게 동작하는지 손으로 경험할 수 있었다. 특히 하나의 엔드포인트에 메서드만 바꿔서 생성/수정/삭제가 모두 가능하다. 또한 비동기 처리에서 `await`를 빠뜨리면 데이터가 준비되기 전에 렌더링이 실행되는 타이밍 문제가 생긴다는 것을 직접 겪으며 `async/await` 의 중요성을 체감했다.
