"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

const getDate = () =>
  new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
    timeZone: "Asia/Dhaka",
  });

const getServerDate = () => "আজকের তারিখ";

const DateDisplay = () => {
  const date = useSyncExternalStore(
    subscribe,
    getDate,
    getServerDate
  );

  return <span>{date}</span>;
};

export default DateDisplay;

