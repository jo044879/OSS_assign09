const API_URL = 'https://6adea6ec4e88f1bba4a53b07.mockapi.io/user';

const bookForm  = document.getElementById('bookForm');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const titleInput  = document.getElementById('title');
const authorInput = document.getElementById('author');
const pubInput    = document.getElementById('publisher');
const yearInput   = document.getElementById('year');

// URL에서 ?id= 읽기
const editId = new URLSearchParams(location.search).get('id');

// ── 수정 모드: 기존 데이터 불러오기 ─────────
if (editId) {
  formTitle.textContent = '도서 수정';
  submitBtn.textContent = '저장';

  (async () => {
    try {
      const res = await fetch(`${API_URL}/${editId}`);
      if (!res.ok) throw new Error(res.status);
      const book = await res.json();
      titleInput.value  = book.title     ?? '';
      authorInput.value = book.author    ?? '';
      pubInput.value    = book.publisher ?? '';
      yearInput.value   = book.year ? String(book.year).slice(0, 10) : '';
    } catch (err) {
      console.error('데이터 불러오기 실패:', err);
      alert('수정할 데이터를 불러오지 못했습니다.');
    }
  })();
}

// ── Validation (3가지) ────────────────────
function validate(data) {
  // ① 제목: 필수, 2자 이상
  if (!data.title || data.title.length < 2) {
    alert('제목은 2자 이상 입력해주세요.');
    return false;
  }
  // ② 저자: 필수, 2자 이상
  if (!data.author || data.author.length < 2) {
    alert('저자는 2자 이상 입력해주세요.');
    return false;
  }
  // ③ 출판년도: 1900-01-01 이후 & 오늘 이하
  if (data.year) {
    const inputDate = new Date(data.year);
    const minDate   = new Date('1900-01-01');
    const today     = new Date();
    today.setHours(23, 59, 59, 0);   // 오늘까지 허용
    if (inputDate < minDate || inputDate > today) {
      alert(`출판년도는 1900-01-01 ~ 오늘 날짜 사이로 입력해주세요.`);
      return false;
    }
  }
  return true;
}

// ── 폼 submit: POST 또는 PUT ─────────────
bookForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    title:     titleInput.value.trim(),
    author:    authorInput.value.trim(),
    publisher: pubInput.value.trim(),
    year:      yearInput.value
  };

  if (!validate(data)) return;

  try {
    if (editId) {
      // PUT: 수정
      const res = await fetch(`${API_URL}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(res.status);
    } else {
      // POST: 등록
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(res.status);
    }
    location.href = 'index.html';   // 완료 후 목록으로 이동
  } catch (err) {
    console.error('저장 실패:', err);
    alert('저장에 실패했습니다.');
  }
});
