import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import axios from 'axios';

interface News {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  category: string;
  viewCount: number;
  author: {
    fullName: string;
  };
}

const Home = () => {
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [mostViewedNews, setMostViewedNews] = useState<News[]>([]);
  const [featuredNews, setFeaturedNews] = useState<News[]>([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const [latestResponse, mostViewedResponse] = await Promise.all([
          axios.get('http://localhost:3000/news'),
          axios.get('http://localhost:3000/news/most-viewed'),
        ]);

        setLatestNews(latestResponse.data);
        setMostViewedNews(mostViewedResponse.data);
        setFeaturedNews(latestResponse.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeaturedIndex((prev) =>
        prev === featuredNews.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [featuredNews.length]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        {/* Featured News Slider */}
        <Grid item xs={12} md={8}>
          {featuredNews[currentFeaturedIndex] && (
            <Paper
              component={RouterLink}
              to={`/news/${featuredNews[currentFeaturedIndex].id}`}
              sx={{
                position: 'relative',
                height: 400,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <CardMedia
                component="img"
                height="400"
                image={featuredNews[currentFeaturedIndex].imageUrl || 'https://via.placeholder.com/800x400'}
                alt={featuredNews[currentFeaturedIndex].title}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  p: 2,
                }}
              >
                <Typography variant="h5" gutterBottom>
                  {featuredNews[currentFeaturedIndex].title}
                </Typography>
                <Typography variant="body2">
                  {featuredNews[currentFeaturedIndex].author.fullName}
                </Typography>
              </Box>
            </Paper>
          )}
        </Grid>

        {/* Latest News */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Son Haberler
          </Typography>
          <List>
            {latestNews.slice(0, 5).map((news) => (
              <React.Fragment key={news.id}>
                <ListItem
                  component={RouterLink}
                  to={`/news/${news.id}`}
                >
                  <ListItemText
                    primary={news.title}
                    secondary={news.author.fullName}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Grid>

        {/* Most Viewed News */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            En Çok Okunanlar
          </Typography>
          <Grid container spacing={3}>
            {mostViewedNews.slice(0, 4).map((news) => (
              <Grid item xs={12} sm={6} md={3} key={news.id}>
                <Card
                  component={RouterLink}
                  to={`/news/${news.id}`}
                  sx={{ textDecoration: 'none', height: '100%' }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={news.imageUrl || 'https://via.placeholder.com/300x140'}
                    alt={news.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {news.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {news.author.fullName}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home; 