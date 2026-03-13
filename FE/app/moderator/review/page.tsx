"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

export default function ModeratorReviewPage() {
  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hàng đợi kiểm duyệt</h1>
        <p className="text-muted-foreground">
          Xem xét và phê duyệt sản phẩm từ sellers
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">15</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đã duyệt hôm nay
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">24</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đã từ chối hôm nay
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Flagged</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
      </div>

      {/* Review Queue */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending (15)</TabsTrigger>
          <TabsTrigger value="flagged">AI Flagged (5)</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>
                      Windows 11 Pro License Key - Kích hoạt vĩnh viễn
                    </CardTitle>
                    <CardDescription>
                      By TechStore Official • Gửi lúc: 2026-01-07 10:30
                    </CardDescription>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">Windows</Badge>
                      <Badge variant="secondary">License</Badge>
                      <Badge>Pending Review</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">$29.99</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Mô tả:</h4>
                  <p className="text-sm text-muted-foreground">
                    Windows 11 Pro là phiên bản hệ điều hành cao cấp nhất của
                    Microsoft...
                  </p>
                </div>

                <Separator />

                {/* AI Verdict */}
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      AI Verdict
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Risk Score:</span>
                      <Badge variant="outline" className="bg-green-50">
                        15/100 (Low)
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Suggested Categories:</p>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary">Windows</Badge>
                        <Badge variant="secondary">Software License</Badge>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Suggested Tags:</p>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline">windows11</Badge>
                        <Badge variant="outline">license</Badge>
                        <Badge variant="outline">genuine</Badge>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium mb-1">AI Analysis:</p>
                      <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                        <li>Product description is clear and detailed</li>
                        <li>Category matches product type</li>
                        <li>No suspicious keywords detected</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="flagged">
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                Sản phẩm được AI đánh dấu nguy hiểm
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                Lịch sử sản phẩm đã duyệt
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                Lịch sử sản phẩm đã từ chối
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
