export const manifest = {
  id: 'youtube-actions',
  name: 'YouTube video actions',
  version: '1.2',
  author: 'Aryan Choudhary',
  minApiVersion: 1,
  testedApiVersion: 1,
  description:
    'Skips the buttons inside each video in YouTube lists, and puts them in the video\'s Actions menu instead.',
  apps: ['com.google.android.youtube'],
  // speech: the rules that hide the buttons. input: onActions. screen: reading the video's
  // buttons. actions: pressing them.
  permissions: ['screen', 'actions', 'speech', 'input'],
  // YouTube's list items have no view ids. A video is a clickable item whose label ends in
  // "play video" or "play Short", and every button inside one is skipped.
  rules: [
    { match: { className: 'Button', inside: { clickable: true, textContains: 'play video' } }, hide: true },
    { match: { className: 'Button', inside: { clickable: true, textContains: 'play Short' } }, hide: true },
  ],
};

const MAX_BUTTONS = 8;

const isVideo = (item) =>
  item.clickable && /play (video|short)/i.test(item.contentDescription || '');

// "Action menu for <video title>" repeats the title the user just heard.
const title = (label) =>
  label.startsWith('Action menu for') ? 'Action menu' : label.replace(/[.:]+$/, '');

// Every button inside the focused video becomes an action, whatever it's called. YouTube calls
// the video itself a button too, so that one is left out.
backtalk.onActions((item) => {
  if (!isVideo(item)) return;
  return item
    .findAll({ className: 'Button' }, MAX_BUTTONS)
    .filter((button) => button.contentDescription && !isVideo(button))
    .map((button) => ({ title: title(button.contentDescription), run: () => button.click() }));
});
