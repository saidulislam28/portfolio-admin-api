type ErrorMessageProps = {
  text: string;
  className: string;
};

function ErrorMessage({ text, className }: ErrorMessageProps) {
  const divStyle = { width: "100%", fontSize: "80%", color: "#dc3545" };
  return (
    <>
      <div className="has-errorWrap">
        <div className="has-ErrorMsg">
          <div className={className} style={divStyle}>
            {text}
          </div>
        </div>
      </div>
    </>
  );
}

export default ErrorMessage;
