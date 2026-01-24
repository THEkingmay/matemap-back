// Fetch all students
export async function GetStudents() {
  const res = await fetch(`/api/students`);
  if (!res.ok) throw new Error('Failed to fetch student');
  return res.json();
}