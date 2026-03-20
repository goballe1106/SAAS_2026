# ERP SAS - Sistema de Gestión Empresarial

## 📋 Documento Maestro de Requerimientos y Arquitectura

**Versión**: 4.0 (Enterprise Scalable)  
**Fecha**: 2026-03-20  
**Clasificación**: Documento Técnico - Planeación  

---

# TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Business Context](#2-business-context)
3. [System Architecture](#3-system-architecture)
4. [Data Model](#4-data-model)
5. [Module Specifications](#5-module-specifications)
6. [Workflows & Automation](#6-workflows--automation)
7. [API Architecture](#7-api-architecture)
8. [Security & Compliance](#8-security--compliance)
9. [Scalability Strategy](#9-scalability-strategy)
10. [Integration Ecosystem](#10-integration-ecosystem)
11. [User Experience](#11-user-experience)
12. [Development Roadmap](#12-development-roadmap)
13. [Risk & Mitigation](#13-risk--mitigation)

---

# 1. EXECUTIVE SUMMARY

## 1.1 System Overview

ERP SAS is a comprehensive Enterprise Resource Planning system designed for **construction supervision and project management companies**. The system consolidates all business operations into a unified, scalable platform.

## 1.2 Key Objectives

| Objective | Metric | Target |
|-----------|--------|--------|
| Process Automation | Manual tasks reduced | 60% |
| Data Centralization | Single source of truth | 100% |
| Response Time | API latency | <200ms |
| User Adoption | Active users | >90% |
| System Uptime | Availability | 99.9% |

## 1.3 Success Factors

- **Modular Architecture**: Each module operates independently
- **API-First Design**: All features accessible via REST/GraphQL
- **Real-time Analytics**: Live dashboards and KPIs
- **Scalable Infrastructure**: Horizontal scaling capability
- **Audit Trail**: Complete traceability of all actions

---

# 2. BUSINESS CONTEXT

## 2.1 Industry Challenges

Based on the legacy system analysis, the following pain points were identified:

| Challenge | Current State | Target State |
|-----------|---------------|--------------|
| Disconnected modules | Tickets, Inventory, Projects isolated | Unified data flow |
| Manual processes | Approval workflows on paper | Automated workflows |
| Limited visibility | Periodic reports | Real-time dashboards |
| Scalability issues | Monolithic architecture | Microservices-ready |
| Integration gaps | Siloed systems | API ecosystem |

## 2.2 Business Processes

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        BUSINESS PROCESS MAP                                     │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  COMMERCIAL                    OPERATIONS                    FINANCE           │
│  ┌─────────┐                  ┌──────────┐                 ┌──────────┐   │
│  │ Lead    │                  │ Project  │                 │ Invoice  │   │
│  │ ↓       │                  │ Planning │                 │ Generation│   │
│  │ Quote   │                  │ ↓        │                 │ ↓        │   │
│  │ ↓       │                  │ Resource │                 │ Payment  │   │
│  │ Contract│                  │ Allocation│                │ Tracking │   │
│  └────┬────┘                  └─────┬────┘                 └────┬─────┘   │
│       │                            │                            │         │
│       └────────────────────────────┼────────────────────────────┘         │
│                                    │                                        │
│                                    ▼                                        │
│                         ┌──────────────────┐                               │
│                         │ PROJECT EXECUTION │                              │
│                         │ - Tasks          │                               │
│                         │ - Time Tracking  │                               │
│                         │ - Deliverables   │                               │
│                         └────────┬─────────┘                               │
│                                  │                                          │
│       ┌─────────────────────────┼─────────────────────────┐               │
│       │                         │                         │                │
│       ▼                         ▼                         ▼                │
│  ┌──────────┐            ┌──────────┐            ┌──────────┐           │
│  │INVENTORY│            │    TI    │            │   HR     │           │
│  │Materials│            │  Assets  │            │Attendance│           │
│  └─────────┘            └──────────┘            └──────────┘           │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

## 2.3 Key Performance Indicators

### Operational KPIs

| KPI | Description | Target |
|-----|-------------|--------|
| Project Completion Rate | % projects delivered on time | >85% |
| Ticket Resolution Time | Average SLA compliance | >90% |
| Inventory Accuracy | Stock count accuracy | >98% |
| Resource Utilization | Billable hours / total hours | >75% |

### Financial KPIs

| KPI | Description | Target |
|-----|-------------|--------|
| Revenue per Project | Average revenue / project | Growing |
| Cost Overrun | Actual vs budgeted cost | <10% |
| Gross Margin | (Revenue - COGS) / Revenue | >30% |
| Days Sales Outstanding | Average collection period | <45 days |

---

# 3. SYSTEM ARCHITECTURE

## 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION LAYER                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │
│  │  Web App   │  │ Mobile App  │  │  Portal    │  │  Admin Panel   │   │
│  │  (React)   │  │  (React    │  │  (Client)  │  │   (React)      │   │
│  │            │  │   Native)  │  │            │  │                 │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────┘   │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │ HTTPS/WSS
┌─────────────────────────────────▼───────────────────────────────────────────┐
│                          EDGE LAYER                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │  CDN (Cloudflare)│  │  WAF            │  │  Rate Limiting         │  │
│  │  Static Assets   │  │  SQL Injection  │  │  DDoS Protection       │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
┌─────────────────────────────────▼───────────────────────────────────────────┐
│                        API GATEWAY (Kong/Nginx)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ Auth        │  │ Routing      │  │ Load Balance │  │ Cache      │  │
│  │ Validation  │  │ /api/v1/*    │  │ Round Robin  │  │ Redis      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────────┘  │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
┌─────────────────────────────────▼───────────────────────────────────────────┐
│                     APPLICATION LAYER (Kubernetes)                          │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                      SERVICE MESH                                     │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │   │
│  │  │ Auth Svc │  │ User Svc  │  │ Project  │  │ Ticket   │          │   │
│  │  │          │  │           │  │ Service  │  │ Service  │          │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │   │
│  │  │Inventory│  │    HR     │  │  Invoice │  │ Report   │          │   │
│  │  │ Service │  │ Service   │  │ Service  │  │ Service  │          │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘          │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────┐  ┌─────────────────────────────────────┐   │
│  │    MESSAGE QUEUE         │  │         SCHEDULER                    │   │
│  │    (RabbitMQ/Redis)      │  │    (Bull + node-cron)               │   │
│  │  - Notifications         │  │  - Daily reports                     │   │
│  │  - Email async          │  │  - Backup jobs                       │   │
│  │  - Webhooks             │  │  - SLA monitoring                    │   │
│  │  - Event streaming      │  │  - Cleanup tasks                     │   │
│  └──────────────────────────┘  └─────────────────────────────────────┘   │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
┌─────────────────────────────────▼───────────────────────────────────────────┐
│                         DATA LAYER                                          │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                     PRIMARY DATABASE                                │   │
│  │                      (PostgreSQL 16)                               │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │   │
│  │  │  Schema  │  │  Views   │  │Functions │  │Triggers  │        │   │
│  │  │ (Drizzle)│  │Materialzd│  │  (PL/pgSQL)│ │ (Audit)  │        │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────┐  ┌─────────────────────────────────────────┐│
│  │   READ REPLICA         │  │        CACHE CLUSTER                    ││
│  │   (PostgreSQL)         │  │        (Redis Cluster)                  ││
│  │   Reporting/Queries    │  │   Sessions, API Cache, Rate Limits      ││
│  └─────────────────────────┘  └─────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────┐  ┌─────────────────────────────────────────┐│
│  │   OBJECT STORAGE       │  │        SEARCH ENGINE                    ││
│  │   (MinIO/S3)          │  │        (Meilisearch/Elasticsearch)       ││
│  │   Documents, Images    │  │   Full-text search, Autocomplete        ││
│  └─────────────────────────┘  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

## 3.2 Technology Stack

### Backend Technologies

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Runtime | Node.js | 20 LTS | JavaScript runtime |
| Framework | Fastify | 4.x | Web framework |
| ORM | Drizzle ORM | Latest | Database abstraction |
| Database | PostgreSQL | 16 | Primary database |
| Cache | Redis | 7 | Caching & sessions |
| Queue | BullMQ | 5 | Job queue |
| Search | Meilisearch | 1.6 | Full-text search |
| Storage | MinIO | Latest | S3-compatible storage |
| Container | Docker | 24 | Containerization |
| Orchestration | Kubernetes | 1.28 | Container orchestration |

### Frontend Technologies

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Framework | React | 18 | UI framework |
| Build | Vite | 5 | Build tool |
| Language | TypeScript | 5 | Type safety |
| Styling | TailwindCSS | 3 | Utility CSS |
| Components | Shadcn/UI | Latest | UI component library |
| State | Zustand | 4 | State management |
| Data Fetching | TanStack Query | 5 | Server state |
| Forms | React Hook Form | 7 | Form handling |
| Validation | Zod | 3 | Schema validation |
| Charts | Recharts | 2 | Data visualization |
| Calendar | FullCalendar | 6 | Calendar views |

### DevOps Technologies

| Component | Technology | Purpose |
|-----------|------------|---------|
| CI/CD | GitHub Actions | Automated pipelines |
| Monitoring | Prometheus + Grafana | Metrics & alerting |
| Logging | ELK Stack | Centralized logging |
| Tracing | Jaeger | Distributed tracing |
| Secrets | Vault | Secret management |

## 3.3 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PRODUCTION ENVIRONMENT                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    LOAD BALANCER (HAProxy/Cloud LB)                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                          │
│         ┌────────────────────────┼────────────────────────┐              │
│         │                        │                        │              │
│         ▼                        ▼                        ▼              │
│  ┌─────────────┐         ┌─────────────┐         ┌─────────────┐        │
│  │  Web Pod 1  │         │  Web Pod 2  │         │  Web Pod N  │        │
│  └─────────────┘         └─────────────┘         └─────────────┘        │
│         │                        │                        │              │
│         └────────────────────────┼────────────────────────┘              │
│                                  │                                          │
│                                  ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    DATABASE CLUSTER                               │    │
│  │  ┌─────────┐      ┌─────────┐      ┌─────────┐                  │    │
│  │  │ Primary │──────│ Replica │──────│ Replica │                  │    │
│  │  │  (W)   │      │   (R)   │      │   (R)   │                  │    │
│  │  └─────────┘      └─────────┘      └─────────┘                  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

---

# 3.4 UI/UX Library Stack

This section details the visual libraries and components for a modern, professional ERP interface.

## 3.4.1 UI Component Libraries

| Library | Description | Use Case |
|---------|-------------|----------|
| **Shadcn/UI** | Collection of accessible, reusable components built with Radix UI and TailwindCSS | Primary UI foundation |
| **Radix UI** | Unstyled, accessible primitives for building high-quality design systems | Low-level components |
| **TailwindCSS** | Utility-first CSS framework | Styling foundation |
| **Mantine** | Full-featured React UI library | Alternative/complementary |
| **NextUI** | Beautiful, modern UI components | For specific widgets |

**Recommendation**: Use **Shadcn/UI** as primary - it's copy/paste, fully customizable, and integrates perfectly with TailwindCSS.

## 3.4.2 Data Visualization (Charts)

| Library | Description | Pros | Cons |
|---------|-------------|------|------|
| **Recharts** | Composable charts for React | Lightweight, SVG-based, very popular | Limited interactivity |
| **Nivo** | Rich, animated charts | Beautiful, many chart types | Bundle size larger |
| **Tremor** | Building blocks for dashboards | Pre-made blocks, beautiful | Limited customization |
| **Visx** (Airbnb) | Low-level visualization primitives | Highly customizable | Steeper learning curve |

**Recommendation**: **Recharts** for standard charts + **Tremor** for dashboard blocks.

## 3.4.3 Gantt Charts

| Library | Description | License | Features |
|---------|-------------|---------|----------|
| **react-gantt-task** | Simple React Gantt | MIT | Basic features, open source |
| **gantt-task** | React Gantt chart | MIT | Active development |
| **dhtmlx-gantt** | Professional Gantt library | Commercial | Full-featured, expensive |

**Recommendation**: Start with **react-gantt-task** (open source) for MVP, upgrade to **dhtmlx** for enterprise.

## 3.4.4 Kanban / Drag & Drop

| Library | Description | Pros |
|---------|-------------|------|
| **dnd-kit** | Modern drag & drop toolkit | Newest, best React support |
| **react-beautiful-dnd** | Atlassian's library | Very stable |
| **react-flow** | Node-based workflows | Perfect for workflow diagrams |

**Recommendation**: **dnd-kit** for Kanban boards - modern, accessible, actively maintained.

## 3.4.5 Data Tables

| Library | Description | Features |
|---------|-------------|----------|
| **TanStack Table v8** | Headless table library | Full control, pagination, sorting |
| **AG Grid** | Enterprise React grid | Most features |
| **Shadcn Table** | Table components | Built on TanStack, matches design |

**Recommendation**: **TanStack Table** + **Shadcn Table** components.

## 3.4.6 Calendar & Forms

| Category | Library | Use |
|---------|---------|-----|
| Calendar | FullCalendar | Scheduling |
| Forms | React Hook Form + Zod | Form handling + validation |
| Icons | Lucide React | Icon system |
| Toast | Sonner | Notifications |

## 3.4.7 Recommended Visual Stack

```
Base UI:       Shadcn/UI + TailwindCSS
Tables:        TanStack Table + Shadcn
Charts:        Recharts + Tremor
Kanban:        dnd-kit
Gantt:         react-gantt-task (MVP)
Calendar:      FullCalendar
Forms:         React Hook Form + Zod
Icons:         Lucide React
```

# 4. DATA MODEL

## 4.1 Schema Overview

The database schema is organized by domain, with clear relationships between modules.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATABASE SCHEMA ORGANIZATION                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         CORE MODULES                                 │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│  │  │  auth   │  │   users  │  │   areas  │  │  roles   │           │   │
│  │  │         │  │          │  │          │  │          │           │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                          │
│  ┌────────────────────────────────┼────────────────────────────────┐    │
│  │                         BUSINESS MODULES                          │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │    │
│  │  │ comercial│  │proyectos │  │inventario│  │   rrhh   │         │    │
│  │  │          │  │          │  │          │  │          │         │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘         │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │    │
│  │  │ tickets  │  │  compras │  │  flota   │  │contabili │         │    │
│  │  │          │  │          │  │          │  │   dad    │         │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘         │    │
│  └───────────────────────────────────────────────────────────────────┘    │
│                                    │                                          │
│  ┌────────────────────────────────┼────────────────────────────────┐    │
│  │                         SYSTEM MODULES                           │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │    │
│  │  │ auditoria │  │   logs   │  │notificac │  │  config  │        │    │
│  │  │          │  │          │  │   iones  │  │          │        │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │    │
│  └───────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 4.2 Entity Relationship Diagram (Core)

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   usuarios  │       │    areas    │       │   clientes  │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)    │◄──────│ id (PK)    │       │ id (PK)    │
│ area_id(FK)│       │ padre_id(FK)│       │             │
│ email      │       │ nombre      │       │             │
│ nombre     │       └──────┬──────┘       └──────┬──────┘
└──────┬──────┘              │                     │
       │                     │                     │
       │            ┌────────▼────────┐            │
       │            │  usuarios_roles │            │
       │            ├────────────────┤            │
       └───────────►│ usuario_id(FK) │◄───────────┘
                    │ rol_id (FK)    │
                    │ area_id(FK)    │
                    └────────┬───────┘
                             │
                    ┌────────▼────────┐
                    │     roles      │
                    ├────────────────┤
                    │ id (PK)        │
                    │ nombre         │
                    │ nivel          │
                    └────────────────┘
```

## 4.3 Complete Entity Catalog

### Core Entities

| Entity | Module | Description | Relationships |
|--------|--------|-------------|---------------|
| `usuarios` | Auth | System users | areas, roles, empleados |
| `areas` | Core | Organizational units | self (hierarchy) |
| `roles` | Auth | User roles | usuarios, permisos |
| `permisos` | Auth | Permission definitions | roles |
| `usuarios_roles` | Auth | User-role mapping | usuarios, roles, areas |
| `tokens_sesion` | Auth | Session tokens | usuarios |

### Commercial Entities

| Entity | Module | Description | Relationships |
|--------|--------|-------------|---------------|
| `clientes` | Comercial | Client master | contactos, oportunidades, proyectos |
| `contactos` | Comercial | Client contacts | clientes |
| `oportunidades` | Comercial | Sales pipeline | clientes, proyectos |
| `actividades` | Comercial | Sales activities | oportunidades, clientes, usuarios |
| `cotizaciones` | Comercial | Quotes | clientes, proyectos, oportunidades |
| `cotizacion_items` | Comercial | Quote line items | cotizaciones, inventario |

### Project Entities

| Entity | Module | Description | Relationships |
|--------|--------|-------------|---------------|
| `proyectos` | Proyectos | Project master | clientes, centros_costo, usuarios |
| `centros_costo` | Proyectos | Cost centers | proyectos, self (hierarchy) |
| `hitos` | Proyectos | Project milestones | proyectos |
| `proyecto_recursos` | Proyectos | Resource allocation | proyectos, usuarios, areas |
| `proyecto_documentos` | Proyectos | Project documents | proyectos, usuarios |
| `proyecto_seguimiento` | Proyectos | Progress tracking | proyectos, usuarios |

### Inventory Entities

| Entity | Module | Description | Relationships |
|--------|--------|-------------|---------------|
| `inventario` | Inventario | Item catalog | categorias, almacenes, proveedores |
| `inventario_categorias` | Inventario | Item categories | self (hierarchy) |
| `almacenes` | Inventario | Warehouses | usuarios |
| `inventario_movimientos` | Inventario | Stock movements | inventario, almacenes, proyectos, centros_costo |
| `inventario_stock` | Inventario | Stock levels | inventario, almacenes |

### TI Assets Entities

| Entity | Module | Description | Relationships |
|--------|--------|-------------|---------------|
| `ti_activos` | TI | Tech assets | categorias, marcas, modelos, ubicaciones, usuarios |
| `ti_categorias` | TI | Asset categories | |
| `ti_marcas` | TI | Brands | |
| `ti_modelos` | TI | Models | marcas |
| `ti_ubicaciones` | TI | Locations | self (hierarchy) |
| `ti_estados` | TI | Asset states | |
| `ti_movimientos` | TI | Asset history | ti_activos, usuarios, areas |
| `ti_mantenimientos` | TI | Maintenance records | ti_activos |

### Ticket Entities

| Entity | Module | Description | Relationships |
|--------|--------|-------------|---------------|
| `tickets` | Tickets | Support tickets | areas, tipos_caso, usuarios, proyectos |
| `tipos_caso` | Tickets | Ticket categories | areas |
| `ticket_comentarios` | Tickets | Ticket comments | tickets, usuarios |
| `ticket_adjuntos` | Tickets | Ticket attachments | tickets, usuarios |
| `ticket_tareas` | Tickets | Ticket tasks | tickets, usuarios |
| `ticket_cambios` | Tickets | Change history | tickets, usuarios |

### HR Entities

| Entity | Module | Description | Relationships |
|--------|--------|-------------|---------------|
| `empleados` | RRHH | Employee master | usuarios, areas, centros_costo |
| `contratos` | RRHH | Employment contracts | empleados |
| `asistencias` | RRHH | Attendance records | empleados, usuarios |
| `vacaciones` | RRHH | Vacation requests | empleados, usuarios |
| `ausencias` | RRHH | Leave requests | empleados, usuarios |

### Procurement Entities

| Entity | Module | Description | Relationships |
|--------|--------|-------------|---------------|
| `proveedores` | Compras | Vendor master | |
| `solicitudes_compra` | Compras | Purchase requests | areas, proyectos, centros_costo, usuarios |
| `solicitud_compra_items` | Compras | PR line items | solicitudes_compra, inventario |
| `ordenes_compra` | Compras | Purchase orders | solicitudes_compra, proveedores, usuarios |
| `orden_compra_items` | Compras | PO line items | ordenes_compra, inventario |
| `recepciones` | Compras | Goods receipt | ordenes_compra, usuarios |

### Fleet Entities

| Entity | Module | Description | Relationships |
|--------|--------|-------------|---------------|
| `vehiculos` | Flota | Vehicle master | |
| `vehiculo_asignaciones` | Flota | Vehicle assignments | vehiculos, empleados |
| `vehiculo_mantenimientos` | Flota | Vehicle maintenance | vehiculos |
| `vehiculo_kilometraje` | Flota | Mileage tracking | vehiculos |

### Accounting Entities

| Entity | Module | Description | Relationships |
|--------|--------|-------------|---------------|
| `facturas` | Contabilidad | Invoices | clientes, proyectos, centros_costo |
| `movimientos_contables` | Contabilidad | Accounting entries | cuentas, facturas, proyectos, centros_costo |
| `cuentas_contables` | Contabilidad | Chart of accounts | self (hierarchy) |

### System Entities

| Entity | Module | Description | Relationships |
|--------|--------|-------------|---------------|
| `auditoria_logs` | Sistema | Audit trail | usuarios |
| `notificaciones` | Sistema | User notifications | usuarios |
| `configuraciones` | Sistema | System settings | |

---

# 5. MODULE SPECIFICATIONS

## 5.1 Authentication Module

### Features

| Feature | Description | Priority |
|---------|-------------|----------|
| JWT Authentication | Token-based auth with refresh | Critical |
| Role-Based Access | Granular permissions by module/action | Critical |
| Session Management | Active sessions, force logout | High |
| Two-Factor Auth | Optional 2FA via TOTP | Medium |
| Password Policy | Complexity, expiration, history | High |
| OAuth/SSO | Integration with Google, Microsoft | Medium |
| Password Recovery | Email-based reset flow | High |

### API Endpoints

```
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
POST   /api/v1/auth/recover-password
POST   /api/v1/auth/reset-password
POST   /api/v1/auth/verify-2fa
POST   /api/v1/auth/enable-2fa
GET    /api/v1/auth/me
GET    /api/v1/auth/sessions
DELETE /api/v1/auth/sessions/:id
```

## 5.2 User Management Module

### Features

| Feature | Description | Priority |
|---------|-------------|----------|
| User CRUD | Create, read, update, delete users | Critical |
| Bulk Import | Import users from CSV/Excel | High |
| User Profile | Personal info, preferences | High |
| User Search | Advanced search with filters | High |
| User Reports | User activity, statistics | Medium |

### API Endpoints

```
GET    /api/v1/usuarios
POST   /api/v1/usuarios
GET    /api/v1/usuarios/:id
PUT    /api/v1/usuarios/:id
DELETE /api/v1/usuarios/:id
POST   /api/v1/usuarios/bulk-import
GET    /api/v1/usuarios/:id/activity
```

## 5.3 Commercial/CRM Module

### Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Client Management | Full client lifecycle | Critical |
| Contact Management | Multiple contacts per client | High |
| Opportunity Pipeline | Kanban sales pipeline | Critical |
| Activity Tracking | Calls, meetings, tasks | High |
| Quote Generation | Create quotes from opportunities | High |
| Quote to Project | Convert quote to project | High |
| Revenue Forecasting | Pipeline value projections | Medium |
| Client Portal | Self-service for clients | Medium |

### Pipeline Stages

```
┌──────────┐    ┌─────────────┐    ┌───────────┐    ┌──────────────┐
│ Contacto │───▶│ Calificación│───▶│ Propuesta │───▶│ Negociación │
└──────────┘    └─────────────┘    └───────────┘    └──────────────┘
                                                                   │
                   ┌───────────────────────────────────────────────┘
                   ▼
        ┌──────────────────┐       ┌───────────────────┐
        │ Cerrado Ganado   │       │ Cerrado Perdido  │
        │ → Crear Proyecto │       │ Registrar Motivo │
        └──────────────────┘       └───────────────────┘
```

### API Endpoints

```
# Clients
GET    /api/v1/clientes
POST   /api/v1/clientes
GET    /api/v1/clientes/:id
PUT    /api/v1/clientes/:id
DELETE /api/v1/clientes/:id

# Contacts
GET    /api/v1/clientes/:id/contactos
POST   /api/v1/clientes/:id/contactos

# Opportunities
GET    /api/v1/oportunidades
POST   /api/v1/oportunidades
PUT    /api/v1/oportunidades/:id/etapa
GET    /api/v1/oportunidades/kanban

# Quotes
GET    /api/v1/cotizaciones
POST   /api/v1/cotizaciones
PUT    /api/v1/cotizaciones/:id/enviar
POST   /api/v1/cotizaciones/:id/convertir
```

## 5.4 Project Management Module

### Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Project Lifecycle | Create to close workflow | Critical |
| Gantt Chart | Visual timeline with dependencies | High |
| Milestones | Key project deliverables | High |
| Resource Allocation | Assign people to projects | Critical |
| Budget Tracking | Planned vs actual costs | High |
| Document Management | Version control for docs | High |
| Progress Tracking | % completion, status updates | High |
| Project Templates | Reusable project structures | Medium |

### Project States

```
propuesta → aprobado → iniciado → en_progreso → en_revision → cerrado
                                           ↓
                                        pausado
                                           ↓
                                        cancelado
```

### API Endpoints

```
GET    /api/v1/proyectos
POST   /api/v1/proyectos
GET    /api/v1/proyectos/:id
PUT    /api/v1/proyectos/:id
DELETE /api/v1/proyectos/:id
GET    /api/v1/proyectos/:id/hitos
POST   /api/v1/proyectos/:id/hitos
GET    /api/v1/proyectos/:id/recursos
POST   /api/v1/proyectos/:id/recursos
GET    /api/v1/proyectos/:id/documentos
POST   /api/v1/proyectos/:id/documentos
GET    /api/v1/proyectos/:id/seguimiento
POST   /api/v1/proyectos/:id/seguimiento
GET    /api/v1/proyectos/gantt
```

## 5.5 Inventory Module

### Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Item Catalog | Products, materials, tools | Critical |
| Category Hierarchy | Multi-level categories | High |
| Stock Management | Real-time stock levels | Critical |
| Stock Movements | In/out/adjust/transfer | Critical |
| Barcode Support | Scan-based operations | High |
| Stock Alerts | Minimum stock notifications | High |
| Batch/Serial Tracking | Lot and serial numbers | Medium |
| Multi-Warehouse | Multiple warehouse support | High |
| Stock Valuation | FIFO, average cost methods | Medium |

### Stock Movement Types

```
entrada          → Compra, devolución, transferencia entrada
salida           → Consumo, venta, transferencia salida
ajuste_positivo → Inventario físico, hallazgo
ajuste_negativo → Inventario físico, merma, robo
traslado         → Entre almacenes
baja             → Destrucción, donación
devolucion       → Cliente devuelve
```

### API Endpoints

```
GET    /api/v1/inventario
POST   /api/v1/inventario
GET    /api/v1/inventario/:id
PUT    /api/v1/inventario/:id
DELETE /api/v1/inventario/:id
GET    /api/v1/inventario/:id/stock
POST   /api/v1/inventario/:id/movimientos
GET    /api/v1/inventario/:id/historial
GET    /api/v1/inventario/alertas
GET    /api/v1/inventario/kardex
POST   /api/v1/inventario/ajuste
```

## 5.6 IT Assets Module

### Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Asset Registry | Complete asset tracking | Critical |
| QR Code Labels | Print and scan labels | High |
| Assignment Tracking | Who has what asset | Critical |
| Maintenance Records | Preventive/corrective | High |
| Asset Lifecycle | New → Use → Maintain → Retire | High |
| Warranty Tracking | Expiration alerts | High |
| Specifications | Detailed specs per category | Medium |
| Depreciation | Asset value over time | Medium |

### Lifecycle States

```
nuevo → en_uso → mantenimiento → retired → baja
         ↑
      asignado
```

### API Endpoints

```
GET    /api/v1/ti-activos
POST   /api/v1/ti-activos
GET    /api/v1/ti-activos/:id
PUT    /api/v1/ti-activos/:id
GET    /api/v1/ti-activos/:id/historial
POST   /api/v1/ti-activos/:id/asignar
POST   /api/v1/ti-activos/:id/mantenimiento
GET    /api/v1/ti-activos/qr/:codigo
GET    /api/v1/ti-activos/garantias-proximas
```

## 5.7 Tickets Module

### Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Multi-Category | Tickets by department | Critical |
| SLA Management | Automatic timers, escalations | Critical |
| Workflow Automation | State machine per type | High |
| Assignment | Auto-assign, manual assign | High |
| Comments | Internal/external comments | High |
| Attachments | File uploads | High |
| Time Tracking | Time spent on tickets | Medium |
| Satisfaction Survey | Post-resolution feedback | Medium |
| Knowledge Base | Suggested solutions | Medium |

### SLA Workflow

```
Ticket Created
      │
      ▼
┌─────────────────┐
│ SLA Timer Start │
│ (sla_inicio)   │
└────────┬────────┘
         │
         ▼
   ┌───────────┐
   │ In Progress│
   └─────┬─────┘
         │
    ┌────┴────┐
    │ SLA     │
    │ Warning │─────► Email to Agent
    │ (80%)   │
    └────┬────┘
         │
    ┌────┴────┐
    │ SLA     │
    │ Critical│─────► Email to Manager
    │ (100%)  │
    └────┬────┘
         │
         ▼
   ┌───────────┐
   │ Escalate  │
   └───────────┘
```

### API Endpoints

```
GET    /api/v1/tickets
POST   /api/v1/tickets
GET    /api/v1/tickets/:id
PUT    /api/v1/tickets/:id
POST   /api/v1/tickets/:id/comentarios
POST   /api/v1/tickets/:id/adjuntos
PUT    /api/v1/tickets/:id/estado
GET    /api/v1/tickets/kanban
GET    /api/v1/tickets/metricas
GET    /api/v1/tickets/sla
```

## 5.8 HR Module

### Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Employee Registry | Full employee profiles | Critical |
| Contract Management | Multiple contract types | High |
| Attendance Tracking | Entry/exit logging | High |
| Vacation Management | Request and approval workflow | High |
| Leave Management | Sick, personal, other | High |
| Employee Portal | Self-service access | High |
| Org Chart | Company structure visualization | Medium |

### Vacation Workflow

```
Solicitud → Aprobación Jefe → Aprobación RRHH → Confirmado
              │                    │
              └─► Rechazado ◄────┘
```

### API Endpoints

```
GET    /api/v1/empleados
POST   /api/v1/empleados
GET    /api/v1/empleados/:id
PUT    /api/v1/empleados/:id
GET    /api/v1/contratos
POST   /api/v1/contratos
GET    /api/v1/asistencias
POST   /api/v1/asistencias
GET    /api/v1/asistencias/reporte
GET    /api/v1/vacaciones
POST   /api/v1/vacaciones
PUT    /api/v1/vacaciones/:id/aprobar
```

## 5.9 Procurement Module

### Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Vendor Management | Supplier database | High |
| Purchase Requests | Request approval workflow | Critical |
| Purchase Orders | Create from approved PRs | Critical |
| Goods Receipt | Receiving against PO | High |
| Partial Receiving | Split deliveries | Medium |
| Price Comparison | Multi-vendor quotes | Medium |

### Procurement Workflow


# 6. WORKFLOWS & AUTOMATION

## 6.1 Automation Engine

The system includes a powerful automation engine that executes actions based on triggers and conditions.

### Automation Types

| Type | Description | Example |
|------|-------------|---------|
| **Trigger-Based** | Execute on specific events | New ticket → Notify agent |
| **Scheduled** | Execute at specific times | Daily backup at 2 AM |
| **Conditional** | Execute if conditions met | Stock < min → Alert |
| **Webhook** | Execute on external events | Payment received → Update invoice |

### Automation Components

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTOMATION ENGINE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  TRIGGER ──► CONDITIONS ──► ACTIONS ──► NOTIFICATIONS         │
│                                                                  │
│  Events:              Conditions:           Actions:              │
│  - Record created     - Field value        - Update record       │
│  - Record updated     - Time range        - Send email          │
│  - Record deleted     - User role          - Create record       │
│  - Scheduled          - Custom script      - Call webhook        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 6.2 Key Automations

### 6.2.1 Ticket SLA Automation

| Trigger | Condition | Action |
|---------|-----------|--------|
| Ticket created | SLA defined | Start SLA timer |
| 80% SLA time | - | Warning notification |
| 100% SLA time | - | Escalate to manager |
| Ticket resolved | - | Stop SLA timer |

### 6.2.2 Inventory Automation

| Trigger | Condition | Action |
|---------|-----------|--------|
| Stock movement | - | Update stock level |
| Stock < min | - | Send alert to logistica |
| Stock = 0 | - | Disable item, notify |
| Warranty expiring | 30 days before | Alert to TI |

### 6.2.3 Purchase Automation

| Trigger | Condition | Action |
|---------|-----------|--------|
| PR created | Amount > threshold | Notify manager |
| PR approved | - | Create PO draft |
| PO received | - | Update inventory |

### 6.2.4 HR Automation

| Trigger | Condition | Action |
|---------|-----------|--------|
| Vacation request | - | Notify manager |
| Manager approved | - | Notify HR |
| Contract expiring | 30 days before | Alert HR |
| Attendance missing | After 9 AM | Notify supervisor |

## 6.3 Workflow Definitions

### 6.3.1 Approval Workflows

```
APPROVAL WORKFLOW TEMPLATE
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Started   │────▶│  Pending   │────▶│  Approved  │
└─────────────┘     │  Approval  │     └─────────────┘
                    └──────┬──────┘
                           │ Rejected
                           ▼
                    ┌─────────────┐
                    │   Return    │
                    │   to User   │
                    └─────────────┘
```

### 6.3.2 Notification System

| Channel | Use Case |
|---------|----------|
| **In-App** | Real-time notifications in dashboard |
| **Email** | Formal communications, reports |
| **Telegram** | Alerts, urgent notifications |
| **WhatsApp** | Customer notifications |
| **SMS** | Critical alerts only |

---

# 7. API ARCHITECTURE

## 7.1 API Design Principles

| Principle | Description |
|-----------|-------------|
| **RESTful** | Resource-based URLs, HTTP verbs |
| **Versioned** | /api/v1/, /api/v2/ |
| **Secure** | JWT auth, rate limiting |
| **Documented** | OpenAPI/Swagger specs |
| **Consistent** | Standard response format |

## 7.2 API Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Example",
    "created_at": "2026-03-20T12:00:00Z"
  },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 100
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

## 7.3 Authentication

### JWT Token Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  Login  │────▶│ Generate│────▶│  Store  │────▶│  Send   │
│ Request │     │  JWT    │     │  Token  │     │  to UI  │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Verify    │
                    │   on each   │
                    │   request   │
                    └─────────────┘
```

### Token Types

| Token | Expiry | Use |
|-------|--------|-----|
| Access Token | 15 minutes | API requests |
| Refresh Token | 7 days | Get new access token |

## 7.4 Rate Limiting

| Plan | Requests/Hour | Burst |
|------|---------------|-------|
| Free | 100 | 10 |
| Standard | 1,000 | 100 |
| Premium | 10,000 | 1,000 |
| Enterprise | Unlimited | Custom |

## 7.5 API Versioning Strategy

```
/api/v1/users     → Current stable
/api/v2/users     → New features (deprecated)
/api/beta/users   → Beta testing
```

---

# 8. SECURITY & COMPLIANCE

## 8.1 Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │   Perimeter │    │  Application │    │    Data     │      │
│  │   Security  │    │   Security   │    │   Security  │      │
│  ├─────────────┤    ├─────────────┤    ├─────────────┤      │
│  │ - WAF       │    │ - Auth      │    │ - Encryption │      │
│  │ - DDoS      │    │ - RBAC      │    │ - Masking   │      │
│  │ - Rate Limit│    │ - Validation│    │ - Backup    │      │
│  │ - CDN       │    │ - Sanitization│  │ - Audit     │      │
│  └─────────────┘    └─────────────┘    └─────────────┘      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 8.2 Authentication & Authorization

### Authentication Methods

| Method | Use Case | Security Level |
|--------|----------|----------------|
| **JWT** | API access | High |
| **2FA/TOTP** | Admin access | Very High |
| **OAuth2** | SSO integration | High |
| **API Keys** | Service-to-service | Medium |

### Role-Based Access Control (RBAC)

```
ROLE HIERARCHY
┌──────────┐
│   Admin  │  ← Full access
└────┬─────┘
     │
     ▼
┌──────────┐    ┌──────────┐
│  Gerente │    │  Contador│
└────┬─────┘    └────┬─────┘
     │               │
     ▼               ▼
┌──────────┐    ┌──────────┐
│Supervisor│    │Empleado  │
└──────────┘    └──────────┘
```

## 8.3 Data Protection

| Protection | Implementation |
|------------|----------------|
| **Encryption at Rest** | PostgreSQL TDE |
| **Encryption in Transit** | TLS 1.3 |
| **Password Hashing** | bcrypt with salt |
| **Sensitive Data** | Field-level encryption |
| **Backup Encryption** | AES-256 |

## 8.4 Audit Trail

```typescript
// Every change is logged
auditoria_logs {
  id: UUID
  usuario_id: UUID
  accion: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'EXPORT'
  modulo: string
  registro_id: UUID
  datos_anteriores: JSONB
  datos_nuevos: JSONB
  ip_address: string
  user_agent: string
  created_at: timestamp
}
```

## 8.5 Compliance

| Standard | Implementation |
|----------|----------------|
| **GDPR** | Data retention, consent, deletion |
| **SOX** | Audit trails, access controls |
| **ISO 27001** | Security policies |

---

# 9. SCALABILITY STRATEGY

## 9.1 Scaling Dimensions

```
┌─────────────────────────────────────────────────────────────────┐
│                     SCALABILITY PILLARS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  Horizontal │  │  Vertical   │  │   Database  │            │
│  │  Scaling   │  │  Scaling    │  │   Scaling   │            │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤            │
│  │ Add more   │  │ More CPU/   │  │ Read        │            │
│  │ instances  │  │ RAM         │  │ replicas    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 9.2 Database Scaling

| Strategy | Implementation |
|----------|----------------|
| **Read Replicas** | PostgreSQL streaming replication |
| **Connection Pooling** | PgBouncer |
| **Sharding** | By tenant (future) |
| **Caching** | Redis for hot data |

## 9.3 Application Scaling

| Component | Strategy |
|-----------|----------|
| **Stateless API** | Any instance can handle any request |
| **Session Store** | Redis |
| **File Storage** | S3/MinIO |
| **Static Assets** | CDN |

## 9.4 Performance Targets

| Metric | Target |
|--------|--------|
| API Response Time | < 200ms (p95) |
| Page Load Time | < 3 seconds |
| Database Queries | < 100ms |
| Concurrent Users | 500+ |

---

# 10. INTEGRATION ECOSYSTEM

## 10.1 Integration Methods

| Method | Use Case |
|--------|----------|
| **REST API** | Most integrations |
| **Webhooks** | Event-driven |
| **GraphQL** | Flexible queries |
| **SFTP** | Bulk data import/export |

## 10.2 Native Integrations

| Service | Type | Features |
|---------|------|----------|
| **WhatsApp Business** | API | Notifications, bot |
| **Telegram** | Bot API | Alerts, commands |
| **Google Workspace** | OAuth | SSO, Calendar |
| **Microsoft 365** | OAuth | SSO, Calendar |
| **AWS S3** | SDK | File storage |
| **SendGrid/SMTP** | Email | Notifications |

## 10.3 Future Integrations

| Service | Planned |
|---------|---------|
| **SAP** | ERP integration |
| **ContaPlus** | Accounting sync |
| **Power BI** | Advanced analytics |
| **Zapier** | No-code automation |

---

# 11. USER EXPERIENCE

## 11.1 Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Consistent** | Same components across modules |
| **Intuitive** | Minimal training required |
| **Responsive** | Works on desktop, tablet, mobile |
| **Accessible** | WCAG 2.1 AA compliant |
| **Fast** | < 3s page load |

## 11.2 User Types & Flows

### 11.2.1 Admin User

```
Admin Dashboard
    │
    ├── User Management
    ├── System Configuration
    ├── Reports & Analytics
    └── Audit Logs
```

### 11.2.2 Project Manager

```
PM Dashboard
    │
    ├── Active Projects
    ├── Team Allocation
    ├── Budget Overview
    └── Reports
```

### 11.2.3 Employee

```
Employee Portal
    │
    ├── My Tickets
    ├── My Vacations
    ├── My Assets
    └── My Profile
```

## 11.3 Mobile Experience

| Feature | Implementation |
|---------|----------------|
| **Responsive Layout** | TailwindCSS responsive classes |
| **Touch Optimized** | Large tap targets |
| **Offline Mode** | PWA with service workers |
| **Push Notifications** | Web push API |

---

# 12. DEVELOPMENT ROADMAP

## 12.1 Phases Overview

| Phase | Duration | Focus |
|-------|----------|-------|
| **Phase 1** | Weeks 1-3 | Foundation (Auth, Users, Areas) |
| **Phase 2** | Weeks 4-5 | Commercial/CRM |
| **Phase 3** | Weeks 6-7 | Projects |
| **Phase 4** | Weeks 8-9 | Inventory |
| **Phase 5** | Weeks 10-11 | IT Assets |
| **Phase 6** | Weeks 12-13 | Tickets |
| **Phase 7** | Weeks 14-16 | HR |
| **Phase 8** | Weeks 17-18 | Procurement |
| **Phase 9** | Weeks 19-20 | Fleet + Accounting |
| **Phase 10** | Weeks 21-22 | Polish & Deploy |

## 12.2 Detailed Timeline

### Phase 1: Foundation (Weeks 1-3)

| Week | Task | Deliverable |
|------|------|--------------|
| 1 | Project setup, Docker, DB | Running environment |
| 2 | Auth module, JWT | Login/logout working |
| 3 | Users, Roles, Areas CRUD | Admin panel ready |

### Phase 2: Commercial (Weeks 4-5)

| Week | Task | Deliverable |
|------|------|--------------|
| 4 | Clients, Contacts | CRM basic |
| 5 | Opportunities, Pipeline | Kanban view |

### Phase 3: Projects (Weeks 6-7)

| Week | Task | Deliverable |
|------|------|--------------|
| 6 | Projects CRUD, Gantt | Project management |
| 7 | Resources, Documents | Full project module |

### Phase 4: Inventory (Weeks 8-9)

| Week | Task | Deliverable |
|------|------|--------------|
| 8 | Items, Categories | Catalog ready |
| 9 | Movements, Alerts | Stock management |

### Phase 5: IT Assets (Weeks 10-11)

| Week | Task | Deliverable |
|------|------|--------------|
| 10 | Assets, QR Codes | Asset registry |
| 11 | Movements, Maintenance | Full TI module |

### Phase 6: Tickets (Weeks 12-13)

| Week | Task | Deliverable |
|------|------|--------------|
| 12 | Tickets CRUD | Support system |
| 13 | SLA, Workflows | Full ticketing |

### Phase 7: HR (Weeks 14-16)

| Week | Task | Deliverable |
|------|------|--------------|
| 14 | Employees, Contracts | Employee management |
| 15 | Attendance | Time tracking |
| 16 | Vacations | Leave management |

### Phase 8: Procurement (Weeks 17-18)

| Week | Task | Deliverable |
|------|------|--------------|
| 17 | Vendors, PR | Purchase requests |
| 18 | PO, Receiving | Full procurement |

### Phase 9: Fleet + Accounting (Weeks 19-20)

| Week | Task | Deliverable |
|------|------|--------------|
| 19 | Vehicles, Maintenance | Fleet management |
| 20 | Invoicing | Basic accounting |

### Phase 10: Polish (Weeks 21-22)

| Week | Task | Deliverable |
|------|------|--------------|
| 21 | UI refinement, Testing | Quality assurance |
| 22 | Documentation, Deploy | Production ready |

---

# 13. RISK & MITIGATION

## 13.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Scope creep | High | Medium | Strict sprint planning |
| Integration complexity | High | Medium | Prototype early |
| Performance issues | Medium | Low | Performance testing |
| Data migration | High | Medium | Incremental migration |

## 13.2 Project Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Resource availability | High | Medium | Cross-train team |
| Timeline delays | Medium | High | Buffer time |
| Budget overruns | Medium | Low | Regular tracking |

## 13.3 Mitigation Strategies

| Strategy | Description |
|----------|-------------|
| **Agile Methodology** | 2-week sprints with regular reviews |
| **Continuous Testing** | Automated tests in CI/CD |
| **Code Reviews** | All PRs reviewed |
| **Documentation** | Inline + external docs |
| **Monitoring** | Production monitoring from day 1 |

---

# APPENDIX

## A. Technology References

- **Backend**: https://fastify.dev/
- **Database**: https://www.postgresql.org/
- **ORM**: https://orm.drizzle.team/
- **Frontend**: https://react.dev/
- **UI**: https://ui.shadcn.com/
- **Charts**: https://recharts.org/
- **Tables**: https://tanstack.com/table/

## B. API Documentation

Interactive API docs available at `/api/docs` when running locally.

## C. Database Schema

Full Drizzle schema in: `backend/drizzle/schema.ts`

## D. Deployment Scripts

Docker Compose and Kubernetes configs in: `deploy/`

---

**Document Version**: 4.0  
**Last Updated**: 2026-03-20  
**Author**: Arni - ERP SAS Architecture Team  
**Status**: Complete - Ready for Development
