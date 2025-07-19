import { Candidate } from '@/types';

export function getCandidates(): Candidate[] {
  const stored = localStorage.getItem('candidates');
  return stored ? JSON.parse(stored) : [];
}

export function saveCandidates(candidates: Candidate[]): void {
  localStorage.setItem('candidates', JSON.stringify(candidates));
}

export function addCandidate(candidate: Candidate): void {
  const candidates = getCandidates();
  candidates.push(candidate);
  saveCandidates(candidates);
}

export function updateCandidate(updatedCandidate: Candidate): void {
  const candidates = getCandidates();
  const index = candidates.findIndex(c => c.id === updatedCandidate.id);
  if (index !== -1) {
    candidates[index] = updatedCandidate;
    saveCandidates(candidates);
  }
}

export function deleteCandidate(id: string): void {
  const candidates = getCandidates();
  const filtered = candidates.filter(c => c.id !== id);
  saveCandidates(filtered);
}

export function getCandidateById(id: string): Candidate | undefined {
  return getCandidates().find(c => c.id === id);
}