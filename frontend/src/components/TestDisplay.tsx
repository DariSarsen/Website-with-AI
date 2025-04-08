import React from "react";

interface Props {
  testText: string;
  onEdit: (index: number, newValue: string) => void;
}

const TestDisplay: React.FC<Props> = ({ testText, onEdit }) => {
  return (
    <div>
      {testText.split("\n\n").map((q, index) => (
        <div key={index}>
          <textarea
            value={q}
            onChange={(e) => onEdit(index, e.target.value)}
            rows={6}
          />
        </div>
      ))}
    </div>
  );
};

export default TestDisplay;
