import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Plus, Trash2, Calendar, ExternalLink, Award } from "lucide-react";
import { Publication } from "@/types";
import { getPublicationSources, getSourcesByCategory, getSourceById } from "@/data/publicationSources";

interface PublicationsFormProps {
  onComplete: (publications: Publication[]) => void;
  initialPublications?: Publication[];
  onBack: () => void;
}

export function PublicationsForm({ onComplete, initialPublications = [], onBack }: PublicationsFormProps) {
  const [publications, setPublications] = useState<Publication[]>(
    initialPublications.length > 0 ? initialPublications : [createEmptyPublication()]
  );
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});
  
  const sourcesByCategory = getSourcesByCategory();

  function createEmptyPublication(): Publication {
    return {
      id: Date.now().toString() + Math.random(),
      title: '',
      type: 'journal',
      source: '',
      doi: '',
      url: '',
      publicationDate: '',
      score: 0
    };
  }

  const addPublication = () => {
    setPublications([...publications, createEmptyPublication()]);
  };

  const removePublication = (id: string) => {
    if (publications.length > 1) {
      setPublications(publications.filter(pub => pub.id !== id));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const updatePublication = (id: string, field: keyof Publication, value: any) => {
    setPublications(prev => prev.map(pub => {
      if (pub.id === id) {
        const updated = { ...pub, [field]: value };
        
        // Update score when source changes
        if (field === 'source') {
          const source = getSourceById(value);
          updated.score = source ? source.points : 0;
        }
        
        return updated;
      }
      return pub;
    }));

    // Clear errors for this field
    if (errors[id]?.[field]) {
      setErrors(prev => ({
        ...prev,
        [id]: { ...prev[id], [field]: '' }
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, Record<string, string>> = {};

    publications.forEach(pub => {
      const pubErrors: Record<string, string> = {};
      
      if (!pub.title.trim()) pubErrors.title = 'Title is required';
      if (!pub.source) pubErrors.source = 'Publication source is required';
      if (!pub.publicationDate) pubErrors.publicationDate = 'Publication date is required';
      
      if (pub.doi && !/^10\.\d+\/.+/.test(pub.doi)) {
        pubErrors.doi = 'Invalid DOI format';
      }
      
      if (pub.url && !/^https?:\/\/.+/.test(pub.url)) {
        pubErrors.url = 'Invalid URL format';
      }

      if (Object.keys(pubErrors).length > 0) {
        newErrors[pub.id] = pubErrors;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && publications.some(pub => pub.title.trim())) {
      const validPublications = publications.filter(pub => pub.title.trim());
      onComplete(validPublications);
    }
  };

  const totalScore = publications.reduce((sum, pub) => sum + pub.score, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Research Publications</h2>
        <p className="text-muted-foreground">Add your research publications for evaluation</p>
      </div>

      {/* Score Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary-light/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <span className="font-medium">Total Score</span>
            </div>
            <Badge variant="outline" className="text-lg font-bold px-3 py-1">
              {totalScore} points
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Publications */}
      <div className="space-y-6">
        {publications.map((publication, index) => (
          <Card key={publication.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Publication {index + 1}</CardTitle>
                <div className="flex items-center gap-2">
                  {publication.score > 0 && (
                    <Badge className="bg-success text-success-foreground">
                      {publication.score} pts
                    </Badge>
                  )}
                  {publications.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePublication(publication.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor={`title-${publication.id}`}>Publication Title *</Label>
                  <Input
                    id={`title-${publication.id}`}
                    value={publication.title}
                    onChange={(e) => updatePublication(publication.id, 'title', e.target.value)}
                    placeholder="Enter the full title of your publication"
                    className={errors[publication.id]?.title ? 'border-destructive' : ''}
                  />
                  {errors[publication.id]?.title && (
                    <p className="text-sm text-destructive">{errors[publication.id].title}</p>
                  )}
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <Label htmlFor={`type-${publication.id}`}>Publication Type</Label>
                  <Select 
                    value={publication.type} 
                    onValueChange={(value) => updatePublication(publication.id, 'type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="journal">Journal Article</SelectItem>
                      <SelectItem value="conference">Conference Paper</SelectItem>
                      <SelectItem value="book">Book</SelectItem>
                      <SelectItem value="chapter">Book Chapter</SelectItem>
                      <SelectItem value="patent">Patent</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Publication Source */}
                <div className="space-y-2">
                  <Label htmlFor={`source-${publication.id}`}>Publication Source *</Label>
                  <Select 
                    value={publication.source} 
                    onValueChange={(value) => updatePublication(publication.id, 'source', value)}
                  >
                    <SelectTrigger className={errors[publication.id]?.source ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select publication source" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {Object.entries(sourcesByCategory).map(([category, sources]) => (
                        <div key={category}>
                          <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {category}
                          </div>
                          {sources.map(source => (
                            <SelectItem key={source.id} value={source.id}>
                              <div className="flex items-center justify-between w-full">
                                <span>{source.name}</span>
                                <Badge variant="outline" className="ml-2">
                                  {source.points} pts
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors[publication.id]?.source && (
                    <p className="text-sm text-destructive">{errors[publication.id].source}</p>
                  )}
                </div>

                {/* Publication Date */}
                <div className="space-y-2">
                  <Label htmlFor={`date-${publication.id}`}>Publication Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id={`date-${publication.id}`}
                      type="date"
                      value={publication.publicationDate}
                      onChange={(e) => updatePublication(publication.id, 'publicationDate', e.target.value)}
                      className={`pl-10 ${errors[publication.id]?.publicationDate ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors[publication.id]?.publicationDate && (
                    <p className="text-sm text-destructive">{errors[publication.id].publicationDate}</p>
                  )}
                </div>

                {/* DOI */}
                <div className="space-y-2">
                  <Label htmlFor={`doi-${publication.id}`}>DOI</Label>
                  <Input
                    id={`doi-${publication.id}`}
                    value={publication.doi}
                    onChange={(e) => updatePublication(publication.id, 'doi', e.target.value)}
                    placeholder="10.1000/example"
                    className={errors[publication.id]?.doi ? 'border-destructive' : ''}
                  />
                  {errors[publication.id]?.doi && (
                    <p className="text-sm text-destructive">{errors[publication.id].doi}</p>
                  )}
                </div>

                {/* URL */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor={`url-${publication.id}`}>Publication URL</Label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id={`url-${publication.id}`}
                      value={publication.url}
                      onChange={(e) => updatePublication(publication.id, 'url', e.target.value)}
                      placeholder="https://example.com/publication"
                      className={`pl-10 ${errors[publication.id]?.url ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors[publication.id]?.url && (
                    <p className="text-sm text-destructive">{errors[publication.id].url}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Publication Button */}
      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={addPublication}
          className="w-full max-w-xs"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Publication
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Personal Info
        </Button>
        <Button type="submit" className="min-w-32">
          Continue to Review
        </Button>
      </div>
    </form>
  );
}