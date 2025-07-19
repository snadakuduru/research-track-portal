import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Edit, Trash2, Save, X } from "lucide-react";
import { PublicationSource } from "@/types";
import { getPublicationSources, savePublicationSources } from "@/data/publicationSources";
import { useToast } from "@/hooks/use-toast";

interface PublicationSourceManagerProps {
  onBack: () => void;
}

export function PublicationSourceManager({ onBack }: PublicationSourceManagerProps) {
  const [sources, setSources] = useState<PublicationSource[]>(getPublicationSources());
  const [editingSource, setEditingSource] = useState<PublicationSource | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { toast } = useToast();

  const categories = Array.from(new Set(sources.map(s => s.category)));

  const filteredSources = sources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         source.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || source.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const createNewSource = (): PublicationSource => ({
    id: Date.now().toString(),
    name: '',
    category: '',
    points: 0,
    description: ''
  });

  const handleSave = (source: PublicationSource) => {
    if (!source.name.trim() || !source.category.trim() || source.points < 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields with valid values.",
        variant: "destructive"
      });
      return;
    }

    let updatedSources;
    if (isAddingNew) {
      updatedSources = [...sources, source];
      setIsAddingNew(false);
    } else {
      updatedSources = sources.map(s => s.id === source.id ? source : s);
    }
    
    setSources(updatedSources);
    savePublicationSources(updatedSources);
    setEditingSource(null);
    
    toast({
      title: "Source Updated",
      description: "Publication source has been saved successfully."
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this publication source?")) {
      const updatedSources = sources.filter(s => s.id !== id);
      setSources(updatedSources);
      savePublicationSources(updatedSources);
      
      toast({
        title: "Source Deleted",
        description: "Publication source has been removed."
      });
    }
  };

  const EditForm = ({ source, onSave, onCancel }: {
    source: PublicationSource;
    onSave: (source: PublicationSource) => void;
    onCancel: () => void;
  }) => {
    const [editedSource, setEditedSource] = useState(source);

    return (
      <TableRow>
        <TableCell>
          <Input
            value={editedSource.name}
            onChange={(e) => setEditedSource(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Publication name"
          />
        </TableCell>
        <TableCell>
          <Input
            value={editedSource.category}
            onChange={(e) => setEditedSource(prev => ({ ...prev, category: e.target.value }))}
            placeholder="Category"
          />
        </TableCell>
        <TableCell>
          <Input
            type="number"
            min="0"
            max="100"
            value={editedSource.points}
            onChange={(e) => setEditedSource(prev => ({ 
              ...prev, 
              points: Math.max(0, parseInt(e.target.value) || 0) 
            }))}
          />
        </TableCell>
        <TableCell>
          <Input
            value={editedSource.description || ''}
            onChange={(e) => setEditedSource(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Optional description"
          />
        </TableCell>
        <TableCell>
          <div className="flex gap-1">
            <Button size="sm" onClick={() => onSave(editedSource)}>
              <Save className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={onCancel}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
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
            <h1 className="text-2xl font-bold">Publication Sources</h1>
            <p className="text-muted-foreground">Manage publication sources and their point values</p>
          </div>
        </div>
        
        <Button 
          onClick={() => {
            setEditingSource(createNewSource());
            setIsAddingNew(true);
          }}
          disabled={isAddingNew || editingSource !== null}
        >
          <Plus className="h-4 w-4" />
          Add New Source
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Sources</p>
              <p className="text-2xl font-bold">{sources.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-2xl font-bold">{categories.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Avg Points</p>
              <p className="text-2xl font-bold">
                {sources.length > 0 ? 
                  Math.round(sources.reduce((sum, s) => sum + s.points, 0) / sources.length) : 0
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search sources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sources Table */}
      <Card>
        <CardHeader>
          <CardTitle>Publication Sources ({filteredSources.length})</CardTitle>
          <CardDescription>
            Manage publication sources and their evaluation criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isAddingNew && editingSource && (
                <EditForm
                  source={editingSource}
                  onSave={handleSave}
                  onCancel={() => {
                    setIsAddingNew(false);
                    setEditingSource(null);
                  }}
                />
              )}
              
              {filteredSources.map((source) => (
                editingSource?.id === source.id && !isAddingNew ? (
                  <EditForm
                    key={source.id}
                    source={editingSource}
                    onSave={handleSave}
                    onCancel={() => setEditingSource(null)}
                  />
                ) : (
                  <TableRow key={source.id}>
                    <TableCell className="font-medium">{source.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{source.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-primary text-primary-foreground font-semibold">
                        {source.points} pts
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {source.description || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setEditingSource(source)}
                          disabled={editingSource !== null || isAddingNew}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleDelete(source.id)}
                          disabled={editingSource !== null || isAddingNew}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}