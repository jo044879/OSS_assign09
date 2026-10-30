const API_URL = 'https://6adea6ec4e88f1bba4a53b07.mockapi.io/user';

// ── DOM ───────────────────────────────────
const bookForm   = document.getElementById('bookForm');
const titleInput = document.getElementById('title');
const authorInput= document.getElementById('author');
const pubInput   = document.getElementById('publisher');
const yearInput  = document.getElementById('year');
const submitBtn  = document.getElementById('submitBtn');
const cancelBtn  = document.getElementById('cancelBtn');
const formTitle  = document.getElementById('formTitle');
const bookList   = document.getElementById('bookList');
const emptyMsg   = document.getElementById('emptyMsg');
const searchInput= document.getElementById('searchInput');

let editId = null;      // 수정 중인 항목 id (null이면 등록 모드)
let allBooks = [];      // 검색용 로컬 배열

// ════════════════════════════════════════
// GET  –  목록 조회
// ════════════════════════════════════════
async function fetchBooks() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(res.status);
    allBooks = await res.json();
    renderList(allBooks);
  } catch (err) {
    console.error('GET 실패:', err);
    alert('목록을 불러오지 못했습니다.');
  }
}

// ════════════════════════════════════════
// POST  –  도서 등록
// ════════════════════════════════════════
async function createBook(data) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(res.status);
  return res.json();
}

// ════════════════════════════════════════
// PUT  –  도서 수정
// ════════════════════════════════════════
async function updateBook(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(res.status);
  return res.json();
}

// ════════════════════════════════════════
// DELETE  –  도서 삭제
// ════════════════════════════════════════
async function deleteBook(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(res.status);
}

// ════════════════════════════════════════
// 화면 렌더링
// ════════════════════════════════════════
function renderList(books) {
  bookList.innerHTML = '';
  emptyMsg.style.display = books.length === 0 ? 'block' : 'none';

  books.forEach(book => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${book.id}</td>
      <td>${book.title ?? '—'}</td>
      <td>${book.author ?? '—'}</td>
      <td>${book.publisher ?? '—'}</td>
      <td>${book.year ? String(book.year).slice(0, 10) : '—'}</td>
      <td>
        <button class="btn btn-sm btn-outline-warning me-1" onclick="startEdit('${book.id}')">수정</button>
        <button class="btn btn-sm btn-outline-danger" onclick="startDelete('${book.id}', '${book.title}')">삭제</button>
      </td>
    `;
    bookList.appendChild(tr);
  });
}

// ════════════════════════════════════════
// 수정 시작  –  폼에 기존 값 채우기
// ════════════════════════════════════════
function startEdit(id) {
  const book = allBooks.find(b => b.id === id);
  if (!book) return;

  editId = id;
  titleInput.value   = book.title     ?? '';
  authorInput.value  = book.author    ?? '';
  pubInput.value     = book.publisher ?? '';
  yearInput.value    = book.year ? String(book.year).slice(0, 10) : '';

  formTitle.textContent  = '도서 수정';
  submitBtn.textContent  = '저장';
  cancelBtn.style.display = 'inline-block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ════════════════════════════════════════
// 취소  –  등록 모드로 복귀
// ════════════════════════════════════════
function resetForm() {
  editId = null;
  bookForm.reset();
  formTitle.textContent   = '도서 등록';
  submitBtn.textContent   = '등록';
  cancelBtn.style.display = 'none';
}

// ════════════════════════════════════════
// 삭제 시작  –  confirm 후 DELETE
// ════════════════════════════════════════
async function startDelete(id, title) {
  if (!confirm(`"${title}" 도서를 삭제하시겠습니까?`)) return;
  try {
    await deleteBook(id);
    await fetchBooks();
  } catch (err) {
    console.error('DELETE 실패:', err);
    alert('삭제에 실패했습니다.');
  }
}

// ════════════════════════════════════════
// 폼 submit  –  등록 또는 수정
// ════════════════════════════════════════
bookForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    title:     titleInput.value.trim(),
    author:    authorInput.value.trim(),
    publisher: pubInput.value.trim(),
    year:      yearInput.value
  };

  try {
    if (editId) {
      await updateBook(editId, data);   // PUT
    } else {
      await createBook(data);           // POST
    }
    resetForm();
    await fetchBooks();
  } catch (err) {
    console.error('저장 실패:', err);
    alert('저장에 실패했습니다.');
  }
});

// ════════════════════════════════════════
// 검색  –  로컬 배열 필터링
// ════════════════════════════════════════
searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) { renderList(allBooks); return; }

  const filtered = allBooks.filter(b =>
    (b.title     ?? '').toLowerCase().includes(q) ||
    (b.author    ?? '').toLowerCase().includes(q) ||
    (b.publisher ?? '').toLowerCase().includes(q)
  );
  renderList(filtered);
});

// 취소 버튼
cancelBtn.addEventListener('click', resetForm);

// ════════════════════════════════════════
// 초기 로드
// ════════════════════════════════════════
fetchBooks();
