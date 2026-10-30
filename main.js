const API_URL = 'https://6adea6ec4e88f1bba4a53b07.mockapi.io/user';

// ── DOM 요소 ──────────────────────────────
const bookForm    = document.getElementById('bookForm');
const titleInput  = document.getElementById('title');
const authorInput = document.getElementById('author');
const pubInput    = document.getElementById('publisher');
const yearInput   = document.getElementById('year');
const bookList    = document.getElementById('bookList');
const emptyMsg    = document.getElementById('emptyMsg');

// ── 목록 렌더링 ───────────────────────────
// MockAPI 스키마: id(자동생성), title, author, publisher, year
function renderList(books) {
  bookList.innerHTML = '';

  if (books.length === 0) {
    emptyMsg.style.display = 'block';
    return;
  }
  emptyMsg.style.display = 'none';

  books.forEach(book => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${book.id}</td>
      <td>${book.title ?? '—'}</td>
      <td>${book.author ?? '—'}</td>
      <td>${book.publisher ?? '—'}</td>
      <td>${book.year ? String(book.year).slice(0, 10) : '—'}</td>
      <td>
        <button class="btn btn-sm btn-outline-warning me-1">수정</button>
        <button class="btn btn-sm btn-outline-danger">삭제</button>
      </td>
    `;
    bookList.appendChild(tr);
  });
}

// ── GET : 목록 불러오기 ───────────────────
async function fetchBooks() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    renderList(data);
  } catch (err) {
    console.error('목록 불러오기 실패:', err);
    alert('서버에서 데이터를 불러오지 못했습니다.');
  }
}

// ── POST : 도서 등록 ──────────────────────
async function createBook(book) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book)
  });

  if (!res.ok) throw new Error(`POST 실패: ${res.status}`);
  return res.json();
}

// ── 폼 submit ────────────────────────────
bookForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const newBook = {
    title:     titleInput.value.trim(),
    author:    authorInput.value.trim(),
    publisher: pubInput.value.trim(),
    year:      yearInput.value   // "2024-01-01" 형식
  };

  try {
    await createBook(newBook);
    bookForm.reset();
    await fetchBooks();          // 등록 후 목록 갱신
  } catch (err) {
    console.error('등록 실패:', err);
    alert('도서 등록에 실패했습니다.');
  }
});

// ── 초기 로드 : 기존 10개 데이터 자동 표시 ──
fetchBooks();
