const API_URL = 'https://6adea6ec4e88f1bba4a53b07.mockapi.io/user';

const bookList  = document.getElementById('bookList');
const emptyMsg  = document.getElementById('emptyMsg');
const searchInput = document.getElementById('searchInput');

let allBooks = [];

// ── GET : 목록 조회 ───────────────────────
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

// ── 렌더링 ────────────────────────────────
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
        <a href="crud.html?id=${book.id}" class="btn btn-sm btn-outline-warning me-1">수정</a>
        <button class="btn btn-sm btn-outline-danger" onclick="startDelete('${book.id}', '${book.title}')">삭제</button>
      </td>
    `;
    bookList.appendChild(tr);
  });
}

// ── DELETE ────────────────────────────────
async function startDelete(id, title) {
  if (!confirm(`"${title}" 도서를 삭제하시겠습니까?`)) return;
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(res.status);
    await fetchBooks();
  } catch (err) {
    console.error('DELETE 실패:', err);
    alert('삭제에 실패했습니다.');
  }
}

// ── 검색 (로컬 배열 필터) ─────────────────
searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) { renderList(allBooks); return; }
  renderList(allBooks.filter(b =>
    (b.title ?? '').toLowerCase().includes(q) ||
    (b.author ?? '').toLowerCase().includes(q) ||
    (b.publisher ?? '').toLowerCase().includes(q)
  ));
});

fetchBooks();
