export function addUniqueIdsToHeadings(content: string): string {
  const headings = ["h1", "h2", "h3"];
  let idCounter = 0;

  headings.forEach((tag) => {
    const regex = new RegExp(`<${tag}>((.|\\n)*?)<\/${tag}>`, "g");
    content = content.replace(regex, (match, innerText) => {
      const id =
        innerText.toLowerCase().replace(/\s+/g, "-") + "-" + idCounter++;
      return `<${tag} id="${id}">${innerText}</${tag}>`;
    });
  });

  return content;
}
