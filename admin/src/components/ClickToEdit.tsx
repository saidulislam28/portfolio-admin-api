import { useState } from 'react';

interface IProps {
  text: string;
  onClickSave(t: string): void;
}

export function ClickToEdit({ text, onClickSave, ...props }: IProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [t, settext] = useState(text);

  const editingUi = (
    <>
      <input
        type="text"
        className="form-control"
        value={t}
        onChange={(e) => settext(e.target.value)}
      />
      <button
        className="btn btn-sm btn-primary"
        onClick={() => {
          onClickSave(t);
          setIsEditing(false);
        }}
      >
        Save
      </button>
      <button className="btn btn-sm btn-secondary" onClick={() => setIsEditing(false)}>
        Cancel
      </button>
    </>
  );
  return isEditing ? editingUi : <span onClick={() => setIsEditing(true)}>{text}</span>;
}
