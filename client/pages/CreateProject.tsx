import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  ArrowLeft,
  Save,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  AlertTriangle,
  FileText,
  Clock,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface TimelineMilestone {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface ProjectFormData {
  name: string;
  description: string;
  client: string;
  clientEmail: string;
  clientPhone: string;
  budget: string;
  startDate: string;
  endDate: string;
  province: string;
  projectManager: string;
  category: string;
  timeline: TimelineMilestone[];
}

export default function CreateProject() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    client: "",
    clientEmail: "",
    clientPhone: "",
    budget: "",
    startDate: "",
    endDate: "",
    province: "",
    projectManager: "",
    category: "",
    timeline: [],
  });

  const [errors, setErrors] = useState<Partial<ProjectFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  const provinces = [
    "Aceh",
    "Bali",
    "Bangka Belitung",
    "Bengkulu",
    "DKI Jakarta",
    "Gorontalo",
    "Jambi",
    "Jawa Barat",
    "Jawa Tengah",
    "Jawa Timur",
    "Kalimantan Barat",
    "Kalimantan Selatan",
    "Kalimantan Tengah",
    "Kalimantan Timur",
    "Kalimantan Utara",
    "Kepulauan Riau",
    "Lampung",
    "Maluku",
    "Maluku Utara",
    "Nusa Tenggara Barat",
    "Nusa Tenggara Timur",
    "Papua",
    "Papua Barat",
    "Riau",
    "Sulawesi Barat",
    "Sulawesi Selatan",
    "Sulawesi Tengah",
    "Sulawesi Tenggara",
    "Sulawesi Utara",
    "Sumatera Barat",
    "Sumatera Selatan",
    "Sumatera Utara",
  ];

  const projectCategories = [
    "Web Development",
    "Mobile Development",
    "Desktop Application",
    "ERP System",
    "E-Commerce Platform",
    "Management System",
    "Analytics Dashboard",
    "IoT Solutions",
    "AI/ML Implementation",
    "Database Migration",
    "System Integration",
    "API Development",
    "Other",
  ];

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProjectFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama project wajib diisi";
    }
    if (!formData.client.trim()) {
      newErrors.client = "Nama client wajib diisi";
    }
    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = "Email client wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
      newErrors.clientEmail = "Format email tidak valid";
    }
    if (!formData.budget.trim()) {
      newErrors.budget = "Budget wajib diisi";
    } else if (isNaN(Number(formData.budget.replace(/\D/g, "")))) {
      newErrors.budget = "Budget harus berupa angka";
    }
    if (!formData.startDate) {
      newErrors.startDate = "Tanggal mulai wajib diisi";
    }
    if (!formData.endDate) {
      newErrors.endDate = "Tanggal selesai wajib diisi";
    }
    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) >= new Date(formData.endDate)
    ) {
      newErrors.endDate = "Tanggal selesai harus setelah tanggal mulai";
    }

    if (!formData.province) {
      newErrors.province = "Provinsi wajib dipilih";
    }
    if (!formData.projectManager.trim()) {
      newErrors.projectManager = "Project Manager wajib diisi";
    }
    if (!formData.category) {
      newErrors.category = "Kategori project wajib dipilih";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would typically send the data to your API
      console.log("Project data to submit:", formData);

      // Show success message and redirect
      alert("Project berhasil dibuat!");
      navigate("/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Gagal membuat project. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return new Intl.NumberFormat("id-ID").format(Number(numericValue));
  };

  const handleBudgetChange = (value: string) => {
    const formatted = formatCurrency(value);
    handleInputChange("budget", formatted);
  };

  const addTimelineMilestone = () => {
    const newMilestone: TimelineMilestone = {
      id: Date.now().toString(),
      title: "",
      description: "",
      startDate: "",
      endDate: "",
    };
    setFormData((prev) => ({
      ...prev,
      timeline: [...prev.timeline, newMilestone],
    }));
  };

  const removeTimelineMilestone = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((milestone) => milestone.id !== id),
    }));
  };

  const updateTimelineMilestone = (
    id: string,
    field: keyof TimelineMilestone,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      timeline: prev.timeline.map((milestone) =>
        milestone.id === id ? { ...milestone, [field]: value } : milestone,
      ),
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/projects">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            Buat Project Baru
          </h1>
          <p className="text-gray-600 mt-1">
            Tambahkan project baru ke dalam sistem manajemen risiko
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Informasi Dasar Project
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Project *</Label>
                <Input
                  id="name"
                  placeholder="Masukkan nama project"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori Project *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger
                    className={errors.category ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Project</Label>
              <Textarea
                id="description"
                placeholder="Deskripsikan project secara detail..."
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-green-600" />
              Informasi Client
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">Nama Client *</Label>
                <Input
                  id="client"
                  placeholder="PT. Nama Perusahaan"
                  value={formData.client}
                  onChange={(e) => handleInputChange("client", e.target.value)}
                  className={errors.client ? "border-red-500" : ""}
                />
                {errors.client && (
                  <p className="text-sm text-red-500">{errors.client}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email Client *</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  placeholder="client@company.com"
                  value={formData.clientEmail}
                  onChange={(e) =>
                    handleInputChange("clientEmail", e.target.value)
                  }
                  className={errors.clientEmail ? "border-red-500" : ""}
                />
                {errors.clientEmail && (
                  <p className="text-sm text-red-500">{errors.clientEmail}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientPhone">Nomor Telepon Client</Label>
                <Input
                  id="clientPhone"
                  placeholder="+62 812 3456 7890"
                  value={formData.clientPhone}
                  onChange={(e) =>
                    handleInputChange("clientPhone", e.target.value)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Detail Project
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province">Provinsi *</Label>
                <Select
                  value={formData.province}
                  onValueChange={(value) =>
                    handleInputChange("province", value)
                  }
                >
                  <SelectTrigger
                    className={errors.province ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Pilih provinsi" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.province && (
                  <p className="text-sm text-red-500">{errors.province}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Tanggal Mulai *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  className={errors.startDate ? "border-red-500" : ""}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500">{errors.startDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Tanggal Selesai *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  className={errors.endDate ? "border-red-500" : ""}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500">{errors.endDate}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget & Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              Budget & Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (IDR) *</Label>
              <Input
                id="budget"
                placeholder="1,000,000,000"
                value={formData.budget}
                onChange={(e) => handleBudgetChange(e.target.value)}
                className={errors.budget ? "border-red-500" : ""}
              />
              {errors.budget && (
                <p className="text-sm text-red-500">{errors.budget}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectManager">Project Manager *</Label>
              <Input
                id="projectManager"
                placeholder="Nama Project Manager"
                value={formData.projectManager}
                onChange={(e) =>
                  handleInputChange("projectManager", e.target.value)
                }
                className={errors.projectManager ? "border-red-500" : ""}
              />
              {errors.projectManager && (
                <p className="text-sm text-red-500">{errors.projectManager}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Timeline Section (Optional) */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" />
                Timeline Project (Opsional)
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowTimeline(!showTimeline)}
                className="flex items-center gap-2"
              >
                {showTimeline ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Sembunyikan
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Tampilkan Timeline
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Tambahkan milestone dan tahapan penting dalam project ini
            </p>
          </CardHeader>
          {showTimeline && (
            <CardContent className="space-y-4">
              {formData.timeline.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    Belum ada timeline milestone
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTimelineMilestone}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Milestone Pertama
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.timeline.map((milestone, index) => (
                    <div
                      key={milestone.id}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">
                          Milestone {index + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTimelineMilestone(milestone.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Judul Milestone</Label>
                          <Input
                            placeholder="e.g., Design Phase"
                            value={milestone.title}
                            onChange={(e) =>
                              updateTimelineMilestone(
                                milestone.id,
                                "title",
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Tanggal Mulai</Label>
                          <Input
                            type="date"
                            value={milestone.startDate}
                            onChange={(e) =>
                              updateTimelineMilestone(
                                milestone.id,
                                "startDate",
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Tanggal Selesai</Label>
                          <Input
                            type="date"
                            value={milestone.endDate}
                            onChange={(e) =>
                              updateTimelineMilestone(
                                milestone.id,
                                "endDate",
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label>Deskripsi</Label>
                          <Textarea
                            placeholder="Deskripsikan milestone ini..."
                            value={milestone.description}
                            onChange={(e) =>
                              updateTimelineMilestone(
                                milestone.id,
                                "description",
                                e.target.value,
                              )
                            }
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTimelineMilestone}
                    className="w-full flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Milestone Baru
                  </Button>
                </div>
              )}

              {formData.timeline.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Ringkasan Timeline
                    </span>
                  </div>
                  <div className="text-sm text-blue-700">
                    <p>
                      Total milestone:{" "}
                      <strong>{formData.timeline.length}</strong>
                    </p>
                    {(() => {
                      // Calculate total duration from timeline
                      if (formData.timeline.length === 0) return null;

                      const milestonesWithDates = formData.timeline.filter(
                        (m) => m.startDate && m.endDate,
                      );

                      if (milestonesWithDates.length === 0) return null;

                      // Get the earliest start date and latest end date
                      const startDates = milestonesWithDates.map(
                        (m) => new Date(m.startDate),
                      );
                      const endDates = milestonesWithDates.map(
                        (m) => new Date(m.endDate),
                      );

                      const earliestStart = new Date(Math.min(...startDates));
                      const latestEnd = new Date(Math.max(...endDates));

                      const totalDays = Math.ceil(
                        (latestEnd.getTime() - earliestStart.getTime()) /
                          (1000 * 60 * 60 * 24),
                      );

                      return (
                        <p>
                          Total durasi: <strong>{totalDays} hari</strong> (
                          {earliestStart.toLocaleDateString("id-ID")} -{" "}
                          {latestEnd.toLocaleDateString("id-ID")})
                        </p>
                      );
                    })()}
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Link to="/projects">
            <Button
              variant="outline"
              type="button"
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Menyimpan...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Buat Project
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
