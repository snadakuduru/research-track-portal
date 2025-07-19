import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, FileText, Award, Calendar, ExternalLink, Edit, Save, X } from "lucide-react";
import { Candidate } from "@/types";
import { updateCandidate } from "@/data/candidates";
import { getSourceById } from "@/data/publicationSources";
import { useToast } from "@/hooks/use-toast";

interface CandidateDetailsProps {
  candidate: Candidate;
  onBack: () => void;
}

export function CandidateDetails({ candidate, onBack }: CandidateDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCandidate, setEditedCandidate] = useState(candidate);
  const { toast } = useToast();

  const handleSave = () => {
    updateCandidate(editedCandidate);
    setIsEditing(false);
    toast({
      title: "Candidate Updated",
      description: "Changes have been saved successfully."
    });
  };

  const handleCancel = () => {
    setEditedCandidate(candidate);
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-pending text-pending-foreground',
      approved: 'bg-success text-success-foreground',
      rejected: 'bg-destructive text-destructive-foreground',
      flagged: 'bg-warning text-warning-foreground'
    } as const;
    return colors[status as keyof typeof colors] || 'bg-muted';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{candidate.name}</h1>
            <p className="text-muted-foreground">{candidate.institution}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                {isEditing ? (
                  <Select 
                    value={editedCandidate.status} 
                    onValueChange={(value) => 
                      setEditedCandidate(prev => ({ ...prev, status: value as any }))
                    }
                  >
                    <SelectTrigger className="w-32 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className={getStatusColor(candidate.status)}>
                    {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Score</p>
                <p className="text-2xl font-bold text-primary">{candidate.totalScore}</p>
              </div>
              <Award className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Publications</p>
                <p className="text-2xl font-bold">{candidate.publications.length}</p>
              </div>
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="text-sm font-medium">
                  {new Date(candidate.submissionDate).toLocaleDateString()}
                </p>
              </div>
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Email</dt>
              <dd className="text-sm">{candidate.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Institution</dt>
              <dd className="text-sm">{candidate.institution}</dd>
            </div>
            {candidate.department && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Department</dt>
                <dd className="text-sm">{candidate.department}</dd>
              </div>
            )}
            {candidate.position && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Position</dt>
                <dd className="text-sm">{candidate.position}</dd>
              </div>
            )}
            {candidate.phone && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                <dd className="text-sm">{candidate.phone}</dd>
              </div>
            )}
            {candidate.orcid && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">ORCID iD</dt>
                <dd className="text-sm">{candidate.orcid}</dd>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Publications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Research Publications ({candidate.publications.length})
          </CardTitle>
          <CardDescription>
            Detailed breakdown of publications and scoring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {candidate.publications.map((publication, index) => {
            const source = getSourceById(publication.source);
            
            return (
              <div key={publication.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium leading-tight">{publication.title}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">
                        {publication.type.charAt(0).toUpperCase() + publication.type.slice(1)}
                      </Badge>
                      {source && (
                        <Badge variant="outline">
                          {source.name}
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {source?.category}
                      </Badge>
                    </div>
                  </div>
                  <Badge className="bg-primary text-primary-foreground font-semibold text-base px-3 py-1">
                    {publication.score} pts
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(publication.publicationDate).toLocaleDateString()}
                  </div>
                  {publication.doi && (
                    <div className="flex items-center gap-1">
                      <span>DOI:</span>
                      <span className="font-mono text-xs">{publication.doi}</span>
                    </div>
                  )}
                  {publication.url && (
                    <div className="flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      <a 
                        href={publication.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        View Publication
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Reviewer Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Reviewer Notes & Evaluation</CardTitle>
          <CardDescription>
            Internal notes and scoring for this candidate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Reviewer Notes</label>
            <Textarea
              value={editedCandidate.reviewerNotes || ''}
              onChange={(e) => 
                setEditedCandidate(prev => ({ ...prev, reviewerNotes: e.target.value }))
              }
              placeholder="Add internal notes about this candidate..."
              className="mt-1"
              rows={4}
              disabled={!isEditing}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Reviewer Score</label>
              <Select 
                value={editedCandidate.reviewerScore?.toString() || ''} 
                onValueChange={(value) => 
                  setEditedCandidate(prev => ({ 
                    ...prev, 
                    reviewerScore: value ? parseInt(value) : undefined 
                  }))
                }
                disabled={!isEditing}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select reviewer score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No score assigned</SelectItem>
                  <SelectItem value="1">1 - Poor</SelectItem>
                  <SelectItem value="2">2 - Below Average</SelectItem>
                  <SelectItem value="3">3 - Average</SelectItem>
                  <SelectItem value="4">4 - Good</SelectItem>
                  <SelectItem value="5">5 - Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}