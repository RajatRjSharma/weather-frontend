import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
  Divider,
} from "@mui/material";

interface NewsArticle {
  title: string;
  source?: { name?: string };
  publishedAt: string; // Iso string
  description?: string;
  url?: string;
}

interface NewsListProps {
  articles: NewsArticle[];
}

const NewsList: React.FC<NewsListProps> = ({ articles }) => (
  <Box>
    <List>
      {articles.map((article, index) => (
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
                  <Typography variant="body2" color="textSecondary">
                    {article.source?.name ?? "Unknown source"} -{" "}
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </Typography>
                  {article.description && (
                    <Typography variant="body2" color="textSecondary">
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
  </Box>
);

export default NewsList;
