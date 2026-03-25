import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  // ── Personal Info ─────────────────────────────────────────────────────────
  await prisma.personalInfo.upsert({
    where: { id: 1 },
    update: {
      title: "Lead Software Engineer / Full-Stack Engineer",
      bio: "Software Engineer focused on designing and scaling distributed systems in high-stakes environments across fintech, healthcare, and SaaS. Experienced in building microservices architectures, optimizing performance bottlenecks, and delivering systems that handle large-scale, real-world workloads. Known for taking ownership of system design, improving reliability, and translating complex requirements into production-ready solutions.",
      github: "https://github.com/elnatal",
      linkedin: "https://www.linkedin.com/in/elnatal-debebe-98143b174",
      twitter: null
    },
    create: {
      name: "Elnatal Debebe",
      title: "Lead Software Engineer / Full-Stack Engineer",
      bio: "Software Engineer focused on designing and scaling distributed systems in high-stakes environments across fintech, healthcare, and SaaS. Experienced in building microservices architectures, optimizing performance bottlenecks, and delivering systems that handle large-scale, real-world workloads. Known for taking ownership of system design, improving reliability, and translating complex requirements into production-ready solutions.",
      email: "elnataldebebe@gmail.com",
      phone: "+251 911148312",
      website: "https://elnatal.com",
      location: "Addis Ababa, Ethiopia",
      github: "https://github.com/elnatal",
      linkedin: "https://www.linkedin.com/in/elnatal-debebe-98143b174",
      twitter: null
    },
  });

  // ── Experience ────────────────────────────────────────────────────────────
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
      description: "<ul><li>Lead architecture and scaling of a loan collection platform handling ~382K loans and ~500K daily transactions</li><li>Improved system performance by ~80% by identifying and resolving critical bottlenecks in transaction and data processing flows</li><li>Designed and implemented asynchronous processing pipelines using Asynq to handle high-volume background workloads such as data ingestion and synchronization</li><li>Architected a pluggable datasource system enabling seamless integration with PostgreSQL, MongoDB, and REST-based loan providers, eliminating tight coupling</li><li>Automated loan assignment workflows, reducing manual operations and improving system efficiency</li><li>Re-architected reporting systems to provide real-time KPI tracking and reliable operational insights</li><li>Define system architecture direction and enforce engineering standards, improving reliability and maintainability across the platform</li></ul>",
      order: 0,
      visible: true,
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
      description: "Architected and integrated core backend systems ahead of joining full-time, including database schema design, third-party API integrations, and performance optimization across high-traffic financial data pipelines.",
      order: 1,
      visible: false,
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
      description: "<ul><li>Built a B2B commodity marketplace digitizing the global coffee supply chain from the ground up</li><li>Designed and deployed scalable AWS infrastructure supporting marketplace, inventory, and order management systems</li><li>Developed GraphQL APIs handling complex trading, order lifecycle, and transaction workflows</li><li>Integrated multi-currency payment systems (Stripe, Trustshare, Chapa) enabling cross-border financial operations</li><li>Built a Nuxt.js frontend delivering a responsive and performant user experience</li><li>Implemented core systems including inventory tracking, marketplace operations, and order management</li><li>Integrated AI-driven recommendations to improve product discovery and engagement</li><li>Collaborated across product and engineering teams to align system design with business goals</li></ul>",
      order: 2,
      visible: true,
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
      description: "<ul><li>Led migration of a monolithic EMR into a microservices architecture across patient, lab, imaging, pharmacy, and finance domains</li><li>Designed inter-service communication using GraphQL and REST, enabling scalable and modular system interactions</li><li>Planned and executed database migration strategies ensuring zero downtime during system transition</li><li>Decomposed tightly coupled systems into domain-driven services, improving scalability and maintainability</li><li>Mentored engineers and enforced clean architecture principles and engineering best practices across the team</li></ul>",
      order: 3,
      visible: true,
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
      description: "Delivered contract-based full-stack features across client projects, working independently to scope, design, build, and ship within tight timelines.",
      order: 4,
      visible: false,
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
      description: "<ul><li>Delivered full-stack features across backend APIs and frontend interfaces in a fast-paced environment</li><li>Contributed to system design and architectural decisions for scalable product development</li><li>Improved code quality through refactoring, testing, and adherence to engineering standards</li><li>Collaborated with cross-functional teams to deliver features under tight deadlines</li></ul>",
      order: 5,
      visible: true,
    },
    {
      id: 7,
      company: "Med Innovations",
      role: "Backend Engineer",
      type: "Full-time",
      startDate: "Dec 2019",
      endDate: "Jan 2021",
      isCurrent: false,
      location: "Macerata, Italy",
      description: "<ul><li>Built backend services for a subscription-based restaurant and gym management system</li><li>Designed REST APIs and database schemas supporting core operational workflows</li><li>Developed modular and configurable systems to support multiple client environments</li><li>Ensured data integrity across subscriptions, scheduling, and operational processes</li><li>Contributed to debugging, optimization, and system stability in production</li></ul>",
      order: 6,
      visible: true,
    },
    {
      id: 8,
      company: "EthERNet",
      role: "Software Engineer (Intern)",
      type: "Internship",
      startDate: "Apr 2018",
      endDate: "Oct 2019",
      isCurrent: false,
      location: "Addis Ababa, Ethiopia",
      description: "<ul><li>Supported development and maintenance of internal web systems and APIs</li><li>Gained hands-on experience with backend development, version control, and team workflows</li><li>Assisted in debugging and resolving production issues</li></ul>",
      order: 7,
      visible: true,
    }
  ];

  for (const exp of experiences) {
    const { id, ...data } = exp;
    await prisma.experience.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    });
  }

  // ── Projects ──────────────────────────────────────────────────────────────
  const projects = [
    {
      id: 9,
      name: "Loan Collection Platform",
      summary: "High-scale loan collection system processing ~500K daily transactions with asynchronous pipelines, real-time tracking, and pluggable integrations across multiple financial data sources.",
      description: "<h2>Overview</h2><p>A high-scale loan collection platform managing approximately 382,000 loans with around 500,000 daily transactions. Built for performance, reliability, and operational efficiency at fintech scale.</p><h2>Key Features</h2><ul><li>Pluggable datasource architecture supporting PostgreSQL, MongoDB, and REST API integrations with configurable field mapping</li><li>Asynchronous background processing pipelines using Asynq for high-volume data imports and synchronization</li><li>Automated loan assignment workflows reducing manual operational effort</li><li>Re-architected reporting systems enabling real-time KPI tracking and collection performance visibility</li><li>~80% performance improvement through bottleneck identification and transaction flow optimization</li></ul>",
      tags: "[\"Next.js\",\"Go\",\"PostgreSQL\",\"Asynq\",\"Docker\"]",
      images: "[]",
      liveUrl: null,
      githubUrl: null,
      featured: true,
      order: 0,
      visible: true,
    },
    {
      id: 1,
      name: "CropConex",
      summary: "B2B commodity marketplace enabling traceable coffee trade with contract workflows, payments, inventory management, and scalable microservices architecture.",
      description: "<h2>Overview</h2>\n<p>CropConex is a B2B commodity marketplace digitizing the global coffee and agricultural supply chain. It connects farmers, cooperatives, exporters, and international buyers on a single platform — replacing fragmented, paper-heavy processes with a seamless digital workflow from harvest to delivery.</p>\n<h2>Key Features</h2>\n<ul>\n  <li><strong>Marketplace &amp; Contracts:</strong> Buyers and sellers negotiate, finalize, and track commodity contracts digitally with version history and structured approval workflows.</li>\n  <li><strong>Harvest Tracking:</strong> Lot-level traceability from farm to export, including quality assessment scores and grading records at every step of the supply chain.</li>\n  <li><strong>Inventory Management:</strong> Real-time stock levels across warehouse locations, with movement history and low-stock alerts.</li>\n  <li><strong>International Payments:</strong> Multi-currency payment processing via Stripe (global cards), Trustshare (escrow for commodity contracts), and Chapa (local Ethiopian payments).</li>\n  <li><strong>AI-Powered Recommendations:</strong> Muvi integration matches buyers to the most relevant listings based on purchasing history and preferences.</li>\n</ul>\n<h2>Architecture</h2>\n<p>Built on a microservice architecture with Go services handling performance-critical operations and Express.js for business logic. A GraphQL API gateway unifies all services. Infrastructure runs on AWS with auto-scaling EC2, RDS PostgreSQL, and S3 — all containerized with Docker and proxied through Nginx.</p>",
      tags: "[\"Go\",\"Node.js\",\"Nuxt.js\",\"Vue\",\"GraphQL\",\"AWS\",\"Stripe\"]",
      images: "[]",
      liveUrl: null,
      githubUrl: null,
      featured: true,
      order: 1,
      visible: true,
    },
    {
      id: 2,
      name: "OrbitHealth EMR (Live)",
      summary: "Microservices-based EMR system replacing a monolith, enabling domain isolation, event-driven workflows, and scalable clinical operations.",
      description: "<h2>Overview</h2>\n<p>OrbitHealth EMR is a complete architectural rewrite of a hospital's Electronic Medical Record system. The existing monolith was decomposed into six domain-driven microservices, enabling independent deployment, team autonomy, and significantly faster feature delivery across clinical departments.</p>\n<h2>Modules</h2>\n<ul>\n  <li><strong>Auth Service:</strong> JWT-based authentication with role management across doctor, nurse, pharmacist, lab technician, radiologist, and admin roles.</li>\n  <li><strong>Patient Service:</strong> Patient registration, medical history, appointment scheduling, consultation records, and referral management.</li>\n  <li><strong>Laboratory Service:</strong> Test order management, result entry with reference ranges, abnormal result flagging, and physician notification.</li>\n  <li><strong>Imaging Service:</strong> Radiology request routing, DICOM image storage references, and structured radiologist report delivery.</li>\n  <li><strong>Pharmacy Service:</strong> Prescription processing, drug inventory tracking with reorder alerts, and dispensing workflow.</li>\n  <li><strong>Finance Service:</strong> Patient billing, insurance claim submission, payment collection, and department-level revenue reporting.</li>\n</ul>\n<h2>Architecture</h2>\n<p>All services communicate through a Hasura GraphQL gateway using event-driven patterns for cross-service workflows. Each service owns its own PostgreSQL schema for true data isolation. Fully containerized with Docker, deployed behind Nginx with zero-downtime rolling deployments per service.</p>",
      tags: "[\"Go\",\"Node.js\",\"Nuxt.js\",\"Hasura\",\"PostgreSQL\"]",
      images: "[]",
      liveUrl: null,
      githubUrl: null,
      featured: false,
      order: 2,
      visible: true,
    },
    {
      id: 3,
      name: "Enterprise CRM System",
      summary: "Multi-tenant CRM system with real-time updates, strict data isolation, and end-to-end customer lifecycle management.",
      description: "<h2>Overview</h2>\n<p>A multi-tenant enterprise CRM built on a microservice architecture, enabling companies to manage their entire customer lifecycle — from lead generation through billing and ongoing support — with complete data isolation between tenants.</p>\n<h2>Key Features</h2>\n<ul>\n  <li><strong>Sales Pipeline:</strong> Visual kanban-style deal pipeline with stage management, activity logging, follow-up reminders, and win/loss tracking.</li>\n  <li><strong>Billing &amp; Invoicing:</strong> Automated invoice generation, payment tracking, subscription lifecycle management, and overdue alerts.</li>\n  <li><strong>Customer Care:</strong> Support ticket system with SLA tracking, escalation rules, and canned responses.</li>\n  <li><strong>Multi-tenancy:</strong> Complete data and configuration isolation between companies on shared infrastructure.</li>\n  <li><strong>Real-time Notifications:</strong> GraphQL subscriptions push updates to agents without any polling overhead.</li>\n</ul>",
      tags: "[\"Node.js\",\"Vue\",\"GraphQL\",\"PostgreSQL\"]",
      images: "[]",
      liveUrl: null,
      githubUrl: null,
      featured: false,
      order: 3,
      visible: true,
    },
    {
      id: 5,
      name: "Orbital SaaS Platform",
      summary: "Modular SaaS platform for hospitality and fitness businesses with plugin-based architecture and real-time workflows.",
      description: "<h2>Overview</h2>\n<p>Orbital is a plugin-based SaaS platform designed for hospitality and fitness businesses. Clients activate only the modules they need — assembling a tailored management platform without any custom development or vendor lock-in.</p>\n<h2>Available Plugins</h2>\n<ul>\n  <li><strong>Room Booking:</strong> Reservation management, availability calendar, and automated check-in/check-out workflows with housekeeping notifications.</li>\n  <li><strong>Point of Sale (POS):</strong> Restaurant and bar order management, table assignment, split billing, and receipt generation.</li>\n  <li><strong>GYM Membership:</strong> Member registration, flexible subscription plan management, attendance tracking, and automated renewal reminders.</li>\n  <li><strong>Class Scheduling:</strong> Trainer schedule management, class capacity control, member booking, and waitlist management.</li>\n</ul>",
      tags: "[\"Node.js\",\"React\",\"MongoDB\",\"Firebase\"]",
      images: "[]",
      liveUrl: null,
      githubUrl: null,
      featured: false,
      order: 4,
      visible: true,
    },
    {
      id: 6,
      name: "Ride-Hailing Platform",
      summary: "Real-time ride-hailing system with live tracking, driver matching, and low-latency event processing.",
      description: "<h2>Overview</h2>\n<p>A full-stack ride-hailing application connecting urban passengers with nearby drivers in real time. Handles the complete ride lifecycle — from driver discovery and live tracking to cashless payment and post-trip rating.</p>\n<h2>Key Features</h2>\n<ul>\n  <li><strong>Real-time Driver Matching:</strong> Geolocation-based algorithm matches passengers with the nearest available driver, factoring in heading and estimated arrival time.</li>\n  <li><strong>Live GPS Tracking:</strong> Continuous driver location updates via Google Maps SDK in both passenger and driver apps throughout the trip.</li>\n  <li><strong>Socket.io Event Layer:</strong> Instant push of ride requests, driver acceptance, trip start/end events, and cancellations — sub-second latency, no polling.</li>\n  <li><strong>Dynamic Fare Estimation:</strong> Pricing calculated from distance, estimated duration, time of day, and demand surge multiplier shown before booking.</li>\n  <li><strong>Separate Driver App:</strong> Flutter app for drivers with trip request queue, in-app navigation, online/offline toggle, and earnings dashboard.</li>\n</ul>",
      tags: "[\"Node.js\",\"Flutter\",\"Socket.io\",\"Firebase\"]",
      images: "[]",
      liveUrl: null,
      githubUrl: null,
      featured: false,
      order: 5,
      visible: true,
    },
    {
      id: 8,
      name: "Deliverology (Gov Project)",
      summary: "National reporting system for the Ethiopian Ministry of Education, replacing manual reporting with automated, auditable workflows.",
      description: "<h2>Overview</h2>\n<p>Deliverology is a data collection and compliance reporting system built for the Ethiopian Ministry of Education. It replaces a fully manual, email-and-spreadsheet process with a structured online platform for submission, validation, and centralized reporting.</p>\n<h2>Key Features</h2>\n<ul>\n  <li><strong>University Submission Portal:</strong> Structured digital forms for universities to submit academic, financial, enrollment, and infrastructure data on a defined reporting schedule.</li>\n  <li><strong>Automated Validation:</strong> Rules flag incomplete, out-of-range, or inconsistent submissions before they reach the Ministry.</li>\n  <li><strong>Ministry Dashboard:</strong> Aggregated view of all university submissions with filtering, status tracking, and approval workflows.</li>\n  <li><strong>Report Generation:</strong> Automated compilation of ministry-wide compliance reports with drill-down capability per institution.</li>\n  <li><strong>Audit Trail:</strong> Full history of every submission, revision, ministry comment, and approval action for accountability.</li>\n</ul>",
      tags: "[\"LoopBack\",\"Angular\",\"MongoDB\"]",
      images: "[]",
      liveUrl: null,
      githubUrl: null,
      featured: false,
      order: 6,
      visible: true,
    },
    {
      id: 7,
      name: "Amtu BI System",
      summary: "Business intelligence platform enabling centralized data aggregation, dashboards, and automated reporting across systems.",
      description: "<h2>Overview</h2>\n<p>Amtu is a business intelligence platform that aggregates operational data from across a company's systems and surfaces it as configurable dashboards and scheduled reports — helping leadership teams move from gut-feel decisions to data-driven ones.</p>\n<h2>Key Features</h2>\n<ul>\n  <li><strong>Dashboard Builder:</strong> Configurable chart widgets — bar, line, pie, and KPI scorecards — arranged into custom dashboard layouts per user role.</li>\n  <li><strong>Multi-source Ingestion:</strong> Connects to multiple internal databases and normalizes heterogeneous data into a unified reporting schema.</li>\n  <li><strong>Scheduled Reports:</strong> Automated report generation and email delivery on daily, weekly, or monthly schedules — no manual exports required.</li>\n  <li><strong>Role-based Views:</strong> Each department sees only the metrics relevant to their function.</li>\n</ul>",
      tags: "[\"Laravel\",\"Vue\",\"MySQL\"]",
      images: "[]",
      liveUrl: null,
      githubUrl: null,
      featured: false,
      order: 7,
      visible: true,
    },
    {
      id: 4,
      name: "Bus Booking Platform",
      summary: "A full-stack bus ticketing system for passengers and operators — with interactive seat selection, a Flutter mobile app, real-time availability, and local payment integration.",
      description: null,
      tags: "[\"Laravel\",\"Vue.js\",\"Flutter\",\"Firebase\",\"MySQL\"]",
      images: "[]",
      liveUrl: null,
      githubUrl: null,
      featured: false,
      order: 8,
      visible: false,
    }
  ];

  for (const project of projects) {
    const { id, ...data } = project;
    await prisma.project.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    });
  }

  // ── Skills — clear and recreate ───────────────────────────────────────────
  await prisma.skill.deleteMany({});

  const skills = [
    { id: 23, name: "Microservices", category: "Architecture", order: 0, visible: true },
    { id: 24, name: "GraphQL", category: "Architecture", order: 1, visible: true },
    { id: 25, name: "REST", category: "Architecture", order: 2, visible: true },
    { id: 26, name: "Event-driven systems", category: "Architecture", order: 3, visible: true },
    { id: 6, name: "Node.js", category: "Backend", order: 0, visible: true },
    { id: 7, name: "Express", category: "Backend", order: 1, visible: true },
    { id: 8, name: "Go", category: "Backend", order: 2, visible: true },
    { id: 9, name: "FastAPI", category: "Backend", order: 3, visible: true },
    { id: 10, name: "Laravel", category: "Backend", order: 4, visible: true },
    { id: 11, name: "LoopBack", category: "Backend", order: 5, visible: true },
    { id: 16, name: "PostgreSQL", category: "Databases", order: 0, visible: true },
    { id: 17, name: "MongoDB", category: "Databases", order: 1, visible: true },
    { id: 18, name: "MySQL", category: "Databases", order: 2, visible: true },
    { id: 12, name: "Next.js", category: "Frontend", order: 0, visible: true },
    { id: 13, name: "Nuxt.js", category: "Frontend", order: 1, visible: true },
    { id: 14, name: "Vue.js", category: "Frontend", order: 2, visible: true },
    { id: 15, name: "React", category: "Frontend", order: 3, visible: true },
    { id: 19, name: "AWS", category: "Infrastructure", order: 0, visible: true },
    { id: 20, name: "Docker", category: "Infrastructure", order: 1, visible: true },
    { id: 21, name: "Nginx", category: "Infrastructure", order: 2, visible: true },
    { id: 22, name: "CI/CD", category: "Infrastructure", order: 3, visible: true },
    { id: 1, name: "Go", category: "Languages", order: 0, visible: true },
    { id: 2, name: "JavaScript", category: "Languages", order: 1, visible: true },
    { id: 3, name: "TypeScript", category: "Languages", order: 2, visible: true },
    { id: 4, name: "Python", category: "Languages", order: 3, visible: true },
    { id: 5, name: "PHP", category: "Languages", order: 4, visible: true }
  ];

  for (const skill of skills) {
    await prisma.skill.create({ data: skill });
  }

  // ── Education ─────────────────────────────────────────────────────────────
  await prisma.education.upsert({
    where: { id: 1 },
    update: {
      institution: "Addis Ababa University",
      degree: "MSc",
      field: "Data and Web Engineering",
      startYear: "2021",
      endYear: null,
      isCurrent: true,
      description: null,
      order: 0,
      visible: false
    },
    create: {
      id: 1,
      institution: "Addis Ababa University",
      degree: "MSc",
      field: "Data and Web Engineering",
      startYear: "2021",
      endYear: null,
      isCurrent: true,
      description: null,
      order: 0,
      visible: false
    },
  });
  await prisma.education.upsert({
    where: { id: 2 },
    update: {
      institution: "Addis Ababa University",
      degree: "BSc",
      field: "Software Engineering",
      startYear: "2014",
      endYear: "2019",
      isCurrent: false,
      description: null,
      order: 0,
      visible: true
    },
    create: {
      id: 2,
      institution: "Addis Ababa University",
      degree: "BSc",
      field: "Software Engineering",
      startYear: "2014",
      endYear: "2019",
      isCurrent: false,
      description: null,
      order: 0,
      visible: true
    },
  });

  // ── Languages ─────────────────────────────────────────────────────────────
  await prisma.language.deleteMany({});
  const languages = [
    {
      id: 1,
      name: "Amharic",
      isMother: true,
      listening: null,
      reading: null,
      writing: null,
      spokenProduction: null,
      spokenInteraction: null,
      order: 0,
      visible: true,
    },
    {
      id: 2,
      name: "English",
      isMother: false,
      listening: "C1",
      reading: "C1",
      writing: "C1",
      spokenProduction: "C1",
      spokenInteraction: "C1",
      order: 1,
      visible: true,
    }
  ];
  for (const lang of languages) {
    const { id, ...data } = lang;
    await prisma.language.create({ data: { id, ...data } });
  }

  // ── Certifications ────────────────────────────────────────────────────────
  await prisma.certification.deleteMany({});
  const certifications = [
    {
      id: 1,
      name: "GO Programming Language",
      issuer: "Great Learning",
      issueDate: "Jul 2024",
      expiryDate: null,
      credentialId: "KADPKKDB",
      credentialUrl: "https://www.mygreatlearning.com/certificate/KADPKKDB",
      imageUrl: "https://res.cloudinary.com/dymtif0de/image/upload/v1774250933/elnatal-portfolio/fltcbicc8w72y6pcsf6a.jpg",
      visible: true,
      order: 0,
    }
  ];
  for (const cert of certifications) {
    const { id, ...data } = cert;
    await prisma.certification.create({ data: { id, ...data } });
  }

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
