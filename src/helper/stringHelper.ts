export function capFirst(text: string) {
  text = text.charAt(0).toLocaleUpperCase() + text.substring(1, text.length);
  const regex = /(?<=\s|\(|\-)\w/g;
  return text.replace(regex, (match) => match.toLocaleUpperCase());
}
