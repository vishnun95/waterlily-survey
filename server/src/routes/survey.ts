import { Router } from "express";  
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

const formatSurvey = (survey: any) => {
  return {
    id: survey.id,
    title: survey.title,
    description: survey.description,
    questions: survey.questions.map((question: any) => ({
      id: question.id,
      title: question.title,
      description: question.description,
      type: question.type,
      options: question.options
        ? JSON.parse(question.options)
        : [],
      order: question.order,
    })),
  };
};

router.get("/", async (_req, res) => {
    try {
        const surveys = await prisma.survey.findMany({
            include: {
                questions: {
                  orderBy: {
                    order: 'asc'
                  } 
                },
            },
        });
        res.json(surveys);
    } catch (error) {
        console.error("Error fetching surveys:", error);
        res.status(500).json({ error: "Failed to fetch surveys" });
    }
});


router.get("/", async (_req, res) => {
  try {
    const surveys = await prisma.survey.findMany({
      include: {
        questions: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    const formattedSurveys = surveys.map((survey) =>
      formatSurvey(survey)
    );

    res.json(formattedSurveys);
  } catch (error) {
    console.error("Error fetching surveys:", error);

    res.status(500).json({
      error: "Failed to fetch surveys",
    });
  }
});


router.post("/:id/responses",authenticate, async (req: AuthRequest, res) => {
  const surveyId = Number(req.params.id);
   const survey = await prisma.survey.findUnique({
    where: { id: surveyId }
  });

  if (!survey) {     
    return res.status(404).json({ error: "Survey not found" });
  }
  const response = await prisma.surveyResponse.create({
    data: {
      userId: req.userId!,
      surveyId,
      answers: JSON.stringify(req.body),
    },
  });

  res.status(201).json({ message: "Response submitted successfully", response });
});

router.get("/:id/responses/latest", authenticate, async (req: AuthRequest, res) => {
    try {
        const surveyId = Number(req.params.id);
        const response = await prisma.surveyResponse.findFirst({
            where: {
                surveyId,
                userId: req.userId!,
            },
            orderBy: {
                submittedAt: 'desc',
            },
        });
        if (!response) {
            return res.status(404).json({ error: "No responses found for this survey" });
        }
        res.json({...response, answers: JSON.parse(response.answers) });
    }
    catch (error) {
        console.error("Error fetching latest response:", error);
        res.status(500).json({ error: "Failed to fetch latest response" });
    }
});

export default router;


