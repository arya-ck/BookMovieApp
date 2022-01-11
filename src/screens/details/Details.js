import { GridList, GridListTile, GridListTileBar } from '@material-ui/core';
import { Rating, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom';
import YouTube from 'react-youtube';
import {StarBorder} from '@material-ui/icons';
import Header from '../../common/header/Header';
import "./Details.css";

const Details = function(props){
    let { id } = useParams();
    let [movie, setMovie] = useState({artists:[]});
    let [stars, setStars] = useState(0);
    const history = useHistory();

    const loadDetails = async () => {
        let rawResp = await fetch(`http://localhost:8085/api/v1/movies/${id}`);
        let jsonResp = await rawResp.json();
        console.log(jsonResp);
        if(!jsonResp.artists){
            jsonResp.artists = [];
        }
        setMovie(jsonResp);
    }

    const getVideoId = (url) => {
        let id;
        if(url == undefined) return id;
        
        let index = url.indexOf('?v=');
        if(index>-1){
            id = url.substr(index+3);
        }

        return id;
    }

    useEffect(() => {
        loadDetails();
    }, []);

    return (
        <React.Fragment>            
            <Header />
            <div className='details-container'>
                <div className='back-button'>
                    <Typography component="a"><a href='#' onClick={() => {history.push(`/`);}}>&lt; Back to Home</a></Typography>
                    
                </div>
                <div className='movie-detail'>
                    <div className='left'>
                        <img src={movie.poster_url} alt={movie.title} />
                    </div>
                    <div className='middle'>
                        <Typography variant="h2" component="h2">{movie.title}</Typography>
                        <div><b>Genere:</b>&nbsp;{movie.genres}</div>
                        <div><b>Duration:</b>&nbsp;{movie.duration}</div>
                        <div><b>Release Date:</b>&nbsp;{movie.release_date}</div>
                        <div><b>Rating:</b>&nbsp;{movie.critics_rating}</div>
                        <div><b>Plot:</b>&nbsp;(<a href={movie.wiki_url}>Wiki Link</a>){movie.storyline}</div>
                        <div><b>Trailer:</b></div>
                        <YouTube videoId={getVideoId(movie.trailer_url)}  />
                        {/* opts={opts} onReady={this._onReady} */}
                    </div>
                    <div className='right'>
                        <div>
                            <Typography variant="h5" component="h5">Rate this movie:</Typography>
                        </div>
                        <div>
                            <Rating
                                name="simple-controlled"
                                value={stars} precision={1}
                                onChange={(event, newValue) => {
                                    setStars(newValue);
                                }}
                                icon={<StarBorder />}
                            />
                        </div>
                        <div>
                            <Typography variant="h5" component="h5">Artists:</Typography>
                        </div>
                        <div>
                            <GridList cellHeight={250} rows={1} cols={2} >
                                {
                                    movie.artists.map((artist) => {
                                        return (
                                            <GridListTile key={artist.id}>
                                                <img src={artist.profile_url} alt={artist.first_name + ' ' + artist.last_name} />
                                                <GridListTileBar title={artist.first_name + ' ' + artist.last_name} />
                                            </GridListTile>
                                        )
                                    })
                                }
                            </GridList>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Details;