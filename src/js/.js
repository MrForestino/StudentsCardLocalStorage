import './style.css';
import Handlebars from 'handlebars';
import templateRaw from '../src/template-student-data.hbs?raw';
import studentsJSON from './json/students.json';

const template = Handlebars.compile(templateRaw);

let dataArray = JSON.parse(localStorage.getItem('students')) || studentsJSON;
let dataJSON = JSON.stringify(dataArray);

const studentForm = document.getElementById('student-form');
const studentsList = document.getElementById('students-list');
const addStudentCard = document.getElementById('addStudent');
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-form');
const closeBtn = document.querySelector('.close-btn');

let editId = null;

function updateStorage() {
  dataJSON = JSON.stringify(dataArray);
  localStorage.setItem('students', dataJSON);
}

function renderStudents() {
  studentsList.innerHTML = '';
  dataArray.forEach(student => {
    const html = template({ student });
    studentsList.insertAdjacentHTML('beforeend', html);
  });
}

addStudentCard.addEventListener('click', () => {
  studentForm.style.display = 'block';
  studentForm.reset();
});
studentForm.addEventListener('submit', (event) => {
  event.preventDefault();

  try {
    const formData = new FormData(studentForm);
    const studentData = {
      id: Date.now(),
      firstName: formData.get('firstName').trim(),
      lastName: formData.get('lastName').trim(),
      age: parseInt(formData.get('age')),
      course: formData.get('course').trim(),
      faculty: formData.get('faculty').trim()
    };

    if (!studentData.firstName || !studentData.lastName || isNaN(studentData.age)) {
      alert("Заповніть усі поля коректно.");
      return;
    }

    dataArray.push(studentData);
    updateStorage();
    renderStudents();
    studentForm.reset();
    studentForm.style.display = 'none';

  } catch (error) {
    alert("Помилка при додаванні студента.");
    console.error(error);
  }
});

studentsList.addEventListener('click', function (event) {
  const studentItem = event.target.closest('.studentItem');
  if (!studentItem) return;

  const studentId = parseInt(studentItem.dataset.id);

  if (event.target.classList.contains('delete-btn')) {
    const confirmed = confirm("Видалити картку?");
    if (!confirmed) return;

    dataArray = dataArray.filter(student => student.id !== studentId);
    updateStorage();
    renderStudents();
  }


  if (event.target.classList.contains('edit-btn')) {
    const student = dataArray.find(s => s.id === studentId);
    if (!student) return;


    editForm.firstName.value = student.firstName;
    editForm.lastName.value = student.lastName;
    editForm.age.value = student.age;
    editForm.course.value = student.course;
    editForm.faculty.value = student.faculty;

    editId = student.id;
    editModal.style.display = 'flex';
  }
});

closeBtn.addEventListener('click', () => {
  editModal.style.display = 'none';
});


editForm.addEventListener('submit', (e) => {
  e.preventDefault();

  try {
    const formData = new FormData(editForm);
    const updatedStudent = {
      id: editId,
      firstName: formData.get('firstName').trim(),
      lastName: formData.get('lastName').trim(),
      age: parseInt(formData.get('age')),
      course: formData.get('course').trim(),
      faculty: formData.get('faculty').trim()
    };

    if (!updatedStudent.firstName || !updatedStudent.lastName || isNaN(updatedStudent.age)) {
      alert("Некоректні дані.");
      return;
    }

    const index = dataArray.findIndex(s => s.id === editId);
    if (index !== -1) {
      dataArray[index] = updatedStudent;
      updateStorage();
      renderStudents();
      editModal.style.display = 'none';
    }

  } catch (err) {
    alert("Помилка редагування.");
    console.error(err);
  }
});


renderStudents();