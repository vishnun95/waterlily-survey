type SurveyHeaderProps = {
  currentQuestion: number;
  totalQuestions: number;
  answeredCount: number;
  answeredQuestions: number[];
  onQuestionChange: (index: number) => void;
  onLogout: () => void;
};

function SurveyHeader({
  currentQuestion,
  totalQuestions,
  answeredCount,
  answeredQuestions,
  onQuestionChange,
  onLogout,
}: SurveyHeaderProps) {
  const progress =
    ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">W</div>
          <span>Waterlily</span>
        </div>

        <div className="progress-info">
          <span>
            {currentQuestion + 1} / {totalQuestions}
          </span>

          <span>{answeredCount} answered</span>

          <button
            className="logout-button"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="question-navigation">
        {Array.from({ length: totalQuestions }, (_, index) => {
          const isCurrent = currentQuestion === index;
          const isAnswered = answeredQuestions.includes(index);

          return (
            <button
              key={index}
              className={`question-nav-button ${
                isCurrent ? "current" : ""
              } ${isAnswered ? "answered" : ""}`}
              onClick={() => onQuestionChange(index)}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <div className="progress-track">
        <div
          className="progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
}

export default SurveyHeader;
