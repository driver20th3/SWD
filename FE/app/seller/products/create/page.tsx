"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProductSchema,
  type CreateProductInput,
} from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RequireAuth } from "@/components/auth/RequireAuth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { productService } from "@/lib/services/product.service";
import { type ApiError } from "@/lib/api";
import { useShop } from "@/lib/hooks/useShop";
import { Skeleton } from "@/components/ui/skeleton";
import { platformCatalogService, type PlatformCatalog } from "@/lib/services/platform-catalog.service";

export default function CreateProductPage() {
  const router = useRouter();
  const { shop, loading: shopLoading, hasActiveShop } = useShop();
  const [isLoading, setIsLoading] = useState(false);
  const [platforms, setPlatforms] = useState<PlatformCatalog[]>([]);

  const form = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      shopId: "",
      platformId: "",
      title: "",
      description: "",
      warrantyPolicy: "Bảo hành 1 đổi 1 trong 30 ngày nếu có lỗi từ nhà sản xuất.",
      howToUse: "Sau khi thanh toán, key và hướng dẫn sẽ được gửi qua email của bạn.",
      thumbnailUrl: null,
      planType: "Personal",
      durationDays: 30,
      price: 0,
    },
  });

  useEffect(() => {
    if (shop?._id) {
      form.setValue("shopId", shop._id);
    }
  }, [shop?._id, form]);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const data = await platformCatalogService.getAll();
        setPlatforms(data.filter((p) => p.status === "Active"));
      } catch {
        toast.error("Không thể tải danh mục nền tảng");
      }
    };

    fetchPlatforms();
  }, []);

  const onSubmit = async (data: CreateProductInput) => {
    if (!shop?._id) {
      toast.error("Vui lòng tạo shop trước khi đăng bán sản phẩm");
      return;
    }

    setIsLoading(true);
    try {
      const payload: CreateProductInput = {
        ...data,
        shopId: shop._id,
        durationDays: Number(data.durationDays),
        price: Number(data.price),
      };

      const response = await productService.createProduct(payload);

      if (!response.success) {
        toast.error(response.message || "Lỗi khi tạo sản phẩm");
        return;
      }

      toast.success("Sản phẩm đã được tạo và hiển thị công khai!");
      router.push("/seller");
      router.refresh();
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.message || "Lỗi khi tạo sản phẩm");
    } finally {
      setIsLoading(false);
    }
  };

  if (shopLoading) {
    return (
      <div className="container py-8 max-w-4xl space-y-6">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-6 w-3/4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasActiveShop) {
    return (
      <div className="container py-8 max-w-4xl text-center">
        <h2 className="text-2xl font-bold mb-4">Bạn chưa có cửa hàng</h2>
        <p className="text-muted-foreground mb-6">
          Vui lòng tạo một cửa hàng trước khi đăng bán sản phẩm.
        </p>
        <Button onClick={() => router.push("/seller/register")}>
          Tạo cửa hàng ngay
        </Button>
      </div>
    );
  }

  return (
    <RequireAuth requiredRole="seller">
      <div className="container py-8 max-w-4xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Tạo sản phẩm mới</h1>
            <p className="text-muted-foreground">
              Thêm sản phẩm mới vào shop. Sản phẩm sẽ được kiểm duyệt trước khi
              hiển thị công khai.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <input type="hidden" {...form.register("shopId")} />

              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cơ bản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiêu đề sản phẩm *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ví dụ: Key bản quyền Windows 11 Pro"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="thumbnailUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thumbnail URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://..."
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === "" ? null : e.target.value
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả chi tiết *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Mô tả các tính năng, lợi ích, và thông tin quan trọng khác của sản phẩm."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Chính sách & Hướng dẫn</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="warrantyPolicy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chính sách bảo hành *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Quy định về việc bảo hành sản phẩm."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="howToUse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hướng dẫn sử dụng *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Các bước để kích hoạt hoặc sử dụng sản phẩm."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Phân loại & Giá</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <FormField
                    control={form.control}
                    name="platformId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nền tảng *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn nền tảng cho sản phẩm" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {platforms.length === 0 ? (
                              <SelectItem value="__empty" disabled>
                                Không có nền tảng khả dụng
                              </SelectItem>
                            ) : (
                              platforms.map((platform) => (
                                <SelectItem key={platform._id} value={platform._id}>
                                  {platform.platformName}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid md:grid-cols-3 gap-4">
                     <FormField
                      control={form.control}
                      name="planType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loại gói *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn loại gói" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Personal">Cá nhân</SelectItem>
                              <SelectItem value="Family">Gia đình</SelectItem>
                              <SelectItem value="Slot">Slot</SelectItem>
                              <SelectItem value="Shared">Dùng chung</SelectItem>
                              <SelectItem value="InviteLink">Mời qua link</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="durationDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Thời hạn (ngày) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="365"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giá (VND) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              inputMode="decimal"
                              min={0}
                              step={1}
                              placeholder="100000"
                              value={
                                field.value === undefined || field.value === null
                                  ? ""
                                  : field.value
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                  field.onChange(undefined);
                                  return;
                                }
                                const num = Number(value);
                                if (!Number.isNaN(num)) {
                                  field.onChange(num);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isLoading || shopLoading || !hasActiveShop}>
                  {isLoading ? "Đang tạo..." : "Tạo sản phẩm"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </RequireAuth>
  );
}
