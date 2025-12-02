import { ApiProperty } from '@nestjs/swagger';

export class SalesDataPointDto {
    @ApiProperty()
    date: string;

    @ApiProperty()
    total: number;

    @ApiProperty()
    orderCount: number;
}

export class SalesOverTimeDto {
    @ApiProperty({ type: [SalesDataPointDto] })
    data: SalesDataPointDto[];
}

export class OrderStatusDataDto {
    @ApiProperty()
    statusName: string;

    @ApiProperty()
    count: number;

    @ApiProperty()
    percentage: number;

    @ApiProperty()
    color: string;
}

export class OrdersByStatusDto {
    @ApiProperty({ type: [OrderStatusDataDto] })
    data: OrderStatusDataDto[];

    @ApiProperty()
    total: number;
}

export class TopProductDto {
    @ApiProperty()
    productId: number;

    @ApiProperty()
    productName: string;

    @ApiProperty()
    quantitySold: number;

    @ApiProperty()
    revenue: number;

    @ApiProperty()
    imageUrl: string;
}

export class TopProductsDto {
    @ApiProperty({ type: [TopProductDto] })
    products: TopProductDto[];
}

export class RevenueMetricsDto {
    @ApiProperty()
    totalRevenue: number;

    @ApiProperty()
    totalOrders: number;

    @ApiProperty()
    averageOrderValue: number;

    @ApiProperty()
    totalCustomers: number;

    @ApiProperty()
    revenueGrowth: number; // Percentage growth compared to previous period
}

export class CustomerGrowthDataPointDto {
    @ApiProperty()
    date: string;

    @ApiProperty()
    newCustomers: number;

    @ApiProperty()
    totalCustomers: number;
}

export class CustomerGrowthDto {
    @ApiProperty({ type: [CustomerGrowthDataPointDto] })
    data: CustomerGrowthDataPointDto[];
}

export class MonthlyRevenueDto {
    @ApiProperty()
    month: string;

    @ApiProperty()
    revenue: number;

    @ApiProperty()
    orderCount: number;
}

export class MonthlyComparisonDto {
    @ApiProperty({ type: [MonthlyRevenueDto] })
    data: MonthlyRevenueDto[];
}

export class DashboardStatsDto {
    @ApiProperty({ type: RevenueMetricsDto })
    metrics: RevenueMetricsDto;

    @ApiProperty({ type: SalesOverTimeDto })
    salesOverTime: SalesOverTimeDto;

    @ApiProperty({ type: OrdersByStatusDto })
    ordersByStatus: OrdersByStatusDto;

    @ApiProperty({ type: TopProductsDto })
    topProducts: TopProductsDto;

    @ApiProperty({ type: CustomerGrowthDto })
    customerGrowth: CustomerGrowthDto;

    @ApiProperty({ type: MonthlyComparisonDto })
    monthlyComparison: MonthlyComparisonDto;
}
