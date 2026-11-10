# Ledgerly web app: what a signed-in user can do

Collected from the product spec for the 1.8 release.

## Customers

| Screen | Action | Notes |
|---|---|---|
| Customers list | Add customer | Name and email required |
| Customers list | Search customers | By name or email |
| Customer detail | View customer | Shows open balance |
| Customer detail | Edit customer | Name, email, tax id |
| Customer detail | Delete customer | Only when the customer has no invoices |

## Invoices

| Screen | Action | Notes |
|---|---|---|
| Invoices list | New invoice | Starts as a draft |
| Invoices list | Filter invoices | Status and customer |
| Invoice detail | View invoice | Lines, totals, payment status |
| Invoice detail | Edit draft | Change lines and due date until the invoice is sent |
| Invoice detail | Void invoice | Asks for a reason; cannot be undone |
| Invoice detail | Send payment reminder | Emails the customer; at most one per day |
| Invoice detail | Download PDF | |
