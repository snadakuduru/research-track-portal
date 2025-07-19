import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Building, Phone, ExternalLink } from "lucide-react";
import { Candidate } from "@/types";

interface PersonalInfoFormProps {
  onComplete: (data: Partial<Candidate>) => void;
  initialData?: Partial<Candidate>;
}

export function PersonalInfoForm({ onComplete, initialData = {} }: PersonalInfoFormProps) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    institution: initialData.institution || '',
    department: initialData.department || '',
    position: initialData.position || '',
    phone: initialData.phone || '',
    orcid: initialData.orcid || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.institution.trim()) newErrors.institution = 'Institution is required';

    if (formData.orcid && !/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(formData.orcid)) {
      newErrors.orcid = 'Invalid ORCID format (xxxx-xxxx-xxxx-xxxx)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onComplete(formData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Personal Information</h2>
        <p className="text-muted-foreground">Please provide your basic details and contact information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter your full name"
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="your.email@institution.edu"
              className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
            />
          </div>
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>

        {/* Institution */}
        <div className="space-y-2">
          <Label htmlFor="institution">Institution *</Label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="institution"
              value={formData.institution}
              onChange={(e) => handleChange('institution', e.target.value)}
              placeholder="University or Organization"
              className={`pl-10 ${errors.institution ? 'border-destructive' : ''}`}
            />
          </div>
          {errors.institution && <p className="text-sm text-destructive">{errors.institution}</p>}
        </div>

        {/* Department */}
        <div className="space-y-2">
          <Label htmlFor="department">Department/Faculty</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => handleChange('department', e.target.value)}
            placeholder="e.g., Computer Science"
          />
        </div>

        {/* Position */}
        <div className="space-y-2">
          <Label htmlFor="position">Position/Title</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => handleChange('position', e.target.value)}
            placeholder="e.g., Professor, PhD Student, Researcher"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* ORCID */}
      <div className="space-y-2">
        <Label htmlFor="orcid">ORCID iD</Label>
        <div className="relative">
          <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="orcid"
            value={formData.orcid}
            onChange={(e) => handleChange('orcid', e.target.value)}
            placeholder="0000-0000-0000-0000"
            className={`pl-10 ${errors.orcid ? 'border-destructive' : ''}`}
          />
        </div>
        {errors.orcid && <p className="text-sm text-destructive">{errors.orcid}</p>}
        <p className="text-sm text-muted-foreground">
          Optional: Your ORCID identifier (format: xxxx-xxxx-xxxx-xxxx)
        </p>
      </div>

      <div className="flex justify-end pt-6">
        <Button type="submit" className="min-w-32">
          Continue to Publications
        </Button>
      </div>
    </form>
  );
}