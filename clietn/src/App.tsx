import { useEffect, useState } from "react";
import "./index.css";

import Login from "./components/Login";
import Signup from "./components/Signup";
import SurveyHeader from "./components/SurveyHeader";
import SurveyQuestion from "./components/SurveyQuestion";
import SurveyNavigation from "./components/SurveyNavigation";
import SuccessScreen from "./components/SuccessScreen";

type Question = {
  id: number;
  title: string;
  description?: string;
  type: string;
  options?: string[];
  order: number;
};

type Survey = {
  id: number;
  title: string;
  description: string;
  questions: Question[];
};

type AssessmentMode =
  | "taking"
  | "reviewing"
  | "completed";

function App() {
  const [survey, setSurvey] = useState<Survey | null>(
    null
  );

  const [answers, setAnswers] = useState<
    Record<number, string | number>
  >({});

  const [errors, setErrors] = useState<
    Record<number, string>
  >({});

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [mode, setMode] =
    useState<AssessmentMode>("taking");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [showSignup, setShowSignup] =
    useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const loadAssessment = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/surveys"
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch survey"
          );
        }

        const data = await response.json();

        if (!data.length) {
          return;
        }

        const currentSurvey = data[0];

        setSurvey(currentSurvey);

        await fetchExistingResponse(
          currentSurvey.id
        );
      } catch (error) {
        console.error(
          "Error loading assessment:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadAssessment();
  }, [token]);

  const fetchExistingResponse = async (
    surveyId: number
  ) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/surveys/${surveyId}/responses`,
        {
          credentials: "include",
        }
      );

      if (response.status === 404) {
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to fetch existing response"
        );
      }

      const data = await response.json();

      if (data?.answers) {
        setAnswers(data.answers);
        setMode("completed");
      }
    } catch (error) {
      console.error(
        "Error fetching existing response:",
        error
      );
    }
  };

  const handleLogin = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleSignup = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setSurvey(null);
    setAnswers({});
    setErrors({});
    setCurrentQuestion(0);
    setMode("taking");
    setShowSignup(false);
  };

  const handleAnswerChange = (
    questionId: number,
    value: string | number
  ) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [questionId]: "",
    }));
  };

  const getQuestionError = (
    question: Question
  ) => {
    const answer = answers[question.id];

    if (question.type === "text") {
      if (
        answer === undefined ||
        answer.toString().trim() === ""
      ) {
        return "This question is required.";
      }
    }

    if (question.type === "rating") {
      if (
        typeof answer !== "number" ||
        answer < 1 ||
        answer > 5
      ) {
        return "Please select a rating.";
      }
    }

    if (question.type === "single") {
      if (
        answer === undefined ||
        answer.toString().trim() === ""
      ) {
        return "Please select an option.";
      }
    }

    return "";
  };

  const validateQuestion = (
    question: Question
  ) => {
    const error = getQuestionError(question);

    setErrors((previous) => ({
      ...previous,
      [question.id]: error,
    }));

    return !error;
  };

  const validateAllQuestions = () => {
    if (!survey) {
      return -1;
    }

    const newErrors: Record<number, string> = {};
    let firstInvalidQuestion = -1;

    survey.questions.forEach((question, index) => {
      const error = getQuestionError(question);

      if (!error) {
        return;
      }

      newErrors[question.id] = error;

      if (firstInvalidQuestion === -1) {
        firstInvalidQuestion = index;
      }
    });

    setErrors(newErrors);

    return firstInvalidQuestion;
  };

  const handleNext = () => {
    if (!survey) {
      return;
    }

    const question =
      survey.questions[currentQuestion];

    if (!question || !validateQuestion(question)) {
      return;
    }

    if (
      currentQuestion <
      survey.questions.length - 1
    ) {
      setCurrentQuestion(
        (previous) => previous + 1
      );
    }
  };

  const handleBack = () => {
    if (currentQuestion === 0) {
      return;
    }

    setCurrentQuestion(
      (previous) => previous - 1
    );
  };

  const handleQuestionChange = (
    index: number
  ) => {
    if (!survey) {
      return;
    }

    if (
      index < 0 ||
      index >= survey.questions.length
    ) {
      return;
    }

    if (index < currentQuestion) {
      setCurrentQuestion(index);
      return;
    }

    for (
      let questionIndex = currentQuestion;
      questionIndex < index;
      questionIndex++
    ) {
      const question =
        survey.questions[questionIndex];

      if (!validateQuestion(question)) {
        setCurrentQuestion(questionIndex);
        return;
      }
    }

    setCurrentQuestion(index);
  };

  const handleSubmit = async () => {
    if (!survey) {
      return;
    }

    const firstInvalidQuestion =
      validateAllQuestions();

    if (firstInvalidQuestion !== -1) {
      setCurrentQuestion(
        firstInvalidQuestion
      );
      return;
    }

    setSubmitting(true);

    try {
      const method =
        mode === "reviewing"
          ? "PUT"
          : "POST";

      const response = await fetch(
        `http://localhost:3000/api/surveys/${survey.id}/responses`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(answers),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to save survey responses"
        );
      }

      setMode("completed");
      setErrors({});
    } catch (error) {
      console.error(
        "Error saving survey responses:",
        error
      );

      alert(
        "Something went wrong while saving."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditResponses = () => {
    setCurrentQuestion(0);
    setErrors({});
    setMode("reviewing");
  };

 if (!token) {
  if (showSignup) {
    return (
      <Signup
        onSignup={handleSignup}
        onLoginClick={() => setShowSignup(false)}
      />
    );
  }

  return (
    <Login
      onLogin={handleLogin}
      onSignupClick={() => setShowSignup(true)}
    />
  );
}

  if (loading) {
    return (
      <div className="app loading-screen">
        <div className="loader" />

        <p>
          Preparing your assessment...
        </p>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="app loading-screen">
        <div className="empty-icon">⌁</div>

        <h2>
          No assessment available
        </h2>

        <p>
          Please try again later.
        </p>
      </div>
    );
  }

  if (mode === "completed") {
    return (
      <SuccessScreen
        surveyTitle={survey.title}
        onEdit={handleEditResponses}
      />
    );
  }

  const question =
    survey.questions[currentQuestion];

  const answeredQuestions =
    survey.questions
      .map((item, index) =>
        answers[item.id] !== undefined
          ? index
          : null
      )
      .filter(
        (index): index is number =>
          index !== null
      );

  const answeredCount =
    answeredQuestions.length;

  const hasAnswer =
    answers[question.id] !== undefined;

  return (
    <div className="app">
      <SurveyHeader
        currentQuestion={currentQuestion}
        totalQuestions={
          survey.questions.length
        }
        answeredCount={answeredCount}
        answeredQuestions={
          answeredQuestions
        }
        onQuestionChange={
          handleQuestionChange
        }
        onLogout={handleLogout}
      />

      <main className="survey-container">
        <div className="survey-intro">
          <span className="eyebrow">
            {mode === "reviewing"
              ? "Review your responses"
              : "Personal assessment"}
          </span>

          <h1>{survey.title}</h1>

          <p>{survey.description}</p>
        </div>

        <SurveyQuestion
          question={question}
          answer={answers[question.id]}
          error={errors[question.id]}
          onAnswerChange={
            handleAnswerChange
          }
        />

        <SurveyNavigation
          currentQuestion={currentQuestion}
          totalQuestions={
            survey.questions.length
          }
          hasAnswer={hasAnswer}
          submitting={submitting}
          reviewing={
            mode === "reviewing"
          }
          onBack={handleBack}
          onNext={handleNext}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}

export default App;
