import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, User, FileText, Award, Mail, Building, Calendar, ExternalLink } from "lucide-react";
import { Candidate, Publication } from "@/types";
import { getSourceById } from "@/data/publicationSources";

interface ReviewSubmissionProps {
  personalData: Partial<Candidate>;
  publications: Publication[];
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function ReviewSubmission({ 
  personalData, 
  publications, 
  onSubmit, 
  onBack, 
  isSubmitting 
}: ReviewSubmissionProps) {
  const totalScore = publications.reduce((sum, pub) => sum + pub.score, 0);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-6 w-6 text-success" />
        </div>
        <h2 className="text-2xl font-bold">Review Your Submission</h2>
        <p className="text-muted-foreground">Please review all information before submitting</p>
      </div>

      {/* Score Summary */}
      <Card className="bg-gradient-to-r from-success/5 to-primary/5 border-success/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-success" />
              <div>
                <h3 className="text-lg font-semibold">Total Evaluation Score</h3>
                <p className="text-sm text-muted-foreground">
                  Based on {publications.length} publication{publications.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-success">{totalScore}</div>
              <div className="text-sm text-muted-foreground">points</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Name</dt>
              <dd className="text-sm">{personalData.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Email</dt>
              <dd className="text-sm flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {personalData.email}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Institution</dt>
              <dd className="text-sm flex items-center gap-1">
                <Building className="h-3 w-3" />
                {personalData.institution}
              </dd>
            </div>
            {personalData.department && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Department</dt>
                <dd className="text-sm">{personalData.department}</dd>
              </div>
            )}
            {personalData.position && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Position</dt>
                <dd className="text-sm">{personalData.position}</dd>
              </div>
            )}
            {personalData.phone && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                <dd className="text-sm">{personalData.phone}</dd>
              </div>
            )}
            {personalData.orcid && (
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">ORCID iD</dt>
                <dd className="text-sm flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  {personalData.orcid}
                </dd>
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
            Research Publications ({publications.length})
          </CardTitle>
          <CardDescription>
            Your publications have been evaluated and scored based on the source prestige
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {publications.map((publication, index) => {
            const source = getSourceById(publication.source);
            
            return (
              <div key={publication.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm leading-tight">{publication.title}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {publication.type.charAt(0).toUpperCase() + publication.type.slice(1)}
                      </Badge>
                      {source && (
                        <Badge variant="outline" className="text-xs">
                          {source.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge className="bg-primary text-primary-foreground font-semibold">
                    {publication.score} pts
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(publication.publicationDate).toLocaleDateString()}
                  </div>
                  {publication.doi && (
                    <div className="flex items-center gap-1">
                      <span>DOI:</span>
                      <span className="font-mono">{publication.doi}</span>
                    </div>
                  )}
                  {publication.url && (
                    <div className="flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      <span>URL available</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Submission Notice */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-medium">Ready to Submit</h4>
              <p className="text-sm text-muted-foreground">
                By submitting this application, you confirm that all information provided is accurate and complete. 
                You will receive a confirmation email with your submission reference number.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
          Back to Publications
        </Button>
        <Button 
          onClick={onSubmit} 
          disabled={isSubmitting}
          className="min-w-32"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </div>
    </div>
  );
}