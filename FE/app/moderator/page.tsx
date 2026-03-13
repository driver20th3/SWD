"use client";

import { useState, useEffect } from "react";
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
  Shield,
  Package,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  FileText,
  TrendingUp,
  Clock,
} from "lucide-react";

// Types for backend data
interface ModeratorStats {
  pendingProducts: number;
  approvedToday: number;
  rejectedToday: number;
  pendingReports: number;
  pendingReviews: number;
  pendingComments: number;
  suspendedShops: number;
  restrictedUsers: number;
}

interface Report {
  id: string;
  type: string;
  reason: string;
  target: string;
  reporter: string;
  date: string;
  status: "open" | "in_review" | "resolved";
}

export default function ModeratorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<ModeratorStats>({
    pendingProducts: 0,
    approvedToday: 0,
    rejectedToday: 0,
    pendingReports: 0,
    pendingReviews: 0,
    pendingComments: 0,
    suspendedShops: 0,
    restrictedUsers: 0,
  });
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // TODO: Fetch from backend
        // const [statsRes, reportsRes] = await Promise.all([
        //   moderatorService.getStats(),
        //   moderatorService.getPendingReports(),
        // ]);
        // setStats(statsRes);
        // setReports(reportsRes);
      } catch (error) {
        console.error("Failed to fetch moderator data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Dashboard Kiểm duyệt
            </h1>
            <p className="text-sm text-muted-foreground">
              Quản lý kiểm duyệt nội dung và xử lý báo cáo
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/moderator/review">
                <Package className="mr-2 h-4 w-4" />
                Duyệt sản phẩm
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="py-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 pt-4">
              <CardTitle className="text-sm font-medium">
                Sản phẩm chờ duyệt
              </CardTitle>
              <Clock className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.pendingProducts}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    <Link
                      href="/moderator/review"
                      className="text-primary hover:underline"
                    >
                      Xem hàng đợi
                    </Link>
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="py-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 pt-4">
              <CardTitle className="text-sm font-medium">
                Đã duyệt hôm nay
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.approvedToday}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Sản phẩm đã phê duyệt
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="py-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 pt-4">
              <CardTitle className="text-sm font-medium">
                Báo cáo chờ xử lý
              </CardTitle>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-red-600">
                    {stats.pendingReports}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Cần xem xét
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="py-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 pt-4">
              <CardTitle className="text-sm font-medium">
                Đánh giá chờ duyệt
              </CardTitle>
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {stats.pendingReviews}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Review cần kiểm tra
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="py-4">
          <CardHeader className="px-4 pt-4 pb-3">
            <CardTitle className="text-base">Thao tác nhanh</CardTitle>
            <CardDescription className="text-xs">Các chức năng kiểm duyệt</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
              <Button variant="outline" className="h-auto py-3 flex-col gap-1.5" asChild>
                <Link href="/moderator/complaints">
                  <FileText className="h-4 w-4" />
                  <span className="text-xs">Xử lý khiếu nại</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-3 flex-col gap-1.5" asChild>
                <Link href="/moderator/review">
                  <Package className="h-4 w-4" />
                  <span className="text-xs">Duyệt sản phẩm</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-3 flex-col gap-1.5" asChild>
                <Link href="/moderator/reports">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-xs">Xử lý báo cáo</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-3 flex-col gap-1.5" asChild>
                <Link href="/moderator/reviews">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs">Kiểm duyệt review</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-3 flex-col gap-1.5" asChild>
                <Link href="/moderator/shops">
                  <Shield className="h-4 w-4" />
                  <span className="text-xs">Quản lý shop</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 h-9">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Tổng quan</TabsTrigger>
            <TabsTrigger value="reports" className="text-xs sm:text-sm">Báo cáo</TabsTrigger>
            <TabsTrigger value="reviews" className="text-xs sm:text-sm">Đánh giá</TabsTrigger>
            <TabsTrigger value="actions" className="text-xs sm:text-sm">Hành động</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Pending Reports */}
            <Card className="py-4">
              <CardHeader className="px-4 pt-4 pb-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">Báo cáo gần đây</CardTitle>
                    <CardDescription className="text-xs">
                      {stats.pendingReports} báo cáo cần xử lý
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/moderator/reports">Xem tất cả</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {isLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : reports.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Không có báo cáo nào cần xử lý.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {reports.map((report) => (
                      <div
                        key={report.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{report.target}</p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <Badge variant="outline" className="text-xs">{report.type}</Badge>
                            <Badge variant="destructive" className="text-xs">{report.reason}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {report.id}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {report.date}
                            </span>
                            <Badge
                              variant={
                                report.status === "open"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {report.status === "open"
                                ? "Mở"
                                : "Đang xem xét"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                            <Link href={`/moderator/reports/${report.id}`}>
                              <Eye className="mr-1.5 h-3.5 w-3.5" />
                              Xem chi tiết
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Today's Activity */}
            <Card className="py-4">
              <CardHeader className="px-4 pt-4 pb-3">
                <CardTitle className="text-base">Hoạt động hôm nay</CardTitle>
                <CardDescription className="text-xs">Thống kê công việc đã thực hiện</CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {isLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1.5" />
                      <p className="text-xl font-bold text-green-600">
                        {stats.approvedToday}
                      </p>
                      <p className="text-xs text-muted-foreground">Đã duyệt</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <XCircle className="h-6 w-6 text-red-600 mx-auto mb-1.5" />
                      <p className="text-xl font-bold text-red-600">
                        {stats.rejectedToday}
                      </p>
                      <p className="text-xs text-muted-foreground">Đã từ chối</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600 mx-auto mb-1.5" />
                      <p className="text-xl font-bold text-blue-600">
                        {stats.pendingReports}
                      </p>
                      <p className="text-xs text-muted-foreground">Báo cáo xử lý</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <Ban className="h-6 w-6 text-orange-600 mx-auto mb-1.5" />
                      <p className="text-xl font-bold text-orange-600">
                        {stats.suspendedShops}
                      </p>
                      <p className="text-xs text-muted-foreground">Shop đã khóa</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card className="py-4">
              <CardHeader className="px-4 pt-4 pb-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">Tất cả báo cáo</CardTitle>
                    <CardDescription className="text-xs">Quản lý và xử lý báo cáo</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/moderator/reports">Xem tất cả</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {isLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : reports.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Không có báo cáo nào.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {reports.map((report) => (
                      <div
                        key={report.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{report.target}</p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <Badge variant="outline" className="text-xs">{report.type}</Badge>
                            <Badge variant="destructive" className="text-xs">{report.reason}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {report.id}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                            <Link href={`/moderator/reports/${report.id}`}>
                              Xem chi tiết
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card className="py-4">
              <CardHeader className="px-4 pt-4 pb-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">Kiểm duyệt đánh giá</CardTitle>
                    <CardDescription className="text-xs">
                      {stats.pendingReviews} đánh giá cần kiểm tra
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/moderator/reviews">Xem tất cả</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-center py-8">
                  <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Không có đánh giá nào cần kiểm duyệt.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions">
            <Card className="py-4">
              <CardHeader className="px-4 pt-4 pb-3">
                <CardTitle className="text-base">Hành động gần đây</CardTitle>
                <CardDescription className="text-xs">Lịch sử các hành động kiểm duyệt</CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-center py-8">
                  <TrendingUp className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Chưa có hành động nào được ghi nhận.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
}
