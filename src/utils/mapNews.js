export default function mapNews(news) {
  return news.map((article) => ({
    id: article.id,
    title: article.title,
    subtitle:article.description,
    image: article.image !== "None"
      ? article.image
      : null,
    published: article.published,
    url: article.url,
    source: article.author,
    type: 'news',
  }));
}