import '../scss/style.scss'

import StudentTemplate from '../template-student-data.hbs?raw';
const StudentData = window.Handlebars.compile(StudentTemplate);

const studentList = document.querySelector('.student__list');

let dataArray = [];
let dataJSON = "[]"; // JSON-рядок, який будемо зберігати

// Завантаження з LS
try {
  if (localStorage.getItem('dataArray')) {
    dataArray = JSON.parse(localStorage.getItem('dataArray'));
    dataJSON = JSON.stringify(dataArray);
  }
} catch (error) {
  alert("Помилка при зчитуванні даних з JSON: " + error.message);
}

// Рендер всіх студентів
function renderStudentList() {
  studentList.innerHTML = '';
  try {
    const parsed = JSON.parse(dataJSON);
    parsed.forEach(student => {
      const studentHTML = StudentData(student);
      studentList.insertAdjacentHTML('beforeend', studentHTML);
    });
  } catch (error) {
    alert("Помилка при рендерингу: " + error.message);
  }
}

renderStudentList();

let idStudentCard = Date.now(); // базовий унікальний ID

// Модальне вікно додавання
const openModalBtn = document.getElementById('openModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const studentModal = document.getElementById('studentModal');

cancelBtn.addEventListener('click', () => {
  studentModal.classList.remove('visible');
  void studentModal.offsetWidth;
  setTimeout(() => studentModal.classList.add('hidden'), 1000);
});

openModalBtn.addEventListener('click', () => {
  studentModal.classList.remove('hidden');
  void studentModal.offsetWidth;
  studentModal.classList.add('visible');
});

// input[type=range]
const ageInput = document.getElementById('ageInput');
const ageValue = document.getElementById('ageValue');
ageInput.addEventListener('input', () => {
  ageValue.textContent = ageInput.value;
});

// Додавання студента
const studentForm = document.querySelector('#studentForm');
const nameInput = document.querySelector('#nameInput');
const surnamenameInput = document.querySelector('#surnamenameInput');
const courseInput = document.querySelector('#courseInput');
const facultyInput = document.querySelector('#facultyInput');

studentForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const studentData = {
    id: idStudentCard++,
    nameInput: nameInput.value.trim(),
    surnamenameInput: surnamenameInput.value.trim(),
    ageInput: ageInput.value.trim(),
    courseInput: courseInput.value.trim(),
    facultyInput: facultyInput.value.trim()
  };

  try {
    dataArray.push(studentData);
    saveToLS();
    renderStudentList();
  } catch (error) {
    alert("Помилка додавання: " + error.message);
  }

  // Очистка
  nameInput.value = "";
  surnamenameInput.value = "";
  ageInput.value = "";
  courseInput.value = "";
  facultyInput.value = "";
  studentForm.reset();
  studentModal.classList.remove('visible');
  setTimeout(() => studentModal.classList.add('hidden'), 1000);
});

// Видалення з підтвердженням
studentList.addEventListener('click', deleteStudent);

function deleteStudent(e) {
  if (e.target.dataset.action === 'delete') {
    const parenNode = e.target.closest('.student__list--item');
    const id = Number(parenNode.id);
    const index = dataArray.findIndex((studentCard) => studentCard.id === id);
    if (index === -1) return;

    const confirmDelete = confirm("Видалити картку?");
    if (!confirmDelete) return;

    try {
      dataArray.splice(index, 1);
      saveToLS();
      renderStudentList();
    } catch (error) {
      alert("Помилка при видаленні: " + error.message);
    }
  }
}

// Редагування
const editStudentModal = document.getElementById('editStudentModal');
const editStudent = document.getElementById('editStudent');

const editNameInput = document.getElementById('editNameInput');
const editSurnamenameInput = document.getElementById('editSurnamenameInput');
const editAgeInput = document.getElementById('editAgeInput');
const editAgeValue = document.getElementById('editAgeValue');
const editCourseInput = document.getElementById('editCourseInput');
const editFacultyInput = document.getElementById('editFacultyInput');

let editingIndex = null;

studentList.addEventListener('click', handleEditStudentClick);

function handleEditStudentClick(e) {
  if (e.target.dataset.action === 'edit') {
    const parenNode = e.target.closest('.student__list--item');
    const studentId = Number(parenNode.id);
    const index = dataArray.findIndex(st => st.id === studentId);
    if (index === -1) return;

    const student = dataArray[index];

    editNameInput.value = student.nameInput;
    editSurnamenameInput.value = student.surnamenameInput;
    editAgeInput.value = student.ageInput;
    editAgeValue.textContent = student.ageInput;
    editCourseInput.value = student.courseInput;
    editFacultyInput.value = student.facultyInput;

    editingIndex = index;

    editStudentModal.classList.remove('hidden');
    void editStudentModal.offsetWidth;
    editStudentModal.classList.add('visible');
  }
}

// Сабміт на редагування
editStudent.addEventListener('submit', function (e) {
  e.preventDefault();

  if (editingIndex === null) return;

  try {
    dataArray[editingIndex] = {
      ...dataArray[editingIndex],
      nameInput: editNameInput.value.trim(),
      surnamenameInput: editSurnamenameInput.value.trim(),
      ageInput: editAgeInput.value.trim(),
      courseInput: editCourseInput.value.trim(),
      facultyInput: editFacultyInput.value.trim()
    };

    saveToLS();
    renderStudentList();
  } catch (error) {
    alert("Помилка редагування: " + error.message);
  }

  editStudentModal.classList.remove('visible');
  setTimeout(() => editStudentModal.classList.add('hidden'), 1000);
});

// Збереження в LS
function saveToLS() {
  try {
    dataJSON = JSON.stringify(dataArray);
    localStorage.setItem('dataArray', dataJSON);
  } catch (error) {
    alert("Помилка при збереженні JSON: " + error.message);
  }
}
