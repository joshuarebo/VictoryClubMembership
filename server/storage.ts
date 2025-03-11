import {
  type Club, type InsertClub,
  type Student, type InsertStudent,
  type Membership, type InsertMembership,
  type Activity, type InsertActivity
} from "@shared/schema";

export interface IStorage {
  // Clubs
  getClubs(): Promise<Club[]>;
  getClub(id: number): Promise<Club | undefined>;
  createClub(club: InsertClub): Promise<Club>;
  updateClub(id: number, club: Partial<InsertClub>): Promise<Club | undefined>;
  deleteClub(id: number): Promise<boolean>;

  // Students
  getStudents(): Promise<Student[]>;
  getStudent(id: number): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  
  // Memberships
  getMemberships(clubId?: number, studentId?: number): Promise<Membership[]>;
  createMembership(membership: InsertMembership): Promise<Membership>;
  updateMembership(id: number, membership: Partial<InsertMembership>): Promise<Membership | undefined>;
  
  // Activities
  getActivities(clubId?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
}

export class MemStorage implements IStorage {
  private clubs: Map<number, Club>;
  private students: Map<number, Student>;
  private memberships: Map<number, Membership>;
  private activities: Map<number, Activity>;
  private currentIds: {
    clubs: number;
    students: number;
    memberships: number;
    activities: number;
  };

  constructor() {
    this.clubs = new Map();
    this.students = new Map();
    this.memberships = new Map();
    this.activities = new Map();
    this.currentIds = {
      clubs: 1,
      students: 1,
      memberships: 1,
      activities: 1
    };
  }

  // Clubs
  async getClubs(): Promise<Club[]> {
    return Array.from(this.clubs.values());
  }

  async getClub(id: number): Promise<Club | undefined> {
    return this.clubs.get(id);
  }

  async createClub(club: InsertClub): Promise<Club> {
    const id = this.currentIds.clubs++;
    const newClub = { ...club, id };
    this.clubs.set(id, newClub);
    return newClub;
  }

  async updateClub(id: number, club: Partial<InsertClub>): Promise<Club | undefined> {
    const existing = this.clubs.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...club };
    this.clubs.set(id, updated);
    return updated;
  }

  async deleteClub(id: number): Promise<boolean> {
    return this.clubs.delete(id);
  }

  // Students
  async getStudents(): Promise<Student[]> {
    return Array.from(this.students.values());
  }

  async getStudent(id: number): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const id = this.currentIds.students++;
    const newStudent = { ...student, id };
    this.students.set(id, newStudent);
    return newStudent;
  }

  // Memberships
  async getMemberships(clubId?: number, studentId?: number): Promise<Membership[]> {
    return Array.from(this.memberships.values()).filter(m => 
      (!clubId || m.clubId === clubId) && 
      (!studentId || m.studentId === studentId)
    );
  }

  async createMembership(membership: InsertMembership): Promise<Membership> {
    const id = this.currentIds.memberships++;
    const newMembership = { ...membership, id, active: true };
    this.memberships.set(id, newMembership);
    return newMembership;
  }

  async updateMembership(id: number, membership: Partial<InsertMembership>): Promise<Membership | undefined> {
    const existing = this.memberships.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...membership };
    this.memberships.set(id, updated);
    return updated;
  }

  // Activities
  async getActivities(clubId?: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(a => !clubId || a.clubId === clubId);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.currentIds.activities++;
    const newActivity = { ...activity, id };
    this.activities.set(id, newActivity);
    return newActivity;
  }
}

export const storage = new MemStorage();
