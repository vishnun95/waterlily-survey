import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcrypt";


const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.surveyResponse.deleteMany();
  await prisma.question.deleteMany();
  await prisma.survey.deleteMany();
  await prisma.user.deleteMany();


  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      passwordHash,
    },
  });

  console.log(`👤 Created user: ${user.email}`);


  const personalAssessment = await prisma.survey.create({
    data: {
      title: "Personal Assessment",
      description:
        "Take a few minutes to reflect on your experiences, preferences and working style.",
      questions: {
        create: [
          {
            title: "How satisfied are you with your current work?",
            description:
              "Rate your overall satisfaction from 1 to 5.",
            type: "rating",
            order: 1,
          },
          {
            title: "How would you describe your work-life balance?",
            description:
              "Choose the option that best represents your current situation.",
            type: "single",
            options: JSON.stringify([
              "Excellent",
              "Good",
              "Average",
              "Needs improvement",
              "Poor",
            ]),
            order: 2,
          },
          {
            title: "How often do you feel motivated at work?",
            type: "single",
            options: JSON.stringify([
              "Always",
              "Often",
              "Sometimes",
              "Rarely",
              "Never",
            ]),
            order: 3,
          },
          {
            title: "What is one thing you would like to improve?",
            description:
              "There are no right or wrong answers.",
            type: "text",
            order: 4,
          },
          {
            title: "How supported do you feel by your team?",
            type: "rating",
            order: 5,
          },
        ],
      },
    },
  });

  console.log(
    `📋 Created survey: ${personalAssessment.title}`
  );


  const developerAssessment = await prisma.survey.create({
    data: {
      title: "Developer Experience Survey",
      description:
        "Help us understand your development experience and identify areas where we can improve.",
      questions: {
        create: [
          {
            title: "How would you rate your development environment?",
            type: "rating",
            order: 1,
          },
          {
            title: "Which area do you enjoy working on the most?",
            type: "single",
            options: JSON.stringify([
              "Frontend",
              "Backend",
              "Database",
              "DevOps",
              "Testing",
            ]),
            order: 2,
          },
          {
            title: "Which programming language do you use most often?",
            type: "single",
            options: JSON.stringify([
              "JavaScript",
              "TypeScript",
              "Python",
              "Java",
              "Other",
            ]),
            order: 3,
          },
          {
            title: "What could make your development workflow better?",
            type: "text",
            order: 4,
          },
          {
            title: "How confident are you in your technical skills?",
            type: "rating",
            order: 5,
          },
        ],
      },
    },
  });

  console.log(
    `📋 Created survey: ${developerAssessment.title}`
  );

  const feedbackSurvey = await prisma.survey.create({
    data: {
      title: "Product Feedback",
      description:
        "Tell us what you think about the product and help us build a better experience.",
      questions: {
        create: [
          {
            title: "How easy was the product to use?",
            type: "rating",
            order: 1,
          },
          {
            title: "Would you recommend this product?",
            type: "single",
            options: JSON.stringify([
              "Definitely",
              "Probably",
              "Not sure",
              "Probably not",
              "Definitely not",
            ]),
            order: 2,
          },
          {
            title: "What feature did you find most useful?",
            type: "text",
            order: 3,
          },
          {
            title: "What feature would you like us to add?",
            type: "text",
            order: 4,
          },
        ],
      },
    },
  });

  console.log(
    `📋 Created survey: ${feedbackSurvey.title}`
  );

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
