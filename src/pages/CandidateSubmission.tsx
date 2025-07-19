import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, FileText, User, Upload } from "lucide-react";
import { PersonalInfoForm } from "@/components/forms/PersonalInfoForm";
import { PublicationsForm } from "@/components/forms/PublicationsForm";
import { ReviewSubmission } from "@/components/forms/ReviewSubmission";
import { FormStep, Candidate, Publication } from "@/types";
import { addCandidate } from "@/data/candidates";
import { useToast } from "@/hooks/use-toast";

const steps: FormStep[] = [
  { id: 'personal', title: 'Personal Information', description: 'Basic details and contact info', completed: false },
  { id: 'publications', title: 'Research Publications', description: 'Add your research publications', completed: false },
  { id: 'review', title: 'Review & Submit', description: 'Review your submission', completed: false }
];

export default function CandidateSubmission() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formSteps, setFormSteps] = useState(steps);
  const [personalData, setPersonalData] = useState<Partial<Candidate>>({});
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const updateStepCompletion = (stepIndex: number, completed: boolean) => {
    const updated = [...formSteps];
    updated[stepIndex].completed = completed;
    setFormSteps(updated);
  };

  const handlePersonalInfoComplete = (data: Partial<Candidate>) => {
    setPersonalData(data);
    updateStepCompletion(0, true);
    setCurrentStep(1);
  };

  const handlePublicationsComplete = (pubs: Publication[]) => {
    setPublications(pubs);
    updateStepCompletion(1, true);
    setCurrentStep(2);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const totalScore = publications.reduce((sum, pub) => sum + pub.score, 0);
      
      const candidate: Candidate = {
        id: Date.now().toString(),
        ...personalData as Candidate,
        publications,
        totalScore,
        submissionDate: new Date().toISOString(),
        status: 'pending'
      };

      addCandidate(candidate);
      
      updateStepCompletion(2, true);
      
      toast({
        title: "Submission Successful!",
        description: `Your application has been submitted. Reference ID: ${candidate.id}`,
      });
      
      // Reset form or redirect
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Header */}
      <Card className="bg-gradient-to-r from-card to-accent/10 border-none shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl text-center">Research Submission Portal</CardTitle>
          <CardDescription className="text-center">
            Submit your research publications for evaluation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={progress} className="h-2" />
          
          <div className="flex justify-between items-center">
            {formSteps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-2">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${index < currentStep ? 'bg-success text-success-foreground' :
                    index === currentStep ? 'bg-primary text-primary-foreground' :
                    'bg-muted text-muted-foreground'}
                `}>
                  {index < currentStep ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs text-muted-foreground">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card className="shadow-medium">
        <CardContent className="p-8">
          {currentStep === 0 && (
            <PersonalInfoForm 
              onComplete={handlePersonalInfoComplete}
              initialData={personalData}
            />
          )}
          
          {currentStep === 1 && (
            <PublicationsForm 
              onComplete={handlePublicationsComplete}
              initialPublications={publications}
              onBack={() => setCurrentStep(0)}
            />
          )}
          
          {currentStep === 2 && (
            <ReviewSubmission 
              personalData={personalData}
              publications={publications}
              onSubmit={handleSubmit}
              onBack={() => setCurrentStep(1)}
              isSubmitting={isSubmitting}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}