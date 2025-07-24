import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Folder, Plus, Search, Edit, Trash2, Tag } from "lucide-react";
import type { Category } from "@/types";

export default function MasterCategories() {
  const [searchTerm, setSearchTerm] = useState("");

  const [categories] = useState<Category[]>([
    {
      id: "1",
      name: "Web Development",
      code: "WEB",
      description: "Pengembangan aplikasi berbasis web",
      type: "Development",
      status: "active",
      projectCount: 15,
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      name: "Mobile Development",
      code: "MOB",
      description: "Pengembangan aplikasi mobile iOS dan Android",
      type: "Development",
      status: "active",
      projectCount: 8,
      createdAt: "2024-01-01",
    },
    {
      id: "3",
      name: "ERP System",
      code: "ERP",
      description: "Sistem Enterprise Resource Planning",
      type: "Enterprise",
      status: "active",
      projectCount: 12,
      createdAt: "2024-01-01",
    },
    {
      id: "4",
      name: "E-Commerce Platform",
      code: "ECOM",
      description: "Platform perdagangan elektronik",
      type: "Commerce",
      status: "active",
      projectCount: 6,
      createdAt: "2024-01-01",
    },
    {
      id: "5",
      name: "Analytics Dashboard",
      code: "ANAL",
      description: "Dashboard analitik dan reporting",
      type: "Analytics",
      status: "active",
      projectCount: 4,
      createdAt: "2024-01-01",
    },
    {
      id: "6",
      name: "Legacy System",
      code: "LEG",
      description: "Sistem lama yang sudah tidak digunakan",
      type: "Legacy",
      status: "inactive",
      projectCount: 0,
      createdAt: "2023-01-01",
    },
  ]);

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status: Category["status"]) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800">Aktif</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Non-aktif</Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      Development: "bg-blue-100 text-blue-800",
      Enterprise: "bg-purple-100 text-purple-800",
      Commerce: "bg-green-100 text-green-800",
      Analytics: "bg-orange-100 text-orange-800",
      Legacy: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge
        className={
          colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
        }
      >
        {type}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Folder className="h-8 w-8 text-blue-600" />
            Master Data Kategori Project
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola kategori project untuk klasifikasi dan pelaporan
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tambah Kategori
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Kategori
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.length}
                </p>
              </div>
              <Tag className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif</p>
                <p className="text-2xl font-bold text-green-600">
                  {categories.filter((c) => c.status === "active").length}
                </p>
              </div>
              <Folder className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Development</p>
                <p className="text-2xl font-bold text-purple-600">
                  {categories.filter((c) => c.type === "Development").length}
                </p>
              </div>
              <Tag className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Project
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {categories.reduce((sum, c) => sum + c.projectCount, 0)}
                </p>
              </div>
              <Folder className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari kategori, kode, atau deskripsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Kategori ({filteredCategories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama Kategori</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Jumlah Project</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {category.code}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {category.description}
                    </TableCell>
                    <TableCell>{getTypeBadge(category.type)}</TableCell>
                    <TableCell>{getStatusBadge(category.status)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{category.projectCount}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(category.createdAt).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
