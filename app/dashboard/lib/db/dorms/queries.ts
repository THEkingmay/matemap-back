import { FormEditData } from "../../types";

// Fetch all dorms
export async function getDorms() {
  const res = await fetch(`/api/dorms`);
  if (!res.ok) throw new Error('Failed to fetch dorm');
  return res.json();
}
// Fetch single dorm
export async function getDormByID(dormId: string) {
  const res = await fetch(`/api/dorms/${dormId}`);
  if (!res.ok) throw new Error('Failed to fetch dorm');
  return res.json();
}

// Update dorm
export async function updateDormByID(dormId: string, updates: FormEditData) {
  const res = await fetch(`/api/dorms/${dormId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update dorm');
  return res.json();
}

// Delete dorm
export async function deleteDormByID(dormId: string) {
  const res = await fetch(`/api/dorms/${dormId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete dorm');
  return res.json();
}