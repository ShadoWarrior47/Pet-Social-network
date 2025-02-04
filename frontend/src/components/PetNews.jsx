import React from "react";
import './PetNews.css';

/** A single pet news article. */
function PetNews({ id, text, url, imageUrl }) {
  return (
    <article className="PetNews">
      {imageUrl && <img src={imageUrl} alt="Pet news" className="PetNews-image" />}
      <div className="PetNews-text">
        {text}
      </div>
      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer" className="PetNews-link">
          Read more
        </a>
      )}
    </article>
  );
}

export default PetNews;
