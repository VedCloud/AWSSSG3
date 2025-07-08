import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const awsServices = pgTable("aws_services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  fullName: text("full_name").notNull(),
  category: text("category").notNull(),
  color: text("color").notNull(),
  icon: text("icon").notNull(),
  link: text("link").notNull(),
  certificationTracks: text("certification_tracks").array().default([]),
  status: text("status").default("operational"), // operational, degraded, outage
  lastStatusCheck: timestamp("last_status_check").defaultNow(),
});

export const insertAwsServiceSchema = createInsertSchema(awsServices).omit({
  id: true,
  lastStatusCheck: true,
}).partial({
  certificationTracks: true,
  status: true,
});

export type InsertAwsService = z.infer<typeof insertAwsServiceSchema>;
export type AwsService = typeof awsServices.$inferSelect;

// Category enum for validation
export const CategoryEnum = z.enum([
  "Analytics",
  "Compute", 
  "Database",
  "Machine Learning",
  "Storage",
  "Security",
  "Networking",
  "Developer Tools",
  "Microservices"
]);

export type Category = z.infer<typeof CategoryEnum>;

export const CertificationTrackEnum = z.enum([
  "AWS Certified Cloud Practitioner",
  "AWS Certified AI Practitioner",
  "AWS Certified Solutions Architect – Associate",
  "AWS Certified Developer – Associate",
  "AWS Certified SysOps Administrator – Associate",
  "AWS Certified Data Engineer – Associate",
  "AWS Certified Machine Learning Engineer – Associate",
  "AWS Certified Solutions Architect – Professional",
  "AWS Certified DevOps Engineer – Professional",
  "AWS Certified Advanced Networking – Specialty",
  "AWS Certified Data Analytics – Specialty",
  "AWS Certified Security – Specialty",
  "AWS Certified Database – Specialty",
  "AWS Certified SAP on AWS – Specialty",
  "AWS Certified Machine Learning – Specialty"
]);

export type CertificationTrack = z.infer<typeof CertificationTrackEnum>;

// Service status enum
export const ServiceStatusEnum = z.enum([
  "operational",
  "degraded", 
  "outage"
]);

export type ServiceStatus = z.infer<typeof ServiceStatusEnum>;
