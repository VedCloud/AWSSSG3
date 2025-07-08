import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAwsServiceSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all AWS services
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // Get services by category
  app.get("/api/services/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const services = await storage.getServicesByCategory(category);
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services by category" });
    }
  });

  // Search services
  app.get("/api/services/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ message: "Search query is required" });
      }
      const services = await storage.searchServices(q);
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to search services" });
    }
  });

  // Get service status
  app.get("/api/services/:id/status", async (req, res) => {
    try {
      const serviceId = parseInt(req.params.id);
      if (isNaN(serviceId)) {
        return res.status(400).json({ message: "Invalid service ID" });
      }
      
      const status = await storage.getServiceStatus(serviceId);
      if (!status) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service status" });
    }
  });

  // Update service status (for health monitoring)
  app.put("/api/services/:id/status", async (req, res) => {
    try {
      const serviceId = parseInt(req.params.id);
      if (isNaN(serviceId)) {
        return res.status(400).json({ message: "Invalid service ID" });
      }
      
      const { status } = req.body;
      if (!status || !["operational", "degraded", "outage"].includes(status)) {
        return res.status(400).json({ message: "Invalid status. Must be operational, degraded, or outage" });
      }
      
      const updatedService = await storage.updateServiceStatus(serviceId, status);
      if (!updatedService) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.json(updatedService);
    } catch (error) {
      res.status(500).json({ message: "Failed to update service status" });
    }
  });

  // Simulate AWS Health Dashboard check (for demo purposes)
  app.post("/api/health-check", async (req, res) => {
    try {
      const services = await storage.getAllServices();
      const updates = [];
      
      // Simulate random status updates for demo
      for (const service of services) {
        const random = Math.random();
        let newStatus = "operational";
        
        // 90% operational, 8% degraded, 2% outage
        if (random < 0.02) {
          newStatus = "outage";
        } else if (random < 0.10) {
          newStatus = "degraded";
        }
        
        if (newStatus !== (service.status || "operational")) {
          const updated = await storage.updateServiceStatus(service.id, newStatus);
          if (updated) {
            updates.push(updated);
          }
        }
      }
      
      res.json({ 
        message: "Health check completed", 
        updatedServices: updates.length,
        updates 
      });
    } catch (error) {
      res.status(500).json({ message: "Health check failed" });
    }
  });

  // Create new service (for admin purposes)
  app.post("/api/services", async (req, res) => {
    try {
      const validatedData = insertAwsServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid service data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create service" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
