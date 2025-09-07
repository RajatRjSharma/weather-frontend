import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
  Divider,
  Pagination,
} from "@mui/material";

interface NewsArticle {
  title: string;
  source?: { name?: string };
  publishedAt: string; // ISO string
  description?: string;
  url?: string;
}

interface NewsListProps {
  articles: NewsArticle[];
  itemsPerPage?: number; // Optional prop for items per page
}

const NewsList: React.FC<NewsListProps> = ({ articles, itemsPerPage = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(articles.length / itemsPerPage));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentArticles = articles.slice(startIndex, startIndex + itemsPerPage);

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <Box>
      <List>
        {currentArticles.map((article, index) => (
          <React.Fragment key={`${article.title}-${index}`}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  article.url ? (
                    <Link
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                    >
                      {article.title}
                    </Link>
                  ) : (
                    article.title
                  )
                }
                secondary={
                  <>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="span"
                      sx={{ display: "block" }}
                    >
                      {article.source?.name ?? "Unknown source"} -{" "}
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </Typography>
                    {article.description && (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="span"
                        sx={{ display: "block" }}
                      >
                        {article.description}
                      </Typography>
                    )}
                  </>
                }
              />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
        {articles.length === 0 && (
          <Typography variant="body2" color="textSecondary" sx={{ p: 2 }}>
            No news articles available.
          </Typography>
        )}
      </List>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handleChange}
          />
        </Box>
      )}
    </Box>
  );
};

export default NewsList;
