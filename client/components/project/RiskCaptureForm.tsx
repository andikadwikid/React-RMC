import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Save,
  X,
  FileText,
} from "lucide-react";

type RiskLevel = "low" | "medium" | "high" | "critical";
type RiskLikelihood = "very-low" | "low" | "medium" | "high" | "very-high";
type RiskImpact = "very-low" | "low" | "medium" | "high" | "very-high";

interface RiskItem {
  id: string;
  category: string;
  description: string;
  likelihood: RiskLikelihood;
  impact: RiskImpact;
  riskLevel: RiskLevel;
  mitigation: string;
  owner: string;
}

interface RiskCaptureFormProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  onSave: (data: any) => void;
}

const riskCategories = [
  {
    id: "technical",
    name: "Technical Risk",
    description: "Teknologi, arsitektur, dan implementasi teknis",
    icon: "⚙️",
  },
  {
    id: "business",
    name: "Business Risk", 
    description: "Bisnis proses, stakeholder, dan requirement",
    icon: "💼",
  },
  {
    id: "resource",
    name: "Resource Risk",
    description: "Team, budget, dan sumber daya project",
    icon: "👥",
  },
  {
    id: "timeline",
    name: "Timeline Risk",
    description: "Jadwal, deadline, dan milestone dependencies",
    icon: "📅",
  },
  {
    id: "external",
    name: "External Risk",
    description: "Vendor, regulasi, dan faktor eksternal",
    icon: "🌐",
  },
  {
    id: "operational",
    name: "Operational Risk",
    description: "Operasional, maintenance, dan sustainability",
    icon: "🔧",
  },
];

const riskLevelColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800", 
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

const getRiskLevel = (likelihood: RiskLikelihood, impact: RiskImpact): RiskLevel => {
  const scoreMap = {
    "very-low": 1,
    "low": 2,
    "medium": 3,
    "high": 4,
    "very-high": 5,
  };
  
  const score = scoreMap[likelihood] * scoreMap[impact];
  
  if (score <= 4) return "low";
  if (score <= 9) return "medium";
  if (score <= 16) return "high";
  return "critical";
};

export function RiskCaptureForm({
  isOpen,
  onClose,
  projectId,
  projectName,
  onSave,
}: RiskCaptureFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const [currentRisk, setCurrentRisk] = useState<Partial<RiskItem>>({
    category: riskCategories[0].id,
    likelihood: "medium",
    impact: "medium",
  });

  const addRisk = () => {
    if (!currentRisk.description || !currentRisk.mitigation || !currentRisk.owner) {
      return;
    }

    const riskLevel = getRiskLevel(
      currentRisk.likelihood as RiskLikelihood,
      currentRisk.impact as RiskImpact
    );

    const newRisk: RiskItem = {
      id: Date.now().toString(),
      category: currentRisk.category!,
      description: currentRisk.description,
      likelihood: currentRisk.likelihood as RiskLikelihood,
      impact: currentRisk.impact as RiskImpact,
      riskLevel,
      mitigation: currentRisk.mitigation,
      owner: currentRisk.owner!,
    };

    setRisks([...risks, newRisk]);
    setCurrentRisk({
      category: riskCategories[currentStep]?.id || riskCategories[0].id,
      likelihood: "medium",
      impact: "medium",
    });
  };

  const removeRisk = (id: string) => {
    setRisks(risks.filter(r => r.id !== id));
  };

  const nextCategory = () => {
    if (currentStep < riskCategories.length - 1) {
      setCurrentStep(currentStep + 1);
      setCurrentRisk({
        category: riskCategories[currentStep + 1].id,
        likelihood: "medium",
        impact: "medium",
      });
    }
  };

  const prevCategory = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCurrentRisk({
        category: riskCategories[currentStep - 1].id,
        likelihood: "medium",
        impact: "medium",
      });
    }
  };

  const handleSave = () => {
    const riskData = {
      projectId,
      risks,
      completedAt: new Date().toISOString(),
      totalRisks: risks.length,
      riskDistribution: {
        low: risks.filter(r => r.riskLevel === "low").length,
        medium: risks.filter(r => r.riskLevel === "medium").length,
        high: risks.filter(r => r.riskLevel === "high").length,
        critical: risks.filter(r => r.riskLevel === "critical").length,
      },
    };
    
    onSave(riskData);
    onClose();
  };

  const categoryRisks = risks.filter(r => r.category === riskCategories[currentStep].id);
  const progress = ((currentStep + 1) / riskCategories.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Risk Capture Assessment - {projectName}
          </DialogTitle>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Progress Assessment</span>
              <span>{currentStep + 1} of {riskCategories.length} categories</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Category */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{riskCategories[currentStep].icon}</span>
                {riskCategories[currentStep].name}
              </CardTitle>
              <CardDescription>
                {riskCategories[currentStep].description}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Risk Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tambah Risk Baru</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Deskripsi Risk</label>
                <Textarea
                  placeholder="Jelaskan risk yang teridentifikasi..."
                  value={currentRisk.description || ""}
                  onChange={(e) => setCurrentRisk({...currentRisk, description: e.target.value})}
                  className="min-h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Likelihood</label>
                  <Select 
                    value={currentRisk.likelihood} 
                    onValueChange={(value) => setCurrentRisk({...currentRisk, likelihood: value as RiskLikelihood})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="very-low">Very Low (1)</SelectItem>
                      <SelectItem value="low">Low (2)</SelectItem>
                      <SelectItem value="medium">Medium (3)</SelectItem>
                      <SelectItem value="high">High (4)</SelectItem>
                      <SelectItem value="very-high">Very High (5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Impact</label>
                  <Select 
                    value={currentRisk.impact} 
                    onValueChange={(value) => setCurrentRisk({...currentRisk, impact: value as RiskImpact})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="very-low">Very Low (1)</SelectItem>
                      <SelectItem value="low">Low (2)</SelectItem>
                      <SelectItem value="medium">Medium (3)</SelectItem>
                      <SelectItem value="high">High (4)</SelectItem>
                      <SelectItem value="very-high">Very High (5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {currentRisk.likelihood && currentRisk.impact && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Calculated Risk Level:</span>
                    <Badge className={riskLevelColors[getRiskLevel(currentRisk.likelihood, currentRisk.impact)]}>
                      {getRiskLevel(currentRisk.likelihood, currentRisk.impact).toUpperCase()}
                    </Badge>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">Mitigation Strategy</label>
                <Textarea
                  placeholder="Strategi mitigasi untuk menangani risk ini..."
                  value={currentRisk.mitigation || ""}
                  onChange={(e) => setCurrentRisk({...currentRisk, mitigation: e.target.value})}
                  className="min-h-20"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Risk Owner</label>
                <Select 
                  value={currentRisk.owner} 
                  onValueChange={(value) => setCurrentRisk({...currentRisk, owner: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih risk owner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="project-manager">Project Manager</SelectItem>
                    <SelectItem value="tech-lead">Tech Lead</SelectItem>
                    <SelectItem value="business-analyst">Business Analyst</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={addRisk}
                disabled={!currentRisk.description || !currentRisk.mitigation || !currentRisk.owner}
                className="w-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                Tambah Risk
              </Button>
            </CardContent>
          </Card>

          {/* Category Risks List */}
          {categoryRisks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Risks yang Teridentifikasi ({categoryRisks.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryRisks.map((risk) => (
                    <div key={risk.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{risk.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={riskLevelColors[risk.riskLevel]}>
                              {risk.riskLevel.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Owner: {risk.owner}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRisk(risk.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">{risk.mitigation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={prevCategory}
              disabled={currentStep === 0}
            >
              Previous Category
            </Button>
            
            <div className="flex gap-2">
              {currentStep < riskCategories.length - 1 ? (
                <Button onClick={nextCategory}>
                  Next Category
                </Button>
              ) : (
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Risk Assessment
                </Button>
              )}
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>

          {/* Summary */}
          {risks.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-blue-800">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Assessment Summary: {risks.length} risks identified</span>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-2 text-sm">
                  <div>Low: {risks.filter(r => r.riskLevel === "low").length}</div>
                  <div>Medium: {risks.filter(r => r.riskLevel === "medium").length}</div>
                  <div>High: {risks.filter(r => r.riskLevel === "high").length}</div>
                  <div>Critical: {risks.filter(r => r.riskLevel === "critical").length}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
