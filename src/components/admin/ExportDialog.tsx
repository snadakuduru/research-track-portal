import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Download, FileSpreadsheet, FileText, Users } from "lucide-react";
import { Candidate } from "@/types";
import { getSourceById } from "@/data/publicationSources";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidates: Candidate[];
}

export function ExportDialog({ open, onOpenChange, candidates }: ExportDialogProps) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [includeFields, setIncludeFields] = useState({
    personalInfo: true,
    publications: true,
    scoring: true,
    reviewerNotes: false
  });

  const handleExport = () => {
    const data = candidates.map(candidate => {
      const baseData: any = {
        id: candidate.id,
        submissionDate: candidate.submissionDate,
        status: candidate.status
      };

      if (includeFields.personalInfo) {
        Object.assign(baseData, {
          name: candidate.name,
          email: candidate.email,
          institution: candidate.institution,
          department: candidate.department || '',
          position: candidate.position || '',
          phone: candidate.phone || '',
          orcid: candidate.orcid || ''
        });
      }

      if (includeFields.scoring) {
        Object.assign(baseData, {
          totalScore: candidate.totalScore,
          publicationCount: candidate.publications.length,
          averagePublicationScore: candidate.publications.length > 0 ? 
            candidate.totalScore / candidate.publications.length : 0
        });
      }

      if (includeFields.reviewerNotes) {
        Object.assign(baseData, {
          reviewerNotes: candidate.reviewerNotes || '',
          reviewerScore: candidate.reviewerScore || ''
        });
      }

      if (includeFields.publications) {
        candidate.publications.forEach((pub, index) => {
          const source = getSourceById(pub.source);
          Object.assign(baseData, {
            [`publication_${index + 1}_title`]: pub.title,
            [`publication_${index + 1}_type`]: pub.type,
            [`publication_${index + 1}_source`]: source?.name || '',
            [`publication_${index + 1}_category`]: source?.category || '',
            [`publication_${index + 1}_score`]: pub.score,
            [`publication_${index + 1}_date`]: pub.publicationDate,
            [`publication_${index + 1}_doi`]: pub.doi || '',
            [`publication_${index + 1}_url`]: pub.url || ''
          });
        });
      }

      return baseData;
    });

    if (exportFormat === 'csv') {
      exportToCSV(data);
    } else {
      exportToJSON(data);
    }

    onOpenChange(false);
  };

  const exportToCSV = (data: any[]) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    downloadFile(csvContent, 'candidates_export.csv', 'text/csv');
  };

  const exportToJSON = (data: any[]) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, 'candidates_export.json', 'application/json');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Candidate Data
          </DialogTitle>
          <DialogDescription>
            Export candidate submissions in your preferred format
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Format */}
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select value={exportFormat} onValueChange={(value: 'csv' | 'json') => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    CSV (Excel Compatible)
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    JSON (Raw Data)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Include Fields */}
          <div className="space-y-3">
            <Label>Include Data</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="personalInfo"
                  checked={includeFields.personalInfo}
                  onCheckedChange={(checked) => 
                    setIncludeFields(prev => ({ ...prev, personalInfo: !!checked }))
                  }
                />
                <Label htmlFor="personalInfo" className="text-sm">
                  Personal Information
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="publications"
                  checked={includeFields.publications}
                  onCheckedChange={(checked) => 
                    setIncludeFields(prev => ({ ...prev, publications: !!checked }))
                  }
                />
                <Label htmlFor="publications" className="text-sm">
                  Publications Details
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scoring"
                  checked={includeFields.scoring}
                  onCheckedChange={(checked) => 
                    setIncludeFields(prev => ({ ...prev, scoring: !!checked }))
                  }
                />
                <Label htmlFor="scoring" className="text-sm">
                  Scoring & Statistics
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reviewerNotes"
                  checked={includeFields.reviewerNotes}
                  onCheckedChange={(checked) => 
                    setIncludeFields(prev => ({ ...prev, reviewerNotes: !!checked }))
                  }
                />
                <Label htmlFor="reviewerNotes" className="text-sm">
                  Reviewer Notes & Scores
                </Label>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              <span>Exporting {candidates.length} candidate{candidates.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export {exportFormat.toUpperCase()}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}