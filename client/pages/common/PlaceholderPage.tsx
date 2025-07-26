import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export default function PlaceholderPage({
  title,
  description = "Halaman ini sedang dalam pengembangan. Silakan hubungi tim development untuk menambahkan konten.",
}: PlaceholderPageProps) {
  return (
    <div className="p-6 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Construction className="w-8 h-8 text-gray-400" />
          </div>
          <CardTitle className="text-xl text-gray-900">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 text-sm">{description}</p>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">
              💡 Tip: Lanjutkan prompt untuk mengisi konten halaman ini
            </p>
            <Link to="/">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
