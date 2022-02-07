import { style, globalStyle, styleVariants } from "@vanilla-extract/css";
import { TripStatus } from "./models";

export const tripDetails = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export const baseBox = style({
  display: "flex",
  flexDirection: "column",
  marginTop: "8px",
  backgroundColor: "lightgray",
  padding: "8px",
  borderRadius: "4px",
  minWidth: "400px",
});

export const tripBox: Record<TripStatus, string> = styleVariants({
  Requested: [baseBox, { background: "lightgrey" }],
  Booked: [baseBox, { background: "lightgreen" }],
  CheckedIn: [baseBox, { background: "orange" }],
});

export const footer = style({
  display: "flex",
  flexDirection: "row",
  marginTop: "8px",
  paddingTop: "8px",
  minWidth: "400px",
  justifyContent: "flex-end",
  borderTop: "1px solid lightgray",
});

const baseDialogOverlay = style({
  position: "fixed",
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  display: "flex",
  backgroundColor: "rgba(0, 0, 0, .4)",
  alignItems: "center",
  justifyContent: "center",
});

export const dialog = style({
  padding: 24,
  backgroundColor: "white",
});

export const dialogActions = style({
  display: "flex",
  marginTop: 24,
  justifyContent: "flex-end",
});

export const dialogOverlay: Record<"open" | "closed", string> = styleVariants({
  open: [baseDialogOverlay],
  closed: [baseDialogOverlay, { display: "none" }],
});

globalStyle(`${footer} > button`, {
  cursor: "pointer",
});

globalStyle(`${footer} > *`, {
  marginLeft: "16px",
});
