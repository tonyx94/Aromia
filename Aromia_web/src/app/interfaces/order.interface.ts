export interface OrderStatus {
    id: number;
    name: string;
    description: string;
    color: string;
    order_sequence: number;
    created_at: Date;
}

export interface Customer {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth?: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CustomerAddress {
    id: number;
    alias: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode?: string;
    country: string;
    additionalInfo?: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    image?: string;
}

export interface OrderItem {
    id: number;
    product: Product;
    quantity: number;
    unit_price: number;
    total_price: number;
    created_at: Date;
}

export interface Order {
    id: number;
    order_number: string;
    customer_id: number;
    address_id: number;
    status_id: number;
    subtotal: number;
    tax_amount: number;
    shipping_cost: number;
    discount_amount: number;
    total_amount: number;
    notes?: string;
    admin_notes?: string;
    estimated_delivery?: Date;
    delivered_at?: Date;
    created_at: Date;
    updated_at: Date;

    customer: Customer;
    address: CustomerAddress;
    status: OrderStatus;
    items: OrderItem[];
}
