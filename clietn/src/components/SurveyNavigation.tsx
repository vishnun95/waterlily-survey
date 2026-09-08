type SurveyNavigationProps = {
  currentQuestion: number;
  totalQuestions: number;
  hasAnswer: boolean;
  submitting: boolean;
  reviewing: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
};

function SurveyNavigation({
  currentQuestion,
  totalQuestions,
  hasAnswer,
  submitting,
  reviewing,
  onBack,
  onNext,
  onSubmit,
}: SurveyNavigationProps) {
  const isFirstQuestion = currentQuestion === 0;
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  return (
    <>
      <div className="navigation">
        <button
          className="back-button"
          onClick={onBack}
          disabled={isFirstQuestion}
        >
          ← Back
        </button>

        {!isLastQuestion ? (
          <button
            className="primary-button next-button"
            onClick={onNext}
            disabled={!hasAnswer}
          >
            Continue
            <span>→</span>
          </button>
        ) : (
          <button
            className="primary-button next-button"
            onClick={onSubmit}
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : reviewing
                ? "Save changes"
                : "Complete assessment"}

            {!submitting && <span>✓</span>}
          </button>
        )}
      </div>

      <div className="keyboard-hint">
        {reviewing
          ? "Review your responses and save any changes."
          : "Your responses are saved as you move through the assessment."}
      </div>
    </>
  );
}

export default SurveyNavigation;