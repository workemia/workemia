<<<<<<< Updated upstream
# Arquitetura de Microsserviços - ServiceHub
=======
# Arquitetura de Microsserviços - Workemia
>>>>>>> Stashed changes

**Versão:** 1.0.0
**Data:** 2025-10-04
**Status:** Em Planejamento

---

## 📑 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura Proposta](#arquitetura-proposta)
3. [Stack Tecnológica](#stack-tecnológica)
4. [Microsserviços](#microsserviços)
5. [Padrões e Práticas](#padrões-e-práticas)
6. [Infraestrutura](#infraestrutura)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Segurança](#segurança)
9. [Observabilidade](#observabilidade)
10. [Estratégia de Migração](#estratégia-de-migração)
11. [Cronograma](#cronograma)
12. [Métricas de Sucesso](#métricas-de-sucesso)

---

## 🎯 Visão Geral

### Objetivo
<<<<<<< Updated upstream
Transformar o ServiceHub de uma aplicação monolítica Next.js em uma arquitetura de microsserviços moderna, escalável e resiliente, utilizando Java 21 + Spring Boot 3.3 para a camada de backend, mantendo Next.js como frontend e BFF (Backend for Frontend).
=======
Transformar o Workemia de uma aplicação monolítica Next.js em uma arquitetura de microsserviços moderna, escalável e resiliente, utilizando Java 21 + Spring Boot 3.3 para a camada de backend, mantendo Next.js como frontend e BFF (Backend for Frontend).
>>>>>>> Stashed changes

### Motivação
- **Escalabilidade independente** de cada domínio de negócio
- **Resiliência** através de isolamento de falhas
- **Performance** otimizada por serviço
- **Deploy independente** para maior agilidade
- **Tecnologia adequada** para cada problema (polyglot architecture)
- **Facilidade de manutenção** com separação clara de responsabilidades

### Princípios Arquiteturais
- **Domain-Driven Design (DDD)**: Bounded contexts bem definidos
- **12-Factor App**: Aplicações cloud-native
- **API-First Design**: Contratos bem definidos
- **Database per Service**: Isolamento de dados
- **Event-Driven Architecture**: Comunicação assíncrona
- **Infrastructure as Code**: Reprodutibilidade

---

## 🏗️ Arquitetura Proposta

### Diagrama de Alto Nível

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  Web App (Next.js) │ Mobile App (React Native) │ Admin Panel    │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────┴─────────────────────────────────┐
│                    FRONTEND/BFF LAYER                            │
│                      Next.js 15 (App Router)                     │
│  - SSR/SSG para SEO                                              │
│  - API aggregation (BFF pattern)                                 │
│  - WebSocket gateway                                             │
│  - Static asset serving                                          │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTPS/WSS
┌───────────────────────────────┴─────────────────────────────────┐
│                       API GATEWAY LAYER                          │
│                  Spring Cloud Gateway                            │
│  - Routing & Load Balancing                                      │
│  - Authentication & Authorization                                │
│  - Rate Limiting & Throttling                                    │
│  - Request/Response Transformation                               │
│  - Circuit Breaking                                              │
│  - Distributed Tracing                                           │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────┴─────────────────────────────────┐
│                   MICROSERVICES LAYER (Spring Boot)              │
├──────────────┬──────────────┬──────────────┬────────────────────┤
│ Auth Service │ User Service │Service Mgmt  │ Payment Service    │
│              │              │   Service    │                    │
│ Port: 8081   │ Port: 8082   │ Port: 8083   │ Port: 8084         │
├──────────────┼──────────────┼──────────────┼────────────────────┤
│  Provider    │   Review     │  Location    │  Notification      │
│  Service     │   Service    │   Service    │    Service         │
│              │              │              │                    │
│ Port: 8085   │ Port: 8086   │ Port: 8087   │ Port: 8088         │
├──────────────┴──────────────┴──────────────┴────────────────────┤
│                      Chat Service (WebSocket)                    │
│                         Port: 8089                               │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────┴─────────────────────────────────┐
│                    INFRASTRUCTURE LAYER                          │
├─────────────┬─────────────┬─────────────┬──────────────────────┤
│ Service     │   Message   │   Cache     │    Search            │
│ Discovery   │   Broker    │   Store     │    Engine            │
│             │             │             │                      │
│ Consul/     │ RabbitMQ/   │   Redis     │ Elasticsearch        │
│ Eureka      │ Kafka       │   Cluster   │    Cluster           │
└─────────────┴─────────────┴─────────────┴──────────────────────┘
                                │
┌───────────────────────────────┴─────────────────────────────────┐
│                        DATA LAYER                                │
├─────────────┬─────────────┬─────────────┬──────────────────────┤
│  Auth DB    │  User DB    │ Service DB  │  Payment DB          │
│ PostgreSQL  │ PostgreSQL  │ PostgreSQL  │  PostgreSQL          │
├─────────────┼─────────────┼─────────────┼──────────────────────┤
│ Provider DB │ Review DB   │ Location DB │ Notification DB      │
│ PostgreSQL  │ PostgreSQL  │ PostGIS     │  PostgreSQL          │
├─────────────┴─────────────┴─────────────┴──────────────────────┤
│                     Chat Messages DB                             │
│                       MongoDB                                    │
└──────────────────────────────────────────────────────────────────┘
```

### Comunicação entre Serviços

**Síncrona (REST/gRPC):**
- User → Auth: Validação de token
- Service → Provider: Busca de prestadores disponíveis
- Payment → Service: Confirmação de pagamento

**Assíncrona (Event-Driven):**
- Service Created → Notification Service (envio de notificação)
- Payment Completed → Service Service (atualização de status)
- Review Submitted → Provider Service (atualização de rating)

---

## 🛠️ Stack Tecnológica

### Backend (Microsserviços)
| Componente | Tecnologia | Versão | Justificativa |
|------------|------------|--------|---------------|
| Runtime | Java | 21 LTS | Virtual Threads, Pattern Matching, Records |
| Framework | Spring Boot | 3.3+ | Ecosystem maduro, produtividade |
| API Gateway | Spring Cloud Gateway | 4.1+ | Integração nativa com Spring |
| Service Discovery | Consul/Eureka | Latest | Service registry dinâmico |
| Config Server | Spring Cloud Config | 4.1+ | Configuração centralizada |
| Circuit Breaker | Resilience4j | 2.2+ | Resiliência e fault tolerance |
| API Documentation | SpringDoc OpenAPI | 2.5+ | OpenAPI 3.0 automático |
| Security | Spring Security + OAuth2 | 6.3+ | JWT, OAuth2, RBAC |
| Database | PostgreSQL | 16 | ACID, performance, extensões |
| Cache | Redis | 7+ | Cache distribuído, sessions |
| Message Broker | RabbitMQ | 3.13+ | AMQP, message patterns |
| Search Engine | Elasticsearch | 8.12+ | Full-text search, logs |
| NoSQL (Chat) | MongoDB | 7+ | Documentos, flexibilidade |
| Location DB | PostGIS | 3.4+ | Geospatial queries |

### Frontend
| Componente | Tecnologia | Versão |
|------------|------------|--------|
| Framework | Next.js | 15.2.4 |
| Runtime | React | 19 |
| Language | TypeScript | 5+ |
| Styling | Tailwind CSS | 3.4+ |
| UI Components | Radix UI | Latest |
| State Management | React Context + SWR | - |
| Real-time | Socket.io Client | Latest |

### DevOps & Infrastructure
| Componente | Tecnologia | Versão |
|------------|------------|--------|
| Containerization | Docker | 24+ |
| Orchestration | Kubernetes | 1.29+ |
| CI/CD | GitHub Actions | - |
| IaC | Terraform | 1.7+ |
| Monitoring | Prometheus + Grafana | Latest |
| Logging | ELK Stack | 8.12+ |
| Tracing | Jaeger/Zipkin | Latest |
| Registry | Docker Hub/GHCR | - |
| Cloud Provider | AWS/GCP/Azure | - |

### Build & Development Tools
| Componente | Tecnologia |
|------------|------------|
| Build Tool | Maven 3.9+ / Gradle 8+ |
| Code Quality | SonarQube |
| Security Scan | OWASP Dependency Check, Snyk |
| Testing | JUnit 5, Mockito, Testcontainers |
| Load Testing | Gatling, JMeter |
| API Testing | REST Assured, Postman |

---

## 🎨 Microsserviços

### 1. Auth Service (Port 8081)

**Bounded Context:** Autenticação e Autorização

**Responsabilidades:**
- Registro de usuários (cliente, prestador, admin)
- Login/Logout (JWT/OAuth2)
- Refresh token management
- Email verification
- Password reset/recovery
- Multi-factor authentication (MFA)
- Session management
- Role-based access control (RBAC)
- API key management

**Database Schema:**
```sql
auth_db:
  - users (id, email, password_hash, email_verified, mfa_enabled)
  - sessions (id, user_id, token, refresh_token, expires_at)
  - roles (id, name, permissions)
  - user_roles (user_id, role_id)
  - password_reset_tokens (id, user_id, token, expires_at)
  - api_keys (id, user_id, key_hash, name, expires_at)
```

**APIs Principais:**
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
POST   /api/v1/auth/verify-email
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
POST   /api/v1/auth/mfa/enable
POST   /api/v1/auth/mfa/verify
GET    /api/v1/auth/me
```

**Tecnologias Específicas:**
- Spring Security
- jjwt (JWT library)
- BCrypt (password hashing)
- Redis (session store)
- Google Authenticator (MFA)

**Eventos Publicados:**
- `UserRegistered`
- `UserLoggedIn`
- `UserLoggedOut`
- `PasswordResetRequested`
- `EmailVerified`

---

### 2. User Service (Port 8082)

**Bounded Context:** Gerenciamento de Perfis de Usuário

**Responsabilidades:**
- CRUD de perfis de usuário
- Upload de avatar/documentos
- Preferências do usuário
- Histórico de atividades
- User search e filtering
- Profile completion tracking
- User analytics

**Database Schema:**
```sql
user_db:
  - profiles (id, user_id, full_name, phone, avatar_url, bio, preferences_json)
  - addresses (id, user_id, street, city, state, zip, country, latitude, longitude)
  - documents (id, user_id, document_type, document_url, verified, uploaded_at)
  - user_activity_log (id, user_id, action, metadata_json, created_at)
```

**APIs Principais:**
```
GET    /api/v1/users/{id}
PUT    /api/v1/users/{id}
PATCH  /api/v1/users/{id}/avatar
GET    /api/v1/users/{id}/activity
POST   /api/v1/users/{id}/documents
GET    /api/v1/users/search?q=...
```

**Padrões Aplicados:**
- CQRS (reads vs writes separados)
- Event Sourcing (audit trail)
- Cache-aside pattern (Redis)

**Eventos Publicados:**
- `ProfileUpdated`
- `DocumentUploaded`
- `DocumentVerified`

---

### 3. Service Management Service (Port 8083)

**Bounded Context:** Gerenciamento de Serviços

**Responsabilidades:**
- CRUD de serviços solicitados
- Workflow de status (pending → accepted → in_progress → completed → cancelled)
- Matching de serviços com prestadores
- Geolocation-based search
- Service categorization
- Budget management
- Service timeline tracking

**Database Schema:**
```sql
service_db:
  - services (id, title, description, category_id, client_id, provider_id, status, urgency, budget_min, budget_max, final_price, location, lat, lng, preferred_date, created_at, updated_at)
  - service_requests (id, service_id, provider_id, status, proposed_price, description, estimated_time, start_date, materials)
  - categories (id, name, description, icon, active)
  - service_timeline (id, service_id, status, changed_by, notes, timestamp)
```

**APIs Principais:**
```
POST   /api/v1/services
GET    /api/v1/services/{id}
PUT    /api/v1/services/{id}
PATCH  /api/v1/services/{id}/status
GET    /api/v1/services/search?category=...&location=...&radius=...
GET    /api/v1/services/my-services
POST   /api/v1/services/{id}/requests
GET    /api/v1/services/{id}/timeline
```

**Tecnologias Específicas:**
- Elasticsearch (full-text search)
- PostGIS (geospatial queries)
- Redis (cache de serviços ativos)
- WebSocket (real-time updates)

**Eventos Publicados:**
- `ServiceCreated`
- `ServiceStatusChanged`
- `ServiceRequestReceived`
- `ServiceCompleted`
- `ServiceCancelled`

---

### 4. Provider Service (Port 8085)

**Bounded Context:** Gerenciamento de Prestadores

**Responsabilidades:**
- CRUD de perfis de prestadores
- Portfolio management
- Availability calendar
- Skills & certifications
- Service area definition
- Provider metrics (rating, response time, acceptance rate)
- Background check integration

**Database Schema:**
```sql
provider_db:
  - providers (id, user_id, bio, profession, experience, hourly_rate, work_radius, rating, total_reviews, completed_jobs, response_time, acceptance_rate, joined_year)
  - provider_specialties (id, provider_id, specialty, certified)
  - provider_availability (id, provider_id, day_of_week, start_time, end_time)
  - provider_portfolio (id, provider_id, title, description, image_url, project_date)
  - provider_certifications (id, provider_id, certification_name, issuer, issue_date, expiry_date, document_url)
```

**APIs Principais:**
```
GET    /api/v1/providers/{id}
PUT    /api/v1/providers/{id}
GET    /api/v1/providers/search?specialty=...&location=...
GET    /api/v1/providers/{id}/portfolio
POST   /api/v1/providers/{id}/portfolio
GET    /api/v1/providers/{id}/availability
PUT    /api/v1/providers/{id}/availability
GET    /api/v1/providers/{id}/metrics
```

**Eventos Publicados:**
- `ProviderProfileCreated`
- `ProviderAvailabilityUpdated`
- `ProviderMetricsUpdated`

---

### 5. Payment Service (Port 8084)

**Bounded Context:** Processamento de Pagamentos

**Responsabilidades:**
- Payment gateway integration (Stripe, PagSeguro, Mercado Pago)
- Escrow system (hold funds until service completion)
- Refund processing
- Invoice generation (PDF)
- Payment history
- Subscription management (future)
- Tax calculation
- Multi-currency support

**Database Schema:**
```sql
payment_db:
  - transactions (id, service_id, client_id, provider_id, amount, currency, status, payment_method, gateway_transaction_id, created_at, updated_at)
  - escrow_accounts (id, transaction_id, amount, released, released_at)
  - invoices (id, transaction_id, invoice_number, pdf_url, issued_at)
  - refunds (id, transaction_id, amount, reason, status, processed_at)
```

**APIs Principais:**
```
POST   /api/v1/payments/checkout
POST   /api/v1/payments/{id}/confirm
POST   /api/v1/payments/{id}/refund
GET    /api/v1/payments/{id}/invoice
GET    /api/v1/payments/history
POST   /api/v1/payments/webhooks/{gateway}
```

**Padrões Aplicados:**
- Saga Pattern (distributed transactions)
- Outbox Pattern (guaranteed message delivery)
- Idempotency (prevent duplicate charges)

**Eventos Publicados:**
- `PaymentInitiated`
- `PaymentCompleted`
- `PaymentFailed`
- `RefundProcessed`
- `EscrowReleased`

**Compliance:**
- PCI DSS compliance
- Encryption at rest/transit
- No sensitive card data storage

---

### 6. Review Service (Port 8086)

**Bounded Context:** Avaliações e Feedback

**Responsabilidades:**
- CRUD de reviews
- Rating calculation (weighted average)
- Review moderation
- Review responses (provider can reply)
- Review analytics
- Fake review detection
- Review verification (only completed services)

**Database Schema:**
```sql
review_db:
  - reviews (id, service_id, client_id, provider_id, rating, comment, response, verified, flagged, created_at, updated_at)
  - review_flags (id, review_id, reported_by, reason, status, reviewed_at)
  - review_votes (id, review_id, user_id, helpful, created_at)
```

**APIs Principais:**
```
POST   /api/v1/reviews
GET    /api/v1/reviews/{id}
PUT    /api/v1/reviews/{id}
DELETE /api/v1/reviews/{id}
POST   /api/v1/reviews/{id}/response
POST   /api/v1/reviews/{id}/flag
GET    /api/v1/reviews/provider/{providerId}
GET    /api/v1/reviews/service/{serviceId}
```

**Eventos Publicados:**
- `ReviewSubmitted`
- `ReviewResponded`
- `ReviewFlagged`

---

### 7. Notification Service (Port 8088)

**Bounded Context:** Notificações Multi-Canal

**Responsabilidades:**
- Multi-channel notifications (email, SMS, push, in-app)
- Template management
- Notification preferences
- Delivery tracking
- Retry mechanism
- Scheduled notifications
- Notification batching

**Database Schema:**
```sql
notification_db:
  - notifications (id, user_id, type, channel, title, message, data_json, status, sent_at, read_at, created_at)
  - notification_preferences (id, user_id, channel, type, enabled)
  - notification_templates (id, type, channel, subject, body_template, variables)
  - notification_logs (id, notification_id, status, error_message, timestamp)
```

**APIs Principais:**
```
POST   /api/v1/notifications/send
GET    /api/v1/notifications/inbox
PATCH  /api/v1/notifications/{id}/read
GET    /api/v1/notifications/preferences
PUT    /api/v1/notifications/preferences
```

**Tecnologias Específicas:**
- RabbitMQ (notification queue)
- Firebase Cloud Messaging (push)
- SendGrid/AWS SES (email)
- Twilio (SMS)
- Handlebars (templates)

**Eventos Consumidos:**
- `ServiceCreated` → Notify providers
- `ServiceRequestReceived` → Notify client
- `PaymentCompleted` → Notify both parties
- `ReviewSubmitted` → Notify provider

---

### 8. Location Service (Port 8087)

**Bounded Context:** Serviços Geoespaciais

**Responsabilidades:**
- Geocoding (address → coordinates)
- Reverse geocoding (coordinates → address)
- Distance calculation
- Provider/service search by radius
- Service area management
- Map integration (Google Maps, OpenStreetMap)

**Database Schema:**
```sql
location_db (PostGIS):
  - locations (id, entity_type, entity_id, address, city, state, country, zip, coordinates GEOMETRY)
  - service_areas (id, provider_id, area GEOMETRY)
```

**APIs Principais:**
```
POST   /api/v1/locations/geocode
POST   /api/v1/locations/reverse-geocode
GET    /api/v1/locations/nearby?lat=...&lng=...&radius=...
POST   /api/v1/locations/distance
```

**Tecnologias Específicas:**
- PostGIS extension
- Google Maps API / Nominatim

---

### 9. Chat Service (Port 8089)

**Bounded Context:** Comunicação em Tempo Real

**Responsabilidades:**
- Real-time messaging (WebSocket)
- Message persistence
- File/image sharing
- Typing indicators
- Read receipts
- Message search
- Conversation history

**Database Schema:**
```mongodb
chat_db (MongoDB):
  - conversations (id, service_id, participants[], created_at, updated_at)
  - messages (id, conversation_id, sender_id, message, type, attachments[], read_by[], timestamp)
  - typing_indicators (conversation_id, user_id, is_typing, timestamp)
```

**APIs Principais:**
```
WebSocket: ws://chat-service:8089/chat
GET    /api/v1/chat/conversations
GET    /api/v1/chat/conversations/{id}/messages
POST   /api/v1/chat/conversations/{id}/upload
```

**Tecnologias Específicas:**
- Spring WebSocket + STOMP
- MongoDB (document storage)
- Redis Pub/Sub (message distribution)
- S3 (file storage)

---

## 🎯 Padrões e Práticas

### Padrões Arquiteturais

#### 1. API Gateway Pattern
Ponto de entrada único para todos os clientes, responsável por:
- Routing inteligente
- Load balancing
- Authentication/Authorization
- Rate limiting
- Request/Response transformation
- Circuit breaking

```java
@Configuration
public class GatewayConfig {
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("auth-service", r -> r.path("/api/v1/auth/**")
                .filters(f -> f
                    .circuitBreaker(config -> config.setName("authCircuitBreaker"))
                    .retry(3))
                .uri("lb://auth-service"))
            .build();
    }
}
```

#### 2. Service Discovery Pattern
Registro e descoberta dinâmica de serviços:
```yaml
spring:
  cloud:
    consul:
      discovery:
        service-name: ${spring.application.name}
        health-check-path: /actuator/health
        health-check-interval: 10s
```

#### 3. Circuit Breaker Pattern
Prevenção de cascading failures:
```java
@CircuitBreaker(name = "paymentService", fallbackMethod = "paymentFallback")
public PaymentResponse processPayment(PaymentRequest request) {
    return paymentClient.process(request);
}

public PaymentResponse paymentFallback(PaymentRequest request, Exception e) {
    return PaymentResponse.builder()
        .status("PENDING")
        .message("Payment processing delayed, will retry")
        .build();
}
```

#### 4. Saga Pattern (Choreography-based)
Transações distribuídas:
```java
// ServiceBookingSaga
@Service
public class ServiceBookingSaga {

    @EventHandler
    public void on(ServiceCreatedEvent event) {
        // Step 1: Reserve provider
        providerService.reserve(event.getProviderId());
    }

    @EventHandler
    public void on(ProviderReservedEvent event) {
        // Step 2: Process payment
        paymentService.process(event.getServiceId());
    }

    @EventHandler
    public void on(PaymentFailedEvent event) {
        // Compensation: Release provider
        providerService.release(event.getProviderId());
        serviceService.cancel(event.getServiceId());
    }
}
```

#### 5. CQRS Pattern
Separação de leitura e escrita:
```java
// Command (Write)
@PostMapping("/services")
public ResponseEntity<ServiceDTO> createService(@RequestBody CreateServiceCommand command) {
    return commandHandler.handle(command);
}

// Query (Read)
@GetMapping("/services/{id}")
public ResponseEntity<ServiceDTO> getService(@PathVariable UUID id) {
    return queryHandler.handle(new GetServiceQuery(id));
}
```

#### 6. Outbox Pattern
Garantia de entrega de eventos:
```java
@Transactional
public void createService(Service service) {
    serviceRepository.save(service);

    // Save to outbox table
    OutboxEvent event = OutboxEvent.builder()
        .aggregateType("Service")
        .aggregateId(service.getId())
        .eventType("ServiceCreated")
        .payload(toJson(service))
        .build();

    outboxRepository.save(event);
}

// Background job polls outbox and publishes to message broker
@Scheduled(fixedDelay = 1000)
public void publishOutboxEvents() {
    List<OutboxEvent> events = outboxRepository.findUnpublished();
    events.forEach(event -> {
        messageBroker.publish(event);
        event.setPublished(true);
        outboxRepository.save(event);
    });
}
```

### Database per Service
Cada microsserviço possui seu próprio database schema:

```
PostgreSQL Instance 1:
  ├── auth_db
  └── user_db

PostgreSQL Instance 2:
  ├── service_db
  └── provider_db

PostgreSQL Instance 3:
  ├── payment_db
  ├── review_db
  └── notification_db

PostGIS Instance:
  └── location_db

MongoDB Instance:
  └── chat_db
```

### Naming Conventions

**REST APIs:**
- Use substantivos plurais: `/api/v1/services`, `/api/v1/users`
- Versionamento: `/api/v1/`, `/api/v2/`
- Kebab-case para multi-word: `/api/v1/service-requests`

**Events:**
- Past tense: `ServiceCreated`, `PaymentCompleted`
- Domain prefix: `service.created`, `payment.completed`

**Database:**
- Snake_case para tabelas e colunas: `service_requests`, `created_at`
- Plural para tabelas: `users`, `services`

---

## 🏢 Infraestrutura

### Containerização (Docker)

**Exemplo de Dockerfile (Multi-stage):**
```dockerfile
# Build stage
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Security: Non-root user
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

EXPOSE 8080
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
```

### Orquestração (Kubernetes)

**Deployment Example:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
  namespace: servicehub
  labels:
    app: auth-service
    version: v1
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
        version: v1
    spec:
      containers:
      - name: auth-service
        image: servicehub/auth-service:1.0.0
        imagePullPolicy: Always
        ports:
        - containerPort: 8080
          name: http
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: auth-db-secret
              key: url
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 10
          timeoutSeconds: 3
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
---
apiVersion: v1
kind: Service
metadata:
  name: auth-service
  namespace: servicehub
spec:
  type: ClusterIP
  selector:
    app: auth-service
  ports:
  - port: 8080
    targetPort: 8080
    name: http
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: auth-service-hpa
  namespace: servicehub
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: auth-service
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Infrastructure as Code (Terraform)

```hcl
# AWS EKS Cluster
module "eks" {
  source = "terraform-aws-modules/eks/aws"

  cluster_name    = "servicehub-cluster"
  cluster_version = "1.29"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    general = {
      desired_size = 3
      min_size     = 2
      max_size     = 10

      instance_types = ["t3.xlarge"]
      capacity_type  = "ON_DEMAND"
    }
  }
}

# RDS PostgreSQL
module "db" {
  source = "terraform-aws-modules/rds/aws"

  identifier = "servicehub-db"

  engine               = "postgres"
  engine_version       = "16.1"
  family              = "postgres16"
  major_engine_version = "16"
  instance_class       = "db.t3.large"

  allocated_storage     = 100
  max_allocated_storage = 500

  multi_az = true

  backup_retention_period = 7
  backup_window           = "03:00-06:00"
  maintenance_window      = "Mon:00:00-Mon:03:00"
}

# ElastiCache Redis
module "redis" {
  source = "terraform-aws-modules/elasticache/aws"

  cluster_id           = "servicehub-cache"
  engine               = "redis"
  engine_version       = "7.0"
  node_type            = "cache.t3.medium"
  num_cache_nodes      = 3
  parameter_group_name = "default.redis7"
}
```

---

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
name: Microservices CI/CD Pipeline

on:
  push:
    branches: [main, develop]
    paths:
      - 'services/**'
      - '.github/workflows/**'
  pull_request:
    branches: [main, develop]

env:
  REGISTRY: ghcr.io
  IMAGE_PREFIX: ${{ github.repository }}

jobs:
  # Job 1: Build and Test
  build-and-test:
    name: Build and Test - ${{ matrix.service }}
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        service:
          - auth-service
          - user-service
          - service-service
          - provider-service
          - payment-service
          - review-service
          - location-service
          - notification-service
          - chat-service

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
          cache: maven

      - name: Build with Maven
        working-directory: ./services/${{ matrix.service }}
        run: mvn clean package -DskipTests

      - name: Run Unit Tests
        working-directory: ./services/${{ matrix.service }}
        run: mvn test

      - name: Run Integration Tests
        working-directory: ./services/${{ matrix.service }}
        run: mvn verify -P integration-tests

      - name: Upload Test Results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results-${{ matrix.service }}
          path: services/${{ matrix.service }}/target/surefire-reports

      - name: Upload Coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          files: ./services/${{ matrix.service }}/target/site/jacoco/jacoco.xml
          flags: ${{ matrix.service }}

  # Job 2: Code Quality Analysis
  code-quality:
    name: Code Quality - ${{ matrix.service }}
    runs-on: ubuntu-latest
    needs: build-and-test
    strategy:
      matrix:
        service:
          - auth-service
          - user-service
          - service-service

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'

      - name: SonarQube Scan
        working-directory: ./services/${{ matrix.service }}
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        run: |
          mvn sonar:sonar \
            -Dsonar.projectKey=servicehub-${{ matrix.service }} \
            -Dsonar.host.url=${{ secrets.SONAR_HOST_URL }} \
            -Dsonar.login=${{ secrets.SONAR_TOKEN }}

  # Job 3: Security Scanning
  security-scan:
    name: Security Scan - ${{ matrix.service }}
    runs-on: ubuntu-latest
    needs: build-and-test
    strategy:
      matrix:
        service:
          - auth-service
          - payment-service

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run OWASP Dependency Check
        working-directory: ./services/${{ matrix.service }}
        run: mvn org.owasp:dependency-check-maven:check

      - name: Run Snyk Security Scan
        uses: snyk/actions/maven@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          command: test
          args: --severity-threshold=high --file=services/${{ matrix.service }}/pom.xml

  # Job 4: Build and Push Docker Images
  docker-build-push:
    name: Docker Build & Push - ${{ matrix.service }}
    runs-on: ubuntu-latest
    needs: [build-and-test, code-quality, security-scan]
    if: github.event_name == 'push' && (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop')
    strategy:
      matrix:
        service:
          - auth-service
          - user-service
          - service-service
          - provider-service
          - payment-service
          - review-service
          - location-service
          - notification-service
          - chat-service

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_PREFIX }}/${{ matrix.service }}
          tags: |
            type=ref,event=branch
            type=sha,prefix={{branch}}-
            type=semver,pattern={{version}}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./services/${{ matrix.service }}
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          platforms: linux/amd64,linux/arm64

  # Job 5: Deploy to Staging
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: docker-build-push
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.servicehub.com

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure kubectl
        uses: azure/k8s-set-context@v3
        with:
          method: kubeconfig
          kubeconfig: ${{ secrets.KUBE_CONFIG_STAGING }}

      - name: Deploy to Kubernetes
        run: |
          kubectl apply -f infrastructure/kubernetes/staging/
          kubectl rollout status deployment -n servicehub-staging --timeout=5m

      - name: Run Smoke Tests
        run: |
          npm install
          npm run test:smoke -- --env=staging

  # Job 6: Deploy to Production
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: deploy-staging
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://servicehub.com

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure kubectl
        uses: azure/k8s-set-context@v3
        with:
          method: kubeconfig
          kubeconfig: ${{ secrets.KUBE_CONFIG_PROD }}

      - name: Blue/Green Deployment
        run: |
          # Deploy to green environment
          kubectl apply -f infrastructure/kubernetes/production/green/
          kubectl rollout status deployment -n servicehub-prod-green --timeout=10m

          # Run health checks
          ./scripts/health-check.sh green

          # Switch traffic to green
          kubectl patch service -n servicehub-prod servicehub-gateway -p '{"spec":{"selector":{"version":"green"}}}'

          # Wait and monitor
          sleep 300

          # If successful, scale down blue
          kubectl scale deployment -n servicehub-prod-blue --replicas=0 --all

      - name: Rollback on Failure
        if: failure()
        run: |
          kubectl patch service -n servicehub-prod servicehub-gateway -p '{"spec":{"selector":{"version":"blue"}}}'
          kubectl scale deployment -n servicehub-prod-green --replicas=0 --all

  # Job 7: Performance Testing
  performance-test:
    name: Performance Testing
    runs-on: ubuntu-latest
    needs: deploy-staging
    if: github.ref == 'refs/heads/develop'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Gatling Load Tests
        run: |
          cd performance-tests
          mvn gatling:test

      - name: Upload Gatling Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: gatling-report
          path: performance-tests/target/gatling
```

---

## 🔒 Segurança

### Camadas de Segurança

#### 1. Network Security
- **TLS 1.3** para todas comunicações externas
- **mTLS** para comunicação inter-service (service mesh)
- **Network Policies** no Kubernetes
- **WAF** (Web Application Firewall) no API Gateway

#### 2. Authentication & Authorization

**JWT Token Structure:**
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "roles": ["ROLE_CLIENT", "ROLE_PROVIDER"],
  "permissions": ["service:create", "payment:read"],
  "iat": 1234567890,
  "exp": 1234571490
}
```

**Spring Security Configuration:**
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/services/**").hasAnyRole("CLIENT", "PROVIDER")
                .anyRequest().authenticated())
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())))
            .build();
    }
}
```

#### 3. Rate Limiting

**Bucket4j Implementation:**
```java
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) {
        String key = getUserKey(request);
        Bucket bucket = cache.computeIfAbsent(key, k -> createBucket());

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(429);
            response.getWriter().write("Too many requests");
        }
    }

    private Bucket createBucket() {
        Bandwidth limit = Bandwidth.builder()
            .capacity(100)
            .refillIntervally(100, Duration.ofMinutes(1))
            .build();
        return Bucket.builder().addLimit(limit).build();
    }
}
```

#### 4. Data Encryption

**Database Encryption:**
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/auth_db?ssl=true&sslmode=require
    hikari:
      connection-init-sql: SET SESSION CHARACTERISTICS AS TRANSACTION READ WRITE
```

**Secrets Management (HashiCorp Vault):**
```java
@Configuration
@EnableConfigurationProperties(VaultProperties.class)
public class VaultConfig {

    @Bean
    public VaultTemplate vaultTemplate() {
        VaultEndpoint endpoint = VaultEndpoint.create("vault.servicehub.com", 8200);
        VaultToken token = VaultToken.of(System.getenv("VAULT_TOKEN"));
        return new VaultTemplate(endpoint, new TokenAuthentication(token));
    }
}
```

#### 5. OWASP Top 10 Protection

**Input Validation:**
```java
@PostMapping("/services")
public ResponseEntity<ServiceDTO> createService(
    @Valid @RequestBody CreateServiceRequest request) {
    // Validation handled by @Valid and Bean Validation
    return serviceService.createService(request);
}

public class CreateServiceRequest {
    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 100, message = "Title must be between 5 and 100 characters")
    @Pattern(regexp = "^[a-zA-Z0-9\\s]+$", message = "Title contains invalid characters")
    private String title;

    @NotBlank
    @Size(max = 5000)
    private String description;

    @Min(0)
    @Max(1000000)
    private BigDecimal budgetMin;
}
```

**SQL Injection Prevention (JPA):**
```java
@Repository
public interface ServiceRepository extends JpaRepository<Service, UUID> {

    // Safe: uses parameterized query
    @Query("SELECT s FROM Service s WHERE s.category.id = :categoryId AND s.status = :status")
    List<Service> findByCategoryAndStatus(
        @Param("categoryId") UUID categoryId,
        @Param("status") ServiceStatus status
    );
}
```

#### 6. Security Headers

```java
@Configuration
public class SecurityHeadersConfig {

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return web -> web.ignoring().requestMatchers("/static/**");
    }

    @Bean
    public SecurityFilterChain configure(HttpSecurity http) throws Exception {
        return http
            .headers(headers -> headers
                .contentSecurityPolicy(csp -> csp
                    .policyDirectives("default-src 'self'; script-src 'self' 'unsafe-inline';"))
                .frameOptions().deny()
                .xssProtection().block(true)
                .contentTypeOptions().and()
                .referrerPolicy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
            .build();
    }
}
```

---

## 📊 Observabilidade

### Logging (ELK Stack)

**Logback Configuration:**
```xml
<configuration>
    <appender name="JSON" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="net.logstash.logback.encoder.LogstashEncoder">
            <customFields>{"service":"${SERVICE_NAME}"}</customFields>
        </encoder>
    </appender>

    <root level="INFO">
        <appender-ref ref="JSON"/>
    </root>
</configuration>
```

**Structured Logging:**
```java
@Slf4j
@Service
public class ServiceService {

    public ServiceDTO createService(CreateServiceRequest request) {
        log.info("Creating service",
            kv("userId", SecurityContextHolder.getContext().getAuthentication().getName()),
            kv("category", request.getCategoryId()),
            kv("budget", request.getBudgetMin()));

        try {
            Service service = serviceRepository.save(toEntity(request));
            log.info("Service created successfully", kv("serviceId", service.getId()));
            return toDTO(service);
        } catch (Exception e) {
            log.error("Failed to create service", e,
                kv("userId", request.getUserId()),
                kv("error", e.getMessage()));
            throw e;
        }
    }
}
```

### Metrics (Prometheus + Grafana)

**Spring Boot Actuator:**
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
  metrics:
    tags:
      application: ${spring.application.name}
      environment: ${ENVIRONMENT:dev}
    export:
      prometheus:
        enabled: true
```

**Custom Metrics:**
```java
@Service
public class PaymentService {

    private final Counter paymentCounter;
    private final Timer paymentTimer;

    public PaymentService(MeterRegistry registry) {
        this.paymentCounter = Counter.builder("payments.processed")
            .description("Total payments processed")
            .tags("status", "success")
            .register(registry);

        this.paymentTimer = Timer.builder("payments.processing.time")
            .description("Payment processing time")
            .register(registry);
    }

    public PaymentResponse processPayment(PaymentRequest request) {
        return paymentTimer.record(() -> {
            PaymentResponse response = gateway.process(request);
            if (response.isSuccess()) {
                paymentCounter.increment();
            }
            return response;
        });
    }
}
```

**Grafana Dashboard JSON** (example queries):
```promql
# Request rate
rate(http_server_requests_seconds_count[5m])

# Error rate
rate(http_server_requests_seconds_count{status=~"5.."}[5m])

# p95 latency
histogram_quantile(0.95, sum(rate(http_server_requests_seconds_bucket[5m])) by (le, uri))

# Payment success rate
rate(payments_processed_total{status="success"}[5m]) / rate(payments_processed_total[5m])
```

### Distributed Tracing (Jaeger)

**Spring Cloud Sleuth + Zipkin:**
```yaml
spring:
  sleuth:
    sampler:
      probability: 1.0
  zipkin:
    base-url: http://zipkin:9411
    sender:
      type: web
```

**Custom Spans:**
```java
@Service
public class ServiceMatchingService {

    @Autowired
    private Tracer tracer;

    public List<Provider> findMatchingProviders(Service service) {
        Span span = tracer.nextSpan().name("findMatchingProviders");

        try (Tracer.SpanInScope ws = tracer.withSpan(span.start())) {
            span.tag("serviceId", service.getId().toString());
            span.tag("category", service.getCategory().getName());

            List<Provider> providers = providerRepository.findByLocation(
                service.getLatitude(),
                service.getLongitude(),
                DEFAULT_RADIUS
            );

            span.tag("matchCount", String.valueOf(providers.size()));
            return providers;
        } finally {
            span.end();
        }
    }
}
```

### Alerting (Prometheus Alertmanager)

```yaml
groups:
- name: servicehub-alerts
  interval: 30s
  rules:

  # High error rate
  - alert: HighErrorRate
    expr: |
      rate(http_server_requests_seconds_count{status=~"5.."}[5m])
      /
      rate(http_server_requests_seconds_count[5m])
      > 0.05
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High error rate on {{ $labels.service }}"
      description: "Error rate is {{ $value | humanizePercentage }} for service {{ $labels.service }}"

  # High response time
  - alert: HighResponseTime
    expr: |
      histogram_quantile(0.95,
        sum(rate(http_server_requests_seconds_bucket[5m])) by (le, service)
      ) > 1
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "High response time on {{ $labels.service }}"
      description: "P95 latency is {{ $value }}s for service {{ $labels.service }}"

  # Service down
  - alert: ServiceDown
    expr: up{job=~"servicehub-.*"} == 0
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "Service {{ $labels.job }} is down"
      description: "Service {{ $labels.job }} has been down for more than 2 minutes"

  # Database connection pool exhausted
  - alert: DatabaseConnectionPoolExhausted
    expr: |
      hikaricp_connections_active / hikaricp_connections_max > 0.9
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Database connection pool nearly exhausted on {{ $labels.service }}"
      description: "{{ $labels.service }} is using {{ $value | humanizePercentage }} of database connections"
```

---

## 🔄 Estratégia de Migração

### Strangler Fig Pattern

Migração incremental sem downtime, onde o novo sistema gradualmente "estrangula" o sistema legado.

**Fase 1: Setup Inicial (Semanas 1-2)**
- [ ] Setup de repositórios
- [ ] Configuração de CI/CD base
- [ ] Infraestrutura core (API Gateway, Service Discovery)
- [ ] Databases isolados

**Fase 2: Novos Features em Microsserviços (Semanas 3-4)**
- [ ] Implementar novos features diretamente em microsserviços
- [ ] Chat Service (nova funcionalidade)
- [ ] Advanced search (Location Service)

**Fase 3: Migração de Módulos Independentes (Semanas 5-8)**
- [ ] Notification Service (baixo acoplamento)
- [ ] Review Service (isolado)
- [ ] Payment Service (critical mas isolável)

**Fase 4: Migração do Core (Semanas 9-14)**
- [ ] Auth Service
- [ ] User Service
- [ ] Service Management Service
- [ ] Provider Service

**Fase 5: Cutover (Semanas 15-16)**
- [ ] Migração completa de tráfego
- [ ] Deprecação de endpoints antigos
- [ ] Remoção do código legado

### Routing Strategy

**API Gateway roteamento híbrido:**
```java
@Bean
public RouteLocator hybridRouting(RouteLocatorBuilder builder) {
    return builder.routes()
        // New: Route to microservice
        .route("notifications-new", r -> r
            .path("/api/v1/notifications/**")
            .uri("lb://notification-service"))

        // Legacy: Route to Next.js BFF
        .route("services-legacy", r -> r
            .path("/api/v1/services/**")
            .uri("http://nextjs-bff:3000"))

        // Feature flag based routing
        .route("services-canary", r -> r
            .path("/api/v1/services/**")
            .and()
            .header("X-Feature-Flag", "new-service-api")
            .uri("lb://service-service"))

        .build();
}
```

### Data Migration

**Dual-write strategy:**
```java
@Service
public class HybridServiceService {

    @Autowired
    private LegacyServiceClient legacyClient;

    @Autowired
    private ServiceRepository newRepository;

    @Transactional
    public ServiceDTO createService(CreateServiceRequest request) {
        // Write to new system
        Service service = newRepository.save(toEntity(request));

        try {
            // Also write to legacy system (eventually remove)
            legacyClient.createService(request);
        } catch (Exception e) {
            log.warn("Failed to sync with legacy system", e);
            // Don't fail the request
        }

        return toDTO(service);
    }
}
```

**Background data sync job:**
```java
@Scheduled(cron = "0 0 2 * * *") // Daily at 2 AM
public void syncLegacyData() {
    List<LegacyService> legacyServices = legacyClient.getAllServices();

    legacyServices.forEach(legacy -> {
        if (!newRepository.existsByLegacyId(legacy.getId())) {
            Service service = convertLegacyToNew(legacy);
            newRepository.save(service);
        }
    });
}
```

---

## 📅 Cronograma

### Timeline Detalhado (16 semanas)

| Semana | Fase | Tarefas Principais | Entregáveis |
|--------|------|-------------------|-------------|
| 1-2 | Setup & Planejamento | - Setup repositórios<br>- Documentação arquitetural<br>- CI/CD base<br>- Infraestrutura dev | - Repos criados<br>- Docs aprovados<br>- Pipeline básico<br>- Docker compose |
| 3-4 | Auth + User Services | - Auth Service MVP<br>- User Service MVP<br>- API Gateway<br>- Service Discovery | - JWT auth working<br>- User CRUD<br>- Gateway routing<br>- Consul/Eureka |
| 5-6 | Core Business Services | - Service Management Service<br>- Provider Service<br>- Location Service | - Service CRUD<br>- Provider matching<br>- Geo search |
| 7-8 | Payment + Review | - Payment Service<br>- Review Service<br>- Saga implementation | - Payment gateway<br>- Escrow system<br>- Reviews working |
| 9-10 | Notification + Chat | - Notification Service<br>- Chat Service<br>- WebSocket setup | - Multi-channel notif<br>- Real-time chat |
| 11-12 | Infrastructure | - K8s manifests<br>- Terraform scripts<br>- Monitoring stack | - Production infra<br>- Observability |
| 13-14 | Testing & Security | - Integration tests<br>- E2E tests<br>- Security hardening<br>- Load testing | - >80% coverage<br>- Pen test report<br>- Performance baseline |
| 15-16 | Migration & Launch | - Traffic migration<br>- Legacy cutover<br>- Documentation<br>- Training | - 100% traffic migrated<br>- Legacy deprecated<br>- Runbooks |

### Milestones

- **M1 (Week 2):** Foundation Complete - Infrastructure e CI/CD prontos
- **M2 (Week 6):** Core Services Deployed - Auth, User, Service, Provider em staging
- **M3 (Week 10):** Feature Complete - Todos microsserviços implementados
- **M4 (Week 14):** Production Ready - Infra, testes e segurança validados
- **M5 (Week 16):** Go Live - Migração completa, sistema em produção

---

## 📈 Métricas de Sucesso

### Technical Metrics

| Categoria | Métrica | Target | Medição |
|-----------|---------|--------|---------|
| **Availability** | Uptime | 99.9% | Prometheus |
| **Performance** | p50 Response Time | < 100ms | APM |
| **Performance** | p95 Response Time | < 300ms | APM |
| **Performance** | p99 Response Time | < 1s | APM |
| **Scalability** | Concurrent Users | 10,000+ | Load tests |
| **Scalability** | Requests/sec | 1,000+ | Load tests |
| **Reliability** | Error Rate | < 0.1% | Logs/Metrics |
| **Reliability** | MTTR | < 15 min | Incident logs |
| **Security** | Critical Vulns | 0 | Security scans |
| **Security** | High Vulns | < 5 | Security scans |
| **Code Quality** | Test Coverage | > 80% | JaCoCo |
| **Code Quality** | Code Smells | A rating | SonarQube |
| **Code Quality** | Technical Debt | < 5% | SonarQube |

### Business Metrics

| Métrica | Target | Impacto |
|---------|--------|---------|
| Time to Market (new features) | -50% | Faster innovation |
| Deployment Frequency | Daily | Agility |
| Change Failure Rate | < 5% | Quality |
| Infrastructure Costs | Optimize | ROI |
| Developer Productivity | +30% | Efficiency |

### SLIs/SLOs/SLAs

**Service Level Indicators (SLIs):**
- Request success rate
- Request latency
- System throughput

**Service Level Objectives (SLOs):**
- 99.9% of requests succeed (non-5xx)
- 95% of requests complete in < 300ms
- Service handles 1000 req/s

**Service Level Agreements (SLAs):**
- 99.9% monthly uptime
- < 1 hour downtime per month
- Support response in < 4 hours

---

## 📚 Referências e Recursos

### Documentação
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Cloud Documentation](https://spring.io/projects/spring-cloud)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Microservices Patterns - Chris Richardson](https://microservices.io/patterns/)

### Ferramentas
- **API Documentation:** Swagger UI, Postman
- **Architecture Diagrams:** C4 Model, PlantUML
- **Project Management:** GitHub Projects, Jira

### Treinamento
- Spring Boot Microservices (Udemy/Pluralsight)
- Kubernetes Fundamentals (CNCF)
- Domain-Driven Design (Eric Evans)

---

## 🎯 Próximos Passos

1. ✅ **Revisar e aprovar** esta documentação
2. ✅ **Priorizar** microsserviços para POC
3. ✅ **Setup** de repositório e estrutura inicial
4. ✅ **Implementar** Auth Service (primeiro microsserviço)
5. ✅ **Validar** arquitetura com stakeholders
6. ✅ **Iniciar** desenvolvimento iterativo

---

<<<<<<< Updated upstream
**Documento mantido por:** Equipe de Arquitetura ServiceHub
=======
**Documento mantido por:** Equipe de Arquitetura Workemia
>>>>>>> Stashed changes
**Última atualização:** 2025-10-04
**Próxima revisão:** 2025-10-18
