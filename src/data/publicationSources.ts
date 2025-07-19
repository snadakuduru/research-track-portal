import { PublicationSource } from '@/types';

export const defaultPublicationSources: PublicationSource[] = [
  // High-tier journals and conferences (20-25 points)
  { id: '1', name: 'Nature', category: 'Top-tier Journal', points: 25, description: 'Multidisciplinary science journal' },
  { id: '2', name: 'Science', category: 'Top-tier Journal', points: 25, description: 'Premier scientific journal' },
  { id: '3', name: 'Cell', category: 'Top-tier Journal', points: 24, description: 'Leading life sciences journal' },
  { id: '4', name: 'NEJM', category: 'Top-tier Journal', points: 24, description: 'New England Journal of Medicine' },
  
  // IEEE Tier 1 (18-22 points)
  { id: '5', name: 'IEEE Transactions on Pattern Analysis and Machine Intelligence', category: 'IEEE Tier 1', points: 22 },
  { id: '6', name: 'IEEE Transactions on Information Theory', category: 'IEEE Tier 1', points: 21 },
  { id: '7', name: 'IEEE Transactions on Signal Processing', category: 'IEEE Tier 1', points: 20 },
  { id: '8', name: 'IEEE Transactions on Computers', category: 'IEEE Tier 1', points: 20 },
  
  // ACM Tier 1 (18-22 points)
  { id: '9', name: 'ACM Transactions on Graphics', category: 'ACM Tier 1', points: 22 },
  { id: '10', name: 'ACM Computing Surveys', category: 'ACM Tier 1', points: 21 },
  { id: '11', name: 'Communications of the ACM', category: 'ACM Tier 1', points: 19 },
  
  // Top conferences (15-20 points)
  { id: '12', name: 'NeurIPS', category: 'Top Conference', points: 20, description: 'Neural Information Processing Systems' },
  { id: '13', name: 'ICML', category: 'Top Conference', points: 20, description: 'International Conference on Machine Learning' },
  { id: '14', name: 'ICCV', category: 'Top Conference', points: 19, description: 'International Conference on Computer Vision' },
  { id: '15', name: 'CVPR', category: 'Top Conference', points: 19, description: 'Computer Vision and Pattern Recognition' },
  { id: '16', name: 'SIGCOMM', category: 'Top Conference', points: 18 },
  { id: '17', name: 'SIGMOD', category: 'Top Conference', points: 18 },
  
  // Springer/Elsevier high-impact (12-18 points)
  { id: '18', name: 'Journal of Machine Learning Research', category: 'High-impact Journal', points: 18 },
  { id: '19', name: 'Artificial Intelligence', category: 'High-impact Journal', points: 17 },
  { id: '20', name: 'Pattern Recognition', category: 'High-impact Journal', points: 16 },
  { id: '21', name: 'Computer Vision and Image Understanding', category: 'High-impact Journal', points: 15 },
  { id: '22', name: 'Information Sciences', category: 'High-impact Journal', points: 14 },
  
  // Regional/specialized conferences (8-15 points)
  { id: '23', name: 'ECCV', category: 'Regional Conference', points: 15, description: 'European Conference on Computer Vision' },
  { id: '24', name: 'AAAI', category: 'Regional Conference', points: 14 },
  { id: '25', name: 'IJCAI', category: 'Regional Conference', points: 14 },
  { id: '26', name: 'ICASSP', category: 'Regional Conference', points: 12 },
  { id: '27', name: 'ICLR', category: 'Regional Conference', points: 17 },
  
  // Standard journals (5-12 points)
  { id: '28', name: 'Expert Systems with Applications', category: 'Standard Journal', points: 10 },
  { id: '29', name: 'Neurocomputing', category: 'Standard Journal', points: 9 },
  { id: '30', name: 'Applied Soft Computing', category: 'Standard Journal', points: 8 },
  { id: '31', name: 'Knowledge-Based Systems', category: 'Standard Journal', points: 10 },
  
  // Workshop/local conferences (2-8 points)
  { id: '32', name: 'Workshop Paper', category: 'Workshop', points: 5 },
  { id: '33', name: 'Local Conference', category: 'Local Conference', points: 6 },
  { id: '34', name: 'Symposium', category: 'Symposium', points: 7 },
  
  // Other publications (1-5 points)
  { id: '35', name: 'ArXiv Preprint', category: 'Preprint', points: 2 },
  { id: '36', name: 'Technical Report', category: 'Report', points: 3 },
  { id: '37', name: 'Book Chapter', category: 'Book', points: 8 },
  { id: '38', name: 'Patent', category: 'Patent', points: 12 },
  { id: '39', name: 'Other', category: 'Other', points: 1 }
];

export function getPublicationSources(): PublicationSource[] {
  const stored = localStorage.getItem('publicationSources');
  return stored ? JSON.parse(stored) : defaultPublicationSources;
}

export function savePublicationSources(sources: PublicationSource[]): void {
  localStorage.setItem('publicationSources', JSON.stringify(sources));
}

export function getSourceById(id: string): PublicationSource | undefined {
  return getPublicationSources().find(source => source.id === id);
}

export function getSourcesByCategory(): Record<string, PublicationSource[]> {
  const sources = getPublicationSources();
  return sources.reduce((acc, source) => {
    if (!acc[source.category]) {
      acc[source.category] = [];
    }
    acc[source.category].push(source);
    return acc;
  }, {} as Record<string, PublicationSource[]>);
}
