import { style, globalStyle } from "@vanilla-extract/css";

export const tripDetails = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export const from = style({
  display: "flex",
  flexDirection: "column",
  marginTop: "8px",
  backgroundColor: "lightgray",
  padding: "8px",
  borderRadius: "4px",
  minWidth: "400px",
});

export const to = style({
  display: "flex",
  flexDirection: "column",
  marginTop: "8px",
  backgroundColor: "lightgray",
  padding: "8px",
  borderRadius: "4px",
  minWidth: "400px",
});

export const del = style({
  display: "flex",
  flexDirection: "row",
  marginTop: "8px",
  paddingTop: "8px",
  minWidth: "400px",
  justifyContent: "flex-end",
  borderTop: "1px solid lightgray",
});

globalStyle(`${del} > button`, {
  cursor: "pointer",
});
