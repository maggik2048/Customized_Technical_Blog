export function getLatestResponse() {
  const articles =
    document.querySelectorAll(
      'article'
    );

  const last =
    articles[
      articles.length - 1
    ];

  if (!last) {
    return null;
  }

  return {
    text: last.innerText,
    html: last.innerHTML,
    id: articles.length
  };
}