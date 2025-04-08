import React from "react";

const TestPreview: React.FC<{ testText: string }> = ({ testText }) => {
  return (
    <div className="test-preview">
      {testText.split("\n\n").map((q, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: q.replace(/\n/g, "<br>") }} />
      ))}
    </div>
  );
};

export default TestPreview;
