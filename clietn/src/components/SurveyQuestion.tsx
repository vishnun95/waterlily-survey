type Question = {
  id: number;
  title: string;
  description?: string;
  type: string;
  options?: string[];
  order: number;
};

type SurveyQuestionProps = {
  question: Question;
  answer: string | number | undefined;
  error?: string;
  onAnswerChange: (
    questionId: number,
    value: string | number
  ) => void;
};

function SurveyQuestion({
  question,
  answer,
  error,
  onAnswerChange,
}: SurveyQuestionProps) {
  let options: string[] = [];

  if (question.type === "single" && question.options) {
    try {
      options = Array.isArray(question.options)
        ? question.options
        : JSON.parse(question.options);
    } catch {
      options = [];
    }
  }

  return (
    <section className="question-card">
      <div className="question-number">
        Question {String(question.order).padStart(2, "0")}
      </div>

      <h2>{question.title}</h2>

      {question.description && (
        <p className="question-description">
          {question.description}
        </p>
      )}

      <div className="answer-area">
        {question.type === "rating" && (
          <>
            <div className="rating-options">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  className={`rating-button ${
                    answer === rating ? "selected" : ""
                  }`}
                  onClick={() =>
                    onAnswerChange(question.id, rating)
                  }
                >
                  <span>{rating}</span>
                </button>
              ))}
            </div>

            <div className="rating-labels">
              <span>Not at all</span>
              <span>Extremely</span>
            </div>
          </>
        )}

        {question.type === "single" && (
          <div className="choice-options">
            {options.map((option, index) => (
              <button
                key={option}
                type="button"
                className={`choice-card ${
                  answer === option ? "selected" : ""
                }`}
                onClick={() =>
                  onAnswerChange(question.id, option)
                }
              >
                <span className="choice-letter">
                  {String.fromCharCode(65 + index)}
                </span>

                <span className="choice-text">
                  {option}
                </span>

                <span className="choice-check">✓</span>
              </button>
            ))}
          </div>
        )}

        {question.type === "text" && (
          <textarea
            className={`text-answer ${error ? "has-error" : ""}`}
            placeholder="Type your answer here..."
            value={answer?.toString() || ""}
            onChange={(event) =>
              onAnswerChange(
                question.id,
                event.target.value
              )
            }
          />
        )}
      </div>

      {error && (
        <div className="validation-error">
          <span>!</span>
          {error}
        </div>
      )}
    </section>
  );
}

export default SurveyQuestion;
