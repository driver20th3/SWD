"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  Eye,
  RefreshCw,
  Inbox,
  Users,
  Timer,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { complaintService } from "@/lib/services/complaint.service";
import type { ComplaintQueueItem, ComplaintQueueStats, Complaint } from "@/lib/services/complaint.service";

// Status badge config
const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  InQueue: { label: "Trong hàng đợi", variant: "secondary" },
  Assigned: { label: "Đã giao", variant: "default" },
  InProgress: { label: "Đang xử lý", variant: "default" },
  Completed: { label: "Hoàn thành", variant: "outline" },
};

const categoryLabels: Record<string, string> = {
  ProductQuality: "Chất lượng SP",
  NotAsDescribed: "Không đúng mô tả",
  AccountNotWorking: "TK không hoạt động",
  DeliveryIssue: "Vấn đề giao hàng",
  Fraud: "Lừa đảo",
  Other: "Khác",
};

export default function ModeratorComplaintsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("queue");
  const [isLoading, setIsLoading] = useState(true);
  const [queueItems, setQueueItems] = useState<ComplaintQueueItem[]>([]);
  const [stats, setStats] = useState<ComplaintQueueStats | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("Assigned");
  const [sortOption, setSortOption] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Fetch queue data
  const fetchQueue = async () => {
    setIsLoading(true);
    try {
      // Parse sort option
      const sortConfig: Record<string, { sortBy: string; sortOrder: "asc" | "desc" }> = {
        newest: { sortBy: "addedToQueueAt", sortOrder: "desc" },
        oldest: { sortBy: "addedToQueueAt", sortOrder: "asc" },
        priority: { sortBy: "queuePriority", sortOrder: "desc" },
      };
      const { sortBy, sortOrder } = sortConfig[sortOption] || sortConfig.newest;

      const [queueResult, statsResult] = await Promise.all([
        complaintService.getQueue({
          status: statusFilter !== "all" ? (statusFilter as any) : undefined,
          sortBy,
          sortOrder,
          limit: itemsPerPage,
          skip: (currentPage - 1) * itemsPerPage,
        }),
        complaintService.getQueueStats(),
      ]);

      setQueueItems(queueResult.items);
      setTotalItems(queueResult.total);
      setStats(statsResult);
    } catch (error) {
      console.error("Failed to fetch queue:", error);
      toast.error("Không thể tải hàng đợi khiếu nại");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [statusFilter, sortOption, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, sortOption]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // View complaint details
  const handleViewComplaint = (queueItem: ComplaintQueueItem) => {
    const ticketId = typeof queueItem.ticketId === "string"
      ? queueItem.ticketId
      : (queueItem.ticketId as Complaint)._id;
    router.push(`/moderator/complaints/${ticketId}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)} phút`;
    if (minutes < 1440) return `${Math.round(minutes / 60)} giờ`;
    return `${Math.round(minutes / 1440)} ngày`;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/moderator">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Hàng đợi khiếu nại
            </h1>
            <p className="text-sm text-muted-foreground">
              Xử lý khiếu nại từ khách hàng
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchQueue}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 pt-4">
            <CardTitle className="text-sm font-medium">Trong hàng đợi</CardTitle>
            <Inbox className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-orange-600">
                  {stats?.totalInQueue || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Chờ gán
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 pt-4">
            <CardTitle className="text-sm font-medium">Giá trị cao</CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-red-600">
                  {stats?.highValueCount || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Cần ưu tiên
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 pt-4">
            <CardTitle className="text-sm font-medium">Thời gian chờ TB</CardTitle>
            <Timer className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-blue-600">
                  {formatTime(stats?.avgWaitTimeMinutes || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Trung bình
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 pt-4">
            <CardTitle className="text-sm font-medium">Hoàn thành hôm nay</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">
                  {stats?.totalCompletedToday || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Đã xử lý
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Queue Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 h-9">
          <TabsTrigger value="queue" className="text-xs sm:text-sm">
            Tất cả khiếu nại
          </TabsTrigger>
          <TabsTrigger value="my-assigned" className="text-xs sm:text-sm">
            Đang xử lý (Của tôi)
          </TabsTrigger>
        </TabsList>

        {/* Queue Tab */}
        <TabsContent value="queue" className="space-y-4">
          {/* Filters */}
          <Card className="py-4">
            <CardHeader className="px-4 pt-4 pb-3">
              <CardTitle className="text-base">Bộ lọc</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Trạng thái:</span>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="Assigned">Đã gán</SelectItem>
                      <SelectItem value="InProgress">Đang xử lý</SelectItem>
                      <SelectItem value="Completed">Hoàn thành</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sắp xếp:</span>
                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Mới nhất</SelectItem>
                      <SelectItem value="oldest">Cũ nhất</SelectItem>
                      <SelectItem value="priority">Ưu tiên cao</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Queue Items */}
          <Card className="py-4">
            <CardHeader className="px-4 pt-4 pb-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base">Danh sách khiếu nại</CardTitle>
                  <CardDescription className="text-xs">
                    Hiển thị {queueItems.length} / {totalItems} khiếu nại
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : queueItems.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Hàng đợi trống</h3>
                  <p className="text-sm text-muted-foreground">
                    Không có khiếu nại nào cần xử lý
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {queueItems.map((item) => {
                      const ticket = typeof item.ticketId === "object" ? item.ticketId as Complaint : null;
                      const status = statusConfig[item.status] || { label: item.status, variant: "outline" as const };

                      return (
                        <div
                          key={item._id}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm">
                                {ticket?.ticketCode || "N/A"}
                              </span>
                              <Badge variant={status.variant} className="text-xs">
                                {status.label}
                              </Badge>
                              {item.isHighValue && (
                                <Badge variant="destructive" className="text-xs">
                                  Giá trị cao
                                </Badge>
                              )}
                              {item.isEscalated && (
                                <Badge variant="outline" className="text-xs border-orange-500 text-orange-500">
                                  Leo thang
                                </Badge>
                              )}
                            </div>

                            <p className="text-sm truncate">
                              {ticket?.title || "Không có tiêu đề"}
                            </p>

                            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                              {ticket?.category && (
                                <span className="bg-muted px-2 py-0.5 rounded">
                                  {categoryLabels[ticket.category] || ticket.category}
                                </span>
                              )}
                              <span>
                                Giá trị: {formatPrice(item.orderValue)}
                              </span>
                              <span>
                                Chờ: {formatTime(item.ticketAge * 60)}
                              </span>
                              <span>
                                Ưu tiên: {item.queuePriority.toFixed(0)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => handleViewComplaint(item)}
                            >
                              <Eye className="mr-1.5 h-3.5 w-3.5" />
                              Xem chi tiết
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t mt-4">
                      <p className="text-sm text-muted-foreground">
                        Trang {currentPage} / {totalPages}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Trước
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Sau
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Assigned Tab */}
        <TabsContent value="my-assigned">
          <Card className="py-4">
            <CardHeader className="px-4 pt-4 pb-3">
              <CardTitle className="text-base">Khiếu nại đang xử lý</CardTitle>
              <CardDescription className="text-xs">
                Các khiếu nại đã được giao cho bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Chưa có khiếu nại</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tự động gán bởi hệ thống
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
