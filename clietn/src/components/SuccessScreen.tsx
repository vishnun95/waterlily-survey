type SuccessScreenProps = {
  surveyTitle: string;
  onEdit: () => void;
};

function SuccessScreen({
  surveyTitle,
  onEdit,
}: SuccessScreenProps) {
  return (
    <div className="app">
      <main className="success-container">
        <div className="success-card">
          <div className="success-icon">✓</div>

          <span className="eyebrow">
            Assessment complete
          </span>

          <h1>You're all done.</h1>

          <p>
            Thank you for completing{" "}
            <strong>{surveyTitle}</strong>.
            Your responses have been successfully submitted.
          </p>

          <button
            className="primary-button"
            onClick={onEdit}
          >
            Review responses
          </button>
        </div>
      </main>
    </div>
  );
}

export default SuccessScreen;
