import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClubSchema, insertStudentSchema, insertMembershipSchema, insertActivitySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Clubs
  app.get("/api/clubs", async (_req, res) => {
    const clubs = await storage.getClubs();
    res.json(clubs);
  });

  app.post("/api/clubs", async (req, res) => {
    const result = insertClubSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const club = await storage.createClub(result.data);
    res.json(club);
  });

  app.get("/api/clubs/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const club = await storage.getClub(id);
    if (!club) {
      return res.status(404).json({ error: "Club not found" });
    }
    res.json(club);
  });

  // Students
  app.get("/api/students", async (_req, res) => {
    const students = await storage.getStudents();
    res.json(students);
  });

  app.post("/api/students", async (req, res) => {
    const result = insertStudentSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const student = await storage.createStudent(result.data);
    res.json(student);
  });

  // Memberships
  app.get("/api/memberships", async (req, res) => {
    const clubId = req.query.clubId ? parseInt(req.query.clubId as string) : undefined;
    const studentId = req.query.studentId ? parseInt(req.query.studentId as string) : undefined;
    const memberships = await storage.getMemberships(clubId, studentId);
    res.json(memberships);
  });

  app.post("/api/memberships", async (req, res) => {
    const result = insertMembershipSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const membership = await storage.createMembership(result.data);
    res.json(membership);
  });

  // Activities
  app.get("/api/activities", async (req, res) => {
    const clubId = req.query.clubId ? parseInt(req.query.clubId as string) : undefined;
    const activities = await storage.getActivities(clubId);
    res.json(activities);
  });

  app.post("/api/activities", async (req, res) => {
    const result = insertActivitySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const activity = await storage.createActivity(result.data);
    res.json(activity);
  });

  const httpServer = createServer(app);
  return httpServer;
}
