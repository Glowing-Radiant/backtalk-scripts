export const manifest = {
  id: "youtube-actions",
  name: "YouTube video actions",
  version: "1.2",
  author: "Aryan Choudhary",
  minApiVersion: 1,
  testedApiVersion: 2,
  description:
    "Skips the buttons inside each video in YouTube lists, and puts them in the video's Actions menu instead.",
  apps: ["com.google.android.youtube"],
  permissions: ["screen", "actions", "speech", "input"],
  rules: [
    { match: { className: "Button", inside: { clickable: true, textContains: "play video" } }, hide: true },
    { match: { className: "Button", inside: { clickable: true, textContains: "play Short" } }, hide: true },
  ],
};

const MAX_BUTTONS = 8;

const isVideo = (item) => item.clickable && /play (video|short)/i.test(item.contentDescription || "");

// "Action menu for <video title>" repeats the title the user just heard.
const title = (label) => (label.startsWith("Action menu for") ? "Action menu" : label.replace(/[.:]+$/, ""));

backtalk.onActions((item) => {
  if (!isVideo(item)) return;
  return item
    .findAll({ className: "Button" }, MAX_BUTTONS)
    .filter((button) => button.contentDescription && !isVideo(button))
    .map((button) => ({ title: title(button.contentDescription), run: () => button.click() }));
});
