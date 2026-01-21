# ERP System API Integration Hub

## Overview

This document provides comprehensive information about integrating with our ERP system's REST API. The API allows external systems to interact with various ERP modules including production, inventory, sales, purchases, payroll, CRM, and more.

## Base URL

```
https://your-erp-domain.com/api
```

## Authentication

All API requests require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Rate Limiting

- **Standard endpoints**: 100 requests per minute
- **Bulk operations**: 50 requests per minute
- **Reports**: 20 requests per minute

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error responses follow this format:

```json
{
  "error": "Error description",
  "code": "ERROR_CODE",
  "details": {}
}
```

## API Endpoints

### Production Module

#### Work Orders
- `GET /production/work-orders` - List all work orders
- `POST /production/work-orders` - Create new work order
- `GET /production/work-orders/{id}` - Get specific work order
- `PUT /production/work-orders/{id}` - Update work order
- `DELETE /production/work-orders/{id}` - Delete work order
- `POST /production/work-orders/bulk-import` - Bulk import work orders

#### Bill of Materials (BOM)
- `GET /production/bom` - List all BOMs
- `POST /production/bom` - Create new BOM
- `GET /production/bom/{id}` - Get specific BOM
- `PUT /production/bom/{id}` - Update BOM
- `DELETE /production/bom/{id}` - Delete BOM

### Purchase Module

#### Vendors
- `GET /purchase/vendors` - List all vendors
- `POST /purchase/vendors` - Create new vendor
- `GET /purchase/vendors/{id}` - Get specific vendor
- `PUT /purchase/vendors/{id}` - Update vendor
- `DELETE /purchase/vendors/{id}` - Delete vendor

#### Purchase Orders
- `GET /purchase/orders` - List all purchase orders
- `POST /purchase/orders` - Create new purchase order
- `GET /purchase/orders/{id}` - Get specific purchase order
- `PUT /purchase/orders/{id}` - Update purchase order
- `DELETE /purchase/orders/{id}` - Delete purchase order

### Invoice & Billing Module

#### Customers
- `GET /invoice/customers` - List all customers
- `POST /invoice/customers` - Create new customer
- `GET /invoice/customers/{id}` - Get specific customer
- `PUT /invoice/customers/{id}` - Update customer
- `DELETE /invoice/customers/{id}` - Delete customer

#### Invoices
- `GET /invoice/invoices` - List all invoices
- `POST /invoice/invoices` - Create new invoice
- `GET /invoice/invoices/{id}` - Get specific invoice
- `PUT /invoice/invoices/{id}` - Update invoice
- `DELETE /invoice/invoices/{id}` - Delete invoice

### Payroll Module

#### Employees
- `GET /payroll/employees` - List all employees
- `POST /payroll/employees` - Create new employee
- `GET /payroll/employees/{id}` - Get specific employee
- `PUT /payroll/employees/{id}` - Update employee
- `DELETE /payroll/employees/{id}` - Delete employee

#### Payroll Records
- `GET /payroll/payrolls` - List all payroll records
- `POST /payroll/payrolls` - Create new payroll record
- `GET /payroll/payrolls/{id}` - Get specific payroll record
- `PUT /payroll/payrolls/{id}` - Update payroll record
- `DELETE /payroll/payrolls/{id}` - Delete payroll record

### CRM & Sales Module

#### Leads
- `GET /crm/leads` - List all leads
- `POST /crm/leads` - Create new lead
- `GET /crm/leads/{id}` - Get specific lead
- `PUT /crm/leads/{id}` - Update lead
- `DELETE /crm/leads/{id}` - Delete lead

#### Opportunities
- `GET /crm/opportunities` - List all opportunities
- `POST /crm/opportunities` - Create new opportunity
- `GET /crm/opportunities/{id}` - Get specific opportunity
- `PUT /crm/opportunities/{id}` - Update opportunity
- `DELETE /crm/opportunities/{id}` - Delete opportunity

#### Sales Orders
- `GET /crm/sales-orders` - List all sales orders
- `POST /crm/sales-orders` - Create new sales order
- `GET /crm/sales-orders/{id}` - Get specific sales order
- `PUT /crm/sales-orders/{id}` - Update sales order
- `DELETE /crm/sales-orders/{id}` - Delete sales order

### Warehouse Module

#### Warehouses
- `GET /warehouse/warehouses` - List all warehouses
- `POST /warehouse/warehouses` - Create new warehouse
- `GET /warehouse/warehouses/{id}` - Get specific warehouse
- `PUT /warehouse/warehouses/{id}` - Update warehouse
- `DELETE /warehouse/warehouses/{id}` - Delete warehouse

#### Stock Transfers
- `GET /warehouse/transfers` - List all stock transfers
- `POST /warehouse/transfers` - Create new stock transfer
- `GET /warehouse/transfers/{id}` - Get specific stock transfer
- `PUT /warehouse/transfers/{id}` - Update stock transfer
- `DELETE /warehouse/transfers/{id}` - Delete stock transfer

### Assets Module

#### Assets
- `GET /assets/assets` - List all assets
- `POST /assets/assets` - Create new asset
- `GET /assets/assets/{id}` - Get specific asset
- `PUT /assets/assets/{id}` - Update asset
- `DELETE /assets/assets/{id}` - Delete asset

#### Maintenance Records
- `GET /assets/maintenance` - List all maintenance records
- `POST /assets/maintenance` - Create new maintenance record
- `GET /assets/maintenance/{id}` - Get specific maintenance record
- `PUT /assets/maintenance/{id}` - Update maintenance record
- `DELETE /assets/maintenance/{id}` - Delete maintenance record

## Data Models

### Common Fields

Most entities include these common fields:
- `id` - Unique identifier
- `created_at` - Creation timestamp (ISO 8601)
- `updated_at` - Last update timestamp (ISO 8601)

### Pagination

List endpoints support pagination using query parameters:

```
GET /production/work-orders?page=1&limit=20&sort=created_at&order=desc
```

Parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `sort` - Field to sort by
- `order` - Sort order: `asc` or `desc`

### Filtering

Most list endpoints support filtering:

```
GET /production/work-orders?status=active&priority=high
```

## Webhooks

Configure webhooks to receive real-time notifications:

### Supported Events
- `work_order.created`
- `work_order.updated`
- `purchase_order.created`
- `invoice.created`
- `sales_order.created`
- `stock_transfer.created`

### Webhook Configuration

Send a POST request to `/webhooks`:

```json
{
  "url": "https://your-webhook-url.com/endpoint",
  "events": ["work_order.created", "purchase_order.created"],
  "secret": "your-webhook-secret"
}
```

### Webhook Payload

```json
{
  "event": "work_order.created",
  "data": {
    "id": "wo_123456",
    "work_order_number": "WO-2024-0001",
    // ... other fields
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## SDKs

### JavaScript/TypeScript

```bash
npm install @your-erp/sdk
```

```javascript
import { ERPClient } from '@your-erp/sdk'

const client = new ERPClient({
  baseURL: 'https://your-erp-domain.com/api',
  token: 'your-jwt-token'
})

// Create a work order
const workOrder = await client.production.createWorkOrder({
  title: 'New Production Run',
  // ... other fields
})
```

### Python

```bash
pip install your-erp-sdk
```

```python
from your_erp import ERPClient

client = ERPClient(
    base_url='https://your-erp-domain.com/api',
    token='your-jwt-token'
)

# Create a work order
work_order = client.production.create_work_order({
    'title': 'New Production Run',
    # ... other fields
})
```

## Rate Limits & Best Practices

1. **Batch Operations**: Use bulk endpoints when processing multiple items
2. **Caching**: Cache frequently accessed data to reduce API calls
3. **Webhooks**: Use webhooks instead of polling for real-time updates
4. **Error Handling**: Implement proper error handling and retry logic
5. **Pagination**: Always handle pagination for list endpoints

## Support

For API support:
- Documentation: https://docs.your-erp.com/api
- Email: api-support@your-erp.com
- Status Page: https://status.your-erp.com

## Changelog

### v2.1.0 (Latest)
- Added warehouse management endpoints
- Enhanced filtering capabilities
- Improved webhook reliability

### v2.0.0
- Major API restructure
- Added authentication v2
- Deprecated v1 endpoints

### v1.5.0
- Initial public API release
- Basic CRUD operations for all modules
