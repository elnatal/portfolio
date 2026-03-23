import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Personal Info
  await prisma.personalInfo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Elnatal Debebe",
      title: "Lead Software Engineer / Full-Stack Developer",
      bio: "Software Engineer & Full-Stack Developer with 6+ years of experience building scalable systems, marketplaces, and healthcare platforms. Passionate about clean architecture, microservices, and delivering impactful software.",
      email: "elnataldebebe@gmail.com",
      phone: "+251 911148312",
      website: "https://elnatal.com",
      location: "Addis Ababa, Ethiopia",
      github: "https://github.com/elnatal",
      linkedin: "https://linkedin.com/in/elnatal",
    },
  });

  // Experience
  const experiences = [
    {
      id: 1,
      company: "Kifiya",
      role: "Lead Software Engineer",
      type: "Full-time",
      startDate: "Sep 2025",
      endDate: null,
      isCurrent: true,
      location: "Addis Ababa, Ethiopia",
      description:
        "Lead cross-functional engineering teams building Ethiopia's next-generation fintech infrastructure. Own end-to-end technical strategy—from system architecture to delivery—while setting engineering standards, conducting code reviews, and aligning engineering execution with business goals.",
      order: 0,
    },
    {
      id: 2,
      company: "Kifiya",
      role: "Freelance Remote Senior Full-Stack Developer",
      type: "Freelance",
      startDate: "Jun 2024",
      endDate: "Sep 2025",
      isCurrent: false,
      location: "Remote",
      description:
        "Architected and integrated core backend systems ahead of joining full-time, including database schema design, third-party API integrations, and performance optimization across high-traffic financial data pipelines.",
      order: 1,
    },
    {
      id: 3,
      company: "CropConex",
      role: "Full Stack Engineer",
      type: "Full-time",
      startDate: "Apr 2022",
      endDate: "Jun 2024",
      isCurrent: false,
      location: "California, USA",
      description:
        "Engineered a global agri-commodity marketplace from the ground up across the full stack: designed AWS infrastructure, built GraphQL APIs, implemented multi-currency payment flows (Stripe, Trustshare, Chapa), and delivered a Nuxt/Vue front end. Led sprint reviews and drove the marketplace, order management, and inventory systems. Integrated Muvi for AI-powered product recommendations.",
      order: 2,
    },
    {
      id: 4,
      company: "eHealth IT Services PLC",
      role: "Senior Software Engineer",
      type: "Full-time",
      startDate: "Apr 2021",
      endDate: "Apr 2022",
      isCurrent: false,
      location: "Addis Ababa, Ethiopia",
      description:
        "Spearheaded a full architectural rewrite of a monolithic EMR system into a microservices platform spanning patient management, pharmacy, laboratory, imaging, and finance modules. Designed inter-service communication patterns using GraphQL and REST, authored database migration scripts, and mentored junior developers through the transition.",
      order: 3,
    },
    {
      id: 5,
      company: "G2G IT Solutions",
      role: "Software Engineer",
      type: "Contract",
      startDate: "Feb 2021",
      endDate: "Apr 2021",
      isCurrent: false,
      location: "Addis Ababa, Ethiopia",
      description:
        "Delivered contract-based full-stack features across client projects, working independently to scope, design, build, and ship within tight timelines.",
      order: 4,
    },
    {
      id: 6,
      company: "Zowi Tech",
      role: "Software Engineer",
      type: "Full-time",
      startDate: "Sep 2020",
      endDate: "Feb 2021",
      isCurrent: false,
      location: "Addis Ababa, Ethiopia",
      description:
        "Built and shipped product features across the full stack—REST APIs, database design, and front-end interfaces—in a fast-paced startup environment. Contributed to system design decisions and improved code quality through refactoring and testing.",
      order: 5,
    },
    {
      id: 7,
      company: "Med Innovations",
      role: "Back End Engineer",
      type: "Full-time",
      startDate: "Dec 2019",
      endDate: "Jan 2021",
      isCurrent: false,
      location: "Macerata, Italy",
      description:
        "Designed and developed backend services for medical software products used in clinical environments, with a focus on reliability, data integrity, and secure handling of sensitive patient data.",
      order: 6,
    },
    {
      id: 8,
      company: "EthERNet",
      role: "Software Engineer — Internship",
      type: "Internship",
      startDate: "Apr 2018",
      endDate: "Oct 2019",
      isCurrent: false,
      location: "Addis Ababa, Ethiopia",
      description:
        "Contributed to the development of educational software, building features end-to-end and gaining hands-on experience in collaborative software delivery, version control, and agile workflows.",
      order: 7,
    },
  ];

  for (const exp of experiences) {
    const { id, ...data } = exp;
    await prisma.experience.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    });
  }

  // Projects
  const projects = [
    {
      id: 1,
      name: "CropConex",
      summary: "A global B2B marketplace digitizing the coffee and agri-commodity supply chain — connecting farmers, exporters, and international buyers with end-to-end contract management, harvest tracking, and multi-currency payments.",
      description: `<h2>Overview</h2>
<p>CropConex is a B2B commodity marketplace digitizing the global coffee and agricultural supply chain. It connects farmers, cooperatives, exporters, and international buyers on a single platform — replacing fragmented, paper-heavy processes with a seamless digital workflow from harvest to delivery.</p>
<h2>Key Features</h2>
<ul>
  <li><strong>Marketplace &amp; Contracts:</strong> Buyers and sellers negotiate, finalize, and track commodity contracts digitally with version history and structured approval workflows.</li>
  <li><strong>Harvest Tracking:</strong> Lot-level traceability from farm to export, including quality assessment scores and grading records at every step of the supply chain.</li>
  <li><strong>Inventory Management:</strong> Real-time stock levels across warehouse locations, with movement history and low-stock alerts.</li>
  <li><strong>International Payments:</strong> Multi-currency payment processing via Stripe (global cards), Trustshare (escrow for commodity contracts), and Chapa (local Ethiopian payments).</li>
  <li><strong>AI-Powered Recommendations:</strong> Muvi integration matches buyers to the most relevant listings based on purchasing history and preferences.</li>
  <li><strong>Logistics Coordination:</strong> Shipment tracking, export document generation (phytosanitary certificates, customs declarations), and delivery confirmation workflows.</li>
</ul>
<h2>Architecture</h2>
<p>Built on a microservice architecture with Go services handling performance-critical operations (inventory, payment processing) and Express.js for business logic services. A GraphQL API gateway unifies all services into a single endpoint. The Nuxt.js front end uses server-side rendering for SEO and fast initial load. Infrastructure runs on AWS with auto-scaling EC2 groups, RDS PostgreSQL, and S3 for document and image storage — all containerized with Docker and proxied through Nginx.</p>`,
      tags: JSON.stringify(["Express.js", "Go", "Nuxt.js", "Vue.js", "PostgreSQL", "GraphQL", "AWS", "Stripe", "Docker"]),
      liveUrl: "https://cropconex.com",
      featured: true,
      order: 0,
    },
    {
      id: 2,
      name: "OrbitHealth EMR",
      summary: "A full rewrite of a hospital EMR system from a single monolith into six independent clinical microservices — enabling team autonomy, faster feature delivery, and zero-downtime deployments per domain.",
      description: `<h2>Overview</h2>
<p>OrbitHealth EMR is a complete architectural rewrite of a hospital's Electronic Medical Record system. The existing monolith was decomposed into six domain-driven microservices, enabling independent deployment, team autonomy, and significantly faster feature delivery across clinical departments.</p>
<h2>Modules</h2>
<ul>
  <li><strong>Auth Service:</strong> JWT-based authentication with role management across doctor, nurse, pharmacist, lab technician, radiologist, and admin roles.</li>
  <li><strong>Patient Service:</strong> Patient registration, medical history, appointment scheduling, consultation records, and referral management.</li>
  <li><strong>Laboratory Service:</strong> Test order management, result entry with reference ranges, abnormal result flagging, and physician notification.</li>
  <li><strong>Imaging Service:</strong> Radiology request routing, DICOM image storage references, and structured radiologist report delivery to ordering physicians.</li>
  <li><strong>Pharmacy Service:</strong> Prescription processing, drug inventory tracking with reorder alerts, and dispensing workflow with patient verification.</li>
  <li><strong>Finance Service:</strong> Patient billing, insurance claim submission, payment collection, and department-level revenue reporting.</li>
</ul>
<h2>Architecture</h2>
<p>All services communicate through a Hasura GraphQL gateway using event-driven patterns for cross-service workflows — for example, a completed lab result automatically triggers a physician notification and updates the patient's consultation record. Each service owns its own PostgreSQL schema for true data isolation. The system is fully containerized with Docker and deployed behind Nginx, enabling zero-downtime rolling deployments per service. The Nuxt.js front end renders server-side for fast load performance across varying hospital network conditions.</p>`,
      tags: JSON.stringify(["Express.js", "Go", "Nuxt.js", "Vue.js", "Hasura", "GraphQL", "PostgreSQL", "Docker", "Nginx"]),
      liveUrl: "https://orbithealth.co",
      featured: true,
      order: 1,
    },
    {
      id: 3,
      name: "Enterprise CRM System",
      summary: "A multi-tenant CRM unifying Sales, Billing, and Customer Care on a microservice platform — with real-time GraphQL subscriptions, role-based access control, and complete data isolation between tenants.",
      description: `<h2>Overview</h2>
<p>A multi-tenant enterprise CRM built on a microservice architecture, enabling companies to manage their entire customer lifecycle — from lead generation through billing and ongoing support — within a unified, real-time platform. Designed to serve multiple companies simultaneously with complete data isolation.</p>
<h2>Key Features</h2>
<ul>
  <li><strong>Sales Pipeline:</strong> Visual kanban-style deal pipeline with stage management, activity logging, follow-up reminders, and win/loss tracking.</li>
  <li><strong>Billing &amp; Invoicing:</strong> Automated invoice generation, payment tracking, subscription lifecycle management, and overdue alerts.</li>
  <li><strong>Customer Care:</strong> Support ticket system with SLA tracking, escalation rules, and canned responses for common issues.</li>
  <li><strong>Multi-tenancy:</strong> Complete data and configuration isolation between companies on shared infrastructure, with per-tenant branding options.</li>
  <li><strong>Real-time Notifications:</strong> GraphQL subscriptions push updates — new tickets, deal stage changes, payment receipts — to agents without any polling overhead.</li>
  <li><strong>Role-based Access Control:</strong> Granular permissions across all CRM modules configurable per user role within each tenant.</li>
</ul>
<h2>Architecture</h2>
<p>Built with Loopback.js for structured, model-driven API scaffolding and Hasura for real-time GraphQL subscriptions. Services are orchestrated with Docker Compose and proxied through Nginx. PostgreSQL row-level security enforces tenant isolation at the database layer, ensuring zero cross-tenant data leakage. The Vue.js front end consumes GraphQL subscriptions for a live, collaborative experience.</p>`,
      tags: JSON.stringify(["Loopback.js", "Node.js", "Vue.js", "Hasura", "GraphQL", "PostgreSQL", "Docker", "Nginx"]),
      featured: false,
      order: 2,
    },
    {
      id: 4,
      name: "Bus Booking Platform",
      summary: "A full-stack bus ticketing system for passengers and operators — with interactive seat selection, a Flutter mobile app, real-time availability, and local payment integration.",
      description: `<h2>Overview</h2>
<p>A full-stack bus booking platform serving both passengers and transport operators. Passengers search routes, compare fares, select seats, and book tickets across web and mobile. Operators manage their fleets, routes, schedules, and revenue from a dedicated back-office dashboard.</p>
<h2>Key Features</h2>
<ul>
  <li><strong>Route Search:</strong> Origin/destination search with multi-stop route support, schedule browsing, and fare comparison across operators on the same route.</li>
  <li><strong>Seat Selection:</strong> Interactive seat map with real-time availability showing booked, available, and reserved seats before payment.</li>
  <li><strong>Mobile App:</strong> Flutter-based iOS and Android app with offline ticket storage, QR code boarding pass, and push notifications for trip reminders.</li>
  <li><strong>Payment Integration:</strong> Mobile money and card payments via local payment gateways, with instant booking confirmation and e-receipt generation.</li>
  <li><strong>Operator Dashboard:</strong> Fleet management, route and schedule configuration, booking reports, seat utilization analytics, and revenue breakdown by route.</li>
  <li><strong>Firebase Notifications:</strong> Real-time booking confirmations, departure reminders, and delay notifications via Firebase Cloud Messaging.</li>
</ul>
<h2>Technical Notes</h2>
<p>The backend is built with Laravel, providing a clean and well-structured REST API with robust validation and queuing for booking confirmations. The web front end uses Vue.js with Tailwind CSS for a responsive, mobile-first experience. The Flutter mobile app shares business logic across iOS and Android with a single codebase. MySQL stores all transactional booking data, while Firebase handles authentication and push notifications.</p>`,
      tags: JSON.stringify(["Laravel", "Vue.js", "Flutter", "Tailwind", "Firebase", "MySQL"]),
      featured: false,
      order: 3,
    },
    {
      id: 5,
      name: "Orbital — Hotel & GYM SaaS",
      summary: "A plugin-based SaaS platform for hospitality and fitness businesses — clients activate only the modules they need (room booking, POS, memberships, scheduling) with no custom development required.",
      description: `<h2>Overview</h2>
<p>Orbital is a plugin-based SaaS platform designed for hospitality and fitness businesses. Rather than a rigid one-size-fits-all system, clients purchase and activate only the modules they need — assembling a tailored management platform without any custom development or vendor lock-in.</p>
<h2>Available Plugins</h2>
<ul>
  <li><strong>Room Booking:</strong> Reservation management, room type configuration, availability calendar, and automated check-in/check-out workflows with housekeeping notifications.</li>
  <li><strong>Point of Sale (POS):</strong> Restaurant and bar order management, table assignment, split billing, and receipt generation with daily sales reporting.</li>
  <li><strong>GYM Membership:</strong> Member registration, flexible subscription plan management, attendance tracking via card scan, and automated renewal reminders.</li>
  <li><strong>Class Scheduling:</strong> Trainer schedule management, class capacity control, member class booking, and waitlist management.</li>
  <li><strong>Analytics &amp; Reporting:</strong> Cross-plugin revenue dashboards, occupancy rates, member retention metrics, and exportable monthly reports.</li>
</ul>
<h2>Architecture</h2>
<p>The platform is built with Loopback.js for a structured, model-driven API that makes adding new plugins straightforward through a consistent plugin interface. React.js powers the front end with a dynamic layout that shows or hides navigation based on which plugins a client has activated. MongoDB provides flexible schema support — critical for the plugin model where different clients have fundamentally different data shapes. Firebase handles real-time data synchronization for the scheduling and POS modules.</p>`,
      tags: JSON.stringify(["Loopback.js", "Node.js", "React.js", "MongoDB", "Firebase"]),
      featured: false,
      order: 4,
    },
    {
      id: 6,
      name: "Ride Hailing App",
      summary: "A real-time ride-hailing platform with live GPS tracking, sub-second driver matching via Socket.io, cashless payments, and separate Flutter apps for passengers and drivers.",
      description: `<h2>Overview</h2>
<p>A full-stack ride-hailing application connecting urban passengers with nearby drivers in real time. Built to handle the complete ride lifecycle — from driver discovery and live tracking to cashless payment and post-trip rating — across both passenger and driver mobile apps.</p>
<h2>Key Features</h2>
<ul>
  <li><strong>Real-time Driver Matching:</strong> Geolocation-based algorithm matches passengers with the nearest available driver, factoring in driver heading and estimated arrival time.</li>
  <li><strong>Live GPS Tracking:</strong> Continuous driver location updates via Google Maps SDK displayed in both passenger and driver apps throughout the trip.</li>
  <li><strong>Socket.io Event Layer:</strong> Instant push of ride requests, driver acceptance, trip start/end events, and cancellations — no polling, sub-second latency.</li>
  <li><strong>Dynamic Fare Estimation:</strong> Pricing calculated from distance, estimated duration, time of day, and demand surge multiplier shown before booking.</li>
  <li><strong>Cashless Payments:</strong> In-app payment processing with automatic fare deduction at trip end, digital receipt, and earnings transfer to driver wallet.</li>
  <li><strong>Driver App:</strong> Separate Flutter app for drivers with trip request queue, in-app navigation integration, online/offline toggle, and earnings dashboard.</li>
  <li><strong>Admin Dashboard:</strong> Fleet monitoring on a live map, trip history, driver verification and onboarding, dispute management, and revenue analytics.</li>
</ul>
<h2>Architecture</h2>
<p>The backend is Express.js/Node.js handling REST APIs, with Socket.io managing the real-time event layer for driver-passenger communication. Firebase Realtime Database stores driver location updates at high frequency for fast geo-queries. Both the passenger and driver mobile apps are built in Flutter for a single codebase across iOS and Android. The admin dashboard is a Vue.js web application. All services are containerized and deployed behind Nginx.</p>`,
      tags: JSON.stringify(["Flutter", "Express.js", "Node.js", "Socket.io", "Vue.js", "Tailwind", "Firebase", "Google Maps"]),
      featured: false,
      order: 5,
    },
    {
      id: 7,
      name: "Amtu — Business Intelligence System",
      summary: "A BI dashboard platform that aggregates operational data into configurable charts, KPI scorecards, and scheduled reports — giving leadership teams real-time visibility into business performance.",
      description: `<h2>Overview</h2>
<p>Amtu is a business intelligence platform that aggregates operational data from across a company's systems and surfaces it as configurable dashboards and scheduled reports. Built to help leadership teams move from gut-feel decisions to data-driven ones, with visibility into performance metrics across all departments.</p>
<h2>Key Features</h2>
<ul>
  <li><strong>Dashboard Builder:</strong> Configurable chart widgets — bar, line, pie, and KPI scorecards — arranged into custom dashboard layouts per user role.</li>
  <li><strong>Multi-source Ingestion:</strong> Connects to multiple internal databases and normalizes heterogeneous data into a unified reporting schema.</li>
  <li><strong>Scheduled Reports:</strong> Automated report generation and email delivery on daily, weekly, or monthly schedules — no manual exports required.</li>
  <li><strong>Export:</strong> One-click export of any report or chart to PDF, Excel, and CSV formats for external sharing or archiving.</li>
  <li><strong>Role-based Views:</strong> Each department sees only the metrics relevant to their function — sales sees pipeline data, finance sees revenue, operations sees throughput.</li>
  <li><strong>Trend Analysis:</strong> Period-over-period comparison views with growth/decline indicators and moving averages for identifying trends.</li>
</ul>
<h2>Technical Notes</h2>
<p>Built with Laravel on the backend, leveraging its robust query builder and scheduled job system for report generation. Vue.js powers the interactive dashboard UI with dynamic chart rendering via Chart.js, enabling smooth real-time updates when filters change. MySQL stores the aggregated reporting data with optimized indexes for fast analytical queries. Bootstrap provides the responsive layout framework.</p>`,
      tags: JSON.stringify(["Laravel", "Vue.js", "MySQL", "Bootstrap"]),
      featured: false,
      order: 6,
    },
    {
      id: 8,
      name: "Deliverology",
      summary: "A compliance reporting platform built for the Ethiopian Ministry of Education — replacing a manual email-and-spreadsheet process with structured university submissions, automated validation, and centralized report generation.",
      description: `<h2>Overview</h2>
<p>Deliverology is a data collection and compliance reporting system built for the Ethiopian Ministry of Education. It replaces a fully manual, email-and-spreadsheet process — where university officials submitted reports by email and ministry staff manually merged them — with a structured online platform for submission, validation, and centralized reporting.</p>
<h2>Key Features</h2>
<ul>
  <li><strong>University Submission Portal:</strong> Structured digital forms for universities to submit academic, financial, enrollment, and infrastructure data on a defined reporting schedule.</li>
  <li><strong>Automated Validation:</strong> Validation rules flag incomplete, out-of-range, or inconsistent submissions before they reach the Ministry, reducing back-and-forth corrections.</li>
  <li><strong>Ministry Dashboard:</strong> Aggregated view of all university submissions with filtering, status tracking, approval workflows, and the ability to send feedback to specific institutions.</li>
  <li><strong>Report Generation:</strong> Automated compilation of ministry-wide compliance reports in standardized formats with drill-down capability per institution or metric.</li>
  <li><strong>Deadline Tracking:</strong> Submission deadline monitoring with automated email reminders to institutions approaching or past their reporting due dates.</li>
  <li><strong>Audit Trail:</strong> Full history of every submission, revision, ministry comment, and approval action per university for accountability and dispute resolution.</li>
</ul>
<h2>Impact</h2>
<p>Replaced a fully manual process that previously required weeks of email coordination, manual spreadsheet merging, and error-prone data reconciliation. The platform reduced ministry report compilation time from weeks to hours, improved submission completeness through automated validation, and provided a single auditable source of truth for university performance data across the country.</p>`,
      tags: JSON.stringify(["Loopback.js", "Angular.js", "Bootstrap", "MongoDB"]),
      featured: false,
      order: 7,
    },
  ];

  for (const project of projects) {
    const { id, ...data } = project;
    await prisma.project.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    });
  }

  // Skills
  const skills = [
    // Languages
    { id: 1, name: "JavaScript", category: "Languages", order: 0 },
    { id: 2, name: "TypeScript", category: "Languages", order: 1 },
    { id: 3, name: "Go / Golang", category: "Languages", order: 2 },
    { id: 4, name: "Python", category: "Languages", order: 3 },
    { id: 5, name: "PHP", category: "Languages", order: 4 },
    { id: 6, name: "Java", category: "Languages", order: 5 },
    // Frameworks
    { id: 7, name: "Node.js", category: "Frameworks", order: 0 },
    { id: 8, name: "Express.js", category: "Frameworks", order: 1 },
    { id: 9, name: "Nuxt.js", category: "Frameworks", order: 2 },
    { id: 10, name: "Vue.js", category: "Frameworks", order: 3 },
    { id: 11, name: "Laravel", category: "Frameworks", order: 4 },
    { id: 12, name: "Python FastAPI", category: "Frameworks", order: 5 },
    { id: 13, name: "Django", category: "Frameworks", order: 6 },
    { id: 14, name: "Loopback", category: "Frameworks", order: 7 },
    { id: 15, name: "Flutter", category: "Frameworks", order: 8 },
    { id: 16, name: "Tailwind CSS", category: "Frameworks", order: 9 },
    { id: 17, name: "Hasura", category: "Frameworks", order: 10 },
    // Databases
    { id: 18, name: "PostgreSQL", category: "Databases", order: 0 },
    { id: 19, name: "MySQL", category: "Databases", order: 1 },
    { id: 20, name: "MongoDB", category: "Databases", order: 2 },
    // DevOps
    { id: 21, name: "AWS", category: "DevOps", order: 0 },
    { id: 22, name: "Docker", category: "DevOps", order: 1 },
    { id: 23, name: "Kubernetes", category: "DevOps", order: 2 },
    { id: 24, name: "Nginx", category: "DevOps", order: 3 },
    { id: 25, name: "GraphQL", category: "DevOps", order: 4 },
    { id: 26, name: "CI/CD", category: "DevOps", order: 5 },
    { id: 27, name: "Git", category: "DevOps", order: 6 },
    { id: 28, name: "Microservices", category: "DevOps", order: 7 },
    { id: 29, name: "Swagger", category: "DevOps", order: 8 },
    { id: 30, name: "Unit Testing", category: "DevOps", order: 9 },
  ];

  for (const skill of skills) {
    const { id, ...data } = skill;
    await prisma.skill.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    });
  }

  // Education
  await prisma.education.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      institution: "Addis Ababa University",
      degree: "MSc",
      field: "Data and Web Engineering",
      startYear: "2021",
      endYear: null,
      isCurrent: true,
      order: 0,
    },
  });
  await prisma.education.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      institution: "Addis Ababa University",
      degree: "BSc",
      field: "Software Engineering",
      startYear: "2014",
      endYear: "2019",
      isCurrent: false,
      order: 1,
    },
  });

  console.log("✅ Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
