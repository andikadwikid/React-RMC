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
import { MapPin, Plus, Search, Edit, Trash2, Globe } from "lucide-react";

interface Province {
  id: string;
  name: string;
  code: string;
  capital: string;
  region: string;
  status: "active" | "inactive";
  createdAt: string;
}

export default function MasterProvinces() {
  const [searchTerm, setSearchTerm] = useState("");

  const [provinces] = useState<Province[]>([
    {
      id: "1",
      name: "DKI Jakarta",
      code: "JK",
      capital: "Jakarta",
      region: "Jawa",
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      name: "Jawa Barat",
      code: "JB",
      capital: "Bandung",
      region: "Jawa",
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: "3",
      name: "Jawa Tengah",
      code: "JT",
      capital: "Semarang",
      region: "Jawa",
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: "4",
      name: "Jawa Timur",
      code: "JI",
      capital: "Surabaya",
      region: "Jawa",
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: "5",
      name: "Sumatera Utara",
      code: "SU",
      capital: "Medan",
      region: "Sumatera",
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: "6",
      name: "Bali",
      code: "BA",
      capital: "Denpasar",
      region: "Nusa Tenggara",
      status: "active",
      createdAt: "2024-01-01",
    },
  ]);

  const filteredProvinces = provinces.filter(
    (province) =>
      province.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      province.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      province.capital.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status: Province["status"]) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800">Aktif</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Non-aktif</Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="h-8 w-8 text-blue-600" />
            Master Data Provinsi
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola data provinsi untuk sistem manajemen risiko
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tambah Provinsi
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Provinsi
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {provinces.length}
                </p>
              </div>
              <Globe className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif</p>
                <p className="text-2xl font-bold text-green-600">
                  {provinces.filter((p) => p.status === "active").length}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Region Jawa</p>
                <p className="text-2xl font-bold text-purple-600">
                  {provinces.filter((p) => p.region === "Jawa").length}
                </p>
              </div>
              <Globe className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Luar Jawa</p>
                <p className="text-2xl font-bold text-orange-600">
                  {provinces.filter((p) => p.region !== "Jawa").length}
                </p>
              </div>
              <Globe className="h-8 w-8 text-orange-500" />
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
              placeholder="Cari provinsi, kode, atau ibukota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Provinces Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Provinsi ({filteredProvinces.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama Provinsi</TableHead>
                  <TableHead>Ibukota</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProvinces.map((province) => (
                  <TableRow key={province.id}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {province.code}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{province.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{province.capital}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{province.region}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(province.status)}</TableCell>
                    <TableCell>
                      {new Date(province.createdAt).toLocaleDateString("id-ID")}
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
