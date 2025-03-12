
import { storage } from "./storage";
import { InsertClub } from "@shared/schema";

async function seedClubs() {
  console.log("Starting to seed clubs...");
  
  const clubs: InsertClub[] = [
    // Registration fee of KES 200
    { name: "Debate Club", patron: "Mr. Anderson", registrationFee: 200 },
    { name: "Chess Club", patron: "Ms. Williams", registrationFee: 200 },
    { name: "Music Club", patron: "Mrs. Johnson", registrationFee: 200 },
    
    // Registration fee of KES 250
    { name: "Science Club", patron: "Dr. Roberts", registrationFee: 250 },
    { name: "Mathematics Club", patron: "Mr. Thompson", registrationFee: 250 },
    { name: "Drama Club", patron: "Ms. Garcia", registrationFee: 250 },
    { name: "Writing Club", patron: "Ms. Brown", registrationFee: 250 },
    { name: "Computer Science Club", patron: "Mr. Lee", registrationFee: 250 },
    
    // Registration fee of KES 300
    { name: "Art Club", patron: "Mrs. Martinez", registrationFee: 300 },
    { name: "Agriculture Club", patron: "Mr. Wilson", registrationFee: 300 },
    
    // Registration fee of KES 100
    { name: "Environmental Club", patron: "Dr. Clark", registrationFee: 100 },
  ];

  // Check existing clubs to avoid duplicates
  const existingClubs = await storage.getClubs();
  const existingClubNames = existingClubs.map(club => club.name.toLowerCase());

  let addedCount = 0;
  
  for (const club of clubs) {
    if (!existingClubNames.includes(club.name.toLowerCase())) {
      await storage.createClub(club);
      console.log(`Added club: ${club.name}`);
      addedCount++;
    } else {
      console.log(`Club already exists: ${club.name}`);
    }
  }

  console.log(`Seeding complete! Added ${addedCount} new clubs.`);
}

// Execute the seeding function
seedClubs()
  .then(() => {
    console.log("Club seeding completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding clubs:", error);
    process.exit(1);
  });
