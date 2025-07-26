import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  UserCheck,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface UserComment {
  id: string;
  text: string;
  createdAt: string;
}

interface ReadinessDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: "user-comments" | "verifier-feedback";
  title: string;
  data: {
    userComments?: UserComment[];
    userStatus?: string;
    verifierComment?: string;
    verifierName?: string;
    verifiedAt?: string;
    verifierStatus?: string;
  } | null;
}

const STATUS_CONFIG = {
  lengkap: {
    label: "Lengkap",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  parsial: {
    label: "Parsial",
    color: "bg-yellow-100 text-yellow-800",
    icon: AlertTriangle,
  },
  tidak_tersedia: {
    label: "Tidak Tersedia",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
};

const getStatusBadge = (status: string) => {
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
  if (!config) return null;

  const IconComponent = config.icon;
  return (
    <Badge className={config.color}>
      <IconComponent className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
};

export function ReadinessDetailDialog({
  isOpen,
  onClose,
  type,
  title,
  data,
}: ReadinessDetailDialogProps) {
  // Early return if data is null or undefined
  if (!data) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle>Data tidak tersedia</DialogTitle>
            <DialogDescription>Data untuk dialog ini tidak valid.</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto py-4">
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">
                Tidak ada data yang dapat ditampilkan.
              </p>
            </div>
          </div>
          <div className="pt-4 border-t">
            <div className="flex justify-end">
              <Button onClick={onClose}>Tutup</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center gap-3">
            {type === "user-comments" ? (
              <MessageSquare className="w-5 h-5 text-green-600" />
            ) : (
              <UserCheck className="w-5 h-5 text-blue-600" />
            )}
            <div>
              <DialogTitle className="text-lg">
                {type === "user-comments"
                  ? "Detail Keterangan User"
                  : "Detail Feedback Risk Officer"}
              </DialogTitle>
              <DialogDescription className="text-sm font-medium mt-1">
                {title}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {type === "user-comments" ? (
            <>
              {/* User Status */}
              {data.userStatus && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Status Penilaian User:
                    </span>
                  </div>
                  <div>{getStatusBadge(data.userStatus)}</div>
                </div>
              )}

              {/* User Comments */}
              {data.userComments && data.userComments.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      Keterangan User ({data.userComments.length} komentar):
                    </span>
                  </div>
                  <div className="space-y-3">
                    {data.userComments.map((comment, index) => (
                      <div
                        key={comment.id}
                        className="bg-green-50 border border-green-200 p-4 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-green-700">
                            Komentar #{index + 1}
                          </span>
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                            {new Date(comment.createdAt).toLocaleString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                        <div className="bg-white border border-green-200 p-3 rounded">
                          <p className="text-sm text-green-800 leading-relaxed whitespace-pre-wrap">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    Belum ada keterangan dari user untuk item ini
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Verifier Status */}
              {data.verifierStatus && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Status Verifikasi Risk Officer:
                    </span>
                  </div>
                  <div>{getStatusBadge(data.verifierStatus)}</div>
                </div>
              )}

              {/* Verifier Information */}
              {(data.verifierName || data.verifiedAt) && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data.verifierName && (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <UserCheck className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-medium text-blue-700">
                            Verifier:
                          </span>
                        </div>
                        <p className="text-sm text-blue-800 font-medium">
                          {data.verifierName}
                        </p>
                      </div>
                    )}
                    {data.verifiedAt && (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-medium text-blue-700">
                            Tanggal Verifikasi:
                          </span>
                        </div>
                        <p className="text-sm text-blue-800">
                          {new Date(data.verifiedAt).toLocaleString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Separator />

              {/* Verifier Feedback */}
              {data.verifierComment ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">
                      Feedback Risk Officer:
                    </span>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <div className="bg-white border border-blue-200 p-4 rounded">
                      <p className="text-sm text-blue-800 leading-relaxed whitespace-pre-wrap">
                        {data.verifierComment}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    Belum ada feedback dari Risk Officer untuk item ini
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Feedback akan muncul setelah proses verifikasi selesai
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-end">
            <Button onClick={onClose}>Tutup</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
