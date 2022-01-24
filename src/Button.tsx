import { ReactChild } from "react";

type Props = {
  onClick: () => void;
  content: ReactChild;
  status: "idle" | "loading" | "error" | "success";
};

export function Button(props: Props) {
  const renderStatus = (): ReactChild | null => {
    switch (props.status) {
      case "idle":
        return null;

      case "loading":
        return "⏳";

      case "success":
        return "✅";

      case "error":
        return "❌";
    }
  };
  return (
    <button onClick={props.onClick}>
      {props.content}
      {renderStatus()}
    </button>
  );
}
