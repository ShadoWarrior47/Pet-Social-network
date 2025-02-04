import React, { useState, useEffect } from "react";
import axios from "axios";
import PetNews from '../components/PetNews';
import './PetNewsList.css';

/** List of Pet News. */
function PetNewsList({ numPetNewsToGet = 5 }) {
    const [petNews, setPetNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        /* retrieve pet news from NewsCatcher API */
        async function getPetNews() {
            try {
                const res = await axios.get(
                    `https://api.newscatcherapi.com/v2/search?q=pet&lang=en&page_size=${numPetNewsToGet}`,
                    {
                        headers: {
                            // "x-api-key": "np_pwyK-87BF6yu5oaQ-p38P2naBPsbcYPtfiWGZaps",
                            "x-api-key": import.meta.env.VITE_NEWSCATCHER_API_KEY,
                        },
                    }
                );

                const newsArticles = res.data.articles.map((article) => ({
                    id: article._id || article.link,
                    text: article.title,
                    url: article.link,
                    imageUrl: article.media,
                }));

                setPetNews(newsArticles);
                // setIsLoading(false);
            } catch (err) {
                if (err.response?.status === 429) {
                    alert("API rate limit exceeded. Please try again later.");
                } else {
                    console.error("Error fetching pet news:", err);
                }
            } finally {
                setIsLoading(false);
            }
        }


        if (isLoading) getPetNews();
    }, [isLoading, numPetNewsToGet]);

    /** Trigger a new fetch */
    function generateNewPetNews() {
        setIsLoading(true);
    };

    /** Render loading spinner or pet news list */
    if (isLoading) {
        return (
            <div className="loading">
                <i className="fas fa-4x fa-spinner fa-spin" />
            </div>
        );
    }

    return (
        <div className="PetNewsList">
            <h1>PetNews</h1>
            <button
                className="PetNewsList-getmore"
                onClick={generateNewPetNews}
            >
                Get More Pet News
            </button>

            {petNews.map(({ id, text, url, imageUrl }) => (

                <PetNews
                    key={id}
                    id={id}
                    text={text}
                    url={url}
                    imageUrl={imageUrl}
                />

            ))}
        </div>
    );
}

export default PetNewsList;