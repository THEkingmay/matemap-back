// Fetch all students
export async function GetStudents() {
  const res = await fetch(`/api/students`);
  if (!res.ok) throw new Error('Failed to fetch students');
  return res.json();
}

// Fetch student by ID
export async function getStudentByID(studentID : string) {
  const res = await fetch(`/api/students/${studentID}`);
  if (!res.ok) throw new Error('Failed to fetch student');
  return res.json();
}