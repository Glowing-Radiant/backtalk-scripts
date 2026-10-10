export const manifest = {
  id: 'play-store-actions',
  name: 'Play Store row actions',
  version: '1.0',
  author: 'Aryan Choudhary',
  minApiVersion: 1,
  testedApiVersion: 1,
  description:
    'Skips the buttons inside each row in Play Store lists, such as Update and Expand in Manage apps, and puts them in the row\'s Actions menu instead.',
  apps: ['com.android.vending'],
  // speech: the rule that hides the buttons. input: onActions. screen: reading the row's
  // buttons. actions: pressing them.
  permissions: ['screen', 'actions', 'speech', 'input'],
  // Play Store's view ids are all the same and its wording changes with the language, so a button
  // is told by its place: anything that can be pressed inside a row that can be pressed.
  rules: [
    { match: { clickable: true, inside: { clickable: true, className: 'android.view.View' } }, hide: 'all' },
  ],
};

const MAX_BUTTONS = 8;
const LABEL_DEPTH = 3;

// The Update button has no name of its own; the name is on an item inside it.
const labelOf = (item, depth = LABEL_DEPTH) => {
  const own = item.contentDescription || item.text;
  if (own || depth === 0) return own || '';
  for (const child of item.children) {
    const label = labelOf(child, depth - 1);
    if (label) return label;
  }
  return '';
};

backtalk.onActions((item) => {
  if (!item.clickable || item.className !== 'android.view.View') return;
  const actions = [];
  for (const button of item.findAll({ clickable: true }, MAX_BUTTONS)) {
    if (button.equals(item)) continue;
    const title = labelOf(button).trim();
    if (title) actions.push({ title, run: () => button.click() });
  }
  return actions;
});
