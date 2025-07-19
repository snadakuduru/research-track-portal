export interface Candidate {
  id: string;
  name: string;
  email: string;
  institution: string;
  department?: string;
  position?: string;
  phone?: string;
  orcid?: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  totalScore: number;
  publications: Publication[];
  reviewerNotes?: string;
  reviewerScore?: number;
}

export interface Publication {
  id: string;
  title: string;
  type: 'journal' | 'conference' | 'book' | 'chapter' | 'patent' | 'other';
  source: string;
  doi?: string;
  url?: string;
  publicationDate: string;
  pdfFile?: File;
  score: number;
}

export interface PublicationSource {
  id: string;
  name: string;
  category: string;
  points: number;
  description?: string;
}

export interface FormStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export type SortField = 'name' | 'institution' | 'submissionDate' | 'totalScore' | 'status';
export type SortDirection = 'asc' | 'desc';