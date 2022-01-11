import React, { useEffect } from 'react';
import Header from "../../common/header/Header";
import { Button, Checkbox, GridList, GridListTile, GridListTileBar, ListItemText, MenuItem, OutlinedInput, Select, TextField } from '@material-ui/core';
import "./Home.css";
import { useHistory } from 'react-router-dom';
import { ValidatorForm } from 'react-material-ui-form-validator';
import TextValidator from 'react-material-ui-form-validator/lib/TextValidator';
import { FormControl, InputLabel } from '@mui/material';

const Home = function(props){
    
    const [upcomingMovies, setUpcomingMovies] = React.useState([]);
    const [releasedMovies, setReleasedMovies] = React.useState([]);
    const [genres, setGenres] = React.useState([]);
    const [artists, setArtists] = React.useState([]);
    const [searchForm, setSearchForm] = React.useState({name: '', genres: [], artists: [], releasedFrom: '', releasedTo: ''});
    const history = useHistory();

    const loadUpcomingMovies = async () => {
        try {
            let rawResp = await fetch('http://localhost:8085/api/v1/movies?status=PUBLISHED');
            let jsonResp = await rawResp.json();
            console.log(jsonResp);

            let movies = jsonResp.movies.sort((a, b) => {return new Date(a.release_date).getTime() - new Date(b.release_date).getTime()}).slice(0, 6);
            // console.log(movies);
            setUpcomingMovies(movies);
        } catch(e) {
            console.log(e);
        }
    }

    const loadReleasedMovies = async () => {
        try {
            let rawResp = await fetch('http://localhost:8085/api/v1/movies?status=RELEASED');
            let jsonResp = await rawResp.json();
            console.log(jsonResp);

            let movies = jsonResp.movies;
            // console.log(movies);
            setReleasedMovies(movies);
        } catch(e) {
            console.log(e);
        }
    }

    const loadGenres = async () => {
        try {
            let rawResp = await fetch('http://localhost:8085/api/v1/genres');
            let jsonResp = await rawResp.json();
            let genreList = jsonResp.genres;
            setGenres(genreList);
            console.log(genres);
        } catch(e) {
            console.log(e);
        }
    }

    const loadArtists = async () => {
        try {
            let rawResp = await fetch('http://localhost:8085/api/v1/artists');
            let jsonResp = await rawResp.json();
            let artistList = jsonResp.artists;
            setArtists(artistList);
            console.log(artists);
        } catch(e) {
            console.log(e);
        }
    }

    const showMovieDetails = (id) => {
        history.push(`/movie/${id}`);
    }

    const loadSearchResults = async() => {
        try {
            let rawResp = await fetch(`http://localhost:8085/api/v1/movies?title=${searchForm.name}&genre=${searchForm.genres.join(',')}&artists=${searchForm.artists.join(',')}&start_date=${searchForm.releasedFrom}&end_date=${searchForm.releasedTo}`);
            let jsonResp = await rawResp.json();
            console.log(jsonResp);

            let movies = jsonResp.movies;
            // console.log(movies);
            setReleasedMovies(movies);
        } catch(e) {
            console.log(e);
        }
    }

    const onSearch = () => {
        loadSearchResults();
    };

    const handleSearchParamChange = (e) => {
        let updatedForm = {
            ...searchForm 
        };
        updatedForm[e.target.name] = e.target.value;
        setSearchForm(updatedForm);
        console.log(e.target.value, e.target.name);
    };

    const handleGenreSelection = (event) => {
        const {
            target: { value },
        } = event;
        setSearchForm({
            ...searchForm,
            genres: typeof value === 'string' ? value.split(',') : value
        });
    }

    const handleArtistSelection = (event) => {
        const {
            target: { value },
        } = event;
        setSearchForm({
            ...searchForm,
            artists: typeof value === 'string' ? value.split(',') : value
        });
    }

    useEffect(() => {
        loadUpcomingMovies();
        loadReleasedMovies();
        loadGenres();
        loadArtists();
    }, []);

    return (
        <React.Fragment>
            <Header/>
            <div className='home-container'>
                <div className='upcoming-movies'>
                    <div className='upcoming-title'>
                        Upcoming Movies
                    </div>
                    <GridList cellHeight={250} cols={4} className="upcomingGridList" >
                        {
                            upcomingMovies.map((movie) => {
                                return (
                                    <GridListTile key={movie.id} onClick={() => {showMovieDetails(movie.id)}}>
                                        <img src={movie.poster_url} alt={movie.title} />
                                        <GridListTileBar title={movie.title} />
                                    </GridListTile>
                                )
                            })
                        }
                    </GridList>
                </div>
                <div className='released-movies'>
                    <div className='left'>
                        <GridList cellHeight={350} cols={4} className="releasedGridList">
                            {
                                releasedMovies.map((movie) => {
                                    return (
                                        <GridListTile key={movie.id} onClick={() => {showMovieDetails(movie.id)}}>
                                            <img src={movie.poster_url} alt={movie.title} />
                                            <GridListTileBar title={movie.title} />
                                        </GridListTile>
                                    )
                                })
                            }
                        </GridList>
                    </div>
                    <div className='right'>                     
                        <ValidatorForm className="filter-form" onSubmit={onSearch}>
                            <div>
                                FIND MOVIES BY:
                            </div>

                            <div>
                                <TextValidator
                                    id="name" name="name" label="Movie Name" type="text" value={searchForm.name} onChange={handleSearchParamChange}
                                    variant="standard">
                                </TextValidator>
                            </div>

                            <div>                                
                                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                    <InputLabel id="genre-multiple-checkbox-label">Genre</InputLabel>
                                    <Select
                                        labelId="genre-multiple-checkbox-label" id="genre-multiple-checkbox"
                                        multiple
                                        value={searchForm.genres}
                                        onChange={handleGenreSelection} label="Genre"
                                        renderValue={(selected) => selected.length>0? selected.join(', '): undefined}>
                                        {genres.map((genre) => (
                                        <MenuItem key={genre.id} value={genre.description}>
                                            <Checkbox checked={searchForm.genres.indexOf(genre.description) > -1} />
                                            <ListItemText primary={genre.description} />
                                        </MenuItem>
                                    ))}
                                    </Select>
                                </FormControl>
                            </div>

                            <div>
                            {/* <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="demo-simple-select-standard-label">Age</InputLabel>
                                <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={10}
                                onChange={() => {}}
                                label="Age"
                                >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </FormControl> */}
                                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                    <InputLabel id="artist-multiple-checkbox-label">Artists</InputLabel>
                                    <Select
                                        labelId="artist-multiple-checkbox-label" id="artist-multiple-checkbox"
                                        multiple
                                        value={searchForm.artists}
                                        onChange={handleArtistSelection} label="Artists"
                                        renderValue={(selected) => selected.length>0? selected.join(', '): undefined}>
                                        {artists.map((artist) => (
                                            <MenuItem key={artist.id} value={artist.first_name + ' ' + artist.last_name}>
                                                <Checkbox checked={searchForm.artists.indexOf(artist.first_name + ' ' + artist.last_name) > -1} />
                                                <ListItemText primary={artist.first_name + ' ' + artist.last_name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>

                            <div>
                                <TextField
                                    id="releasedFrom"
                                    name="releasedFrom"
                                    label="Release Date Start"
                                    type="date"
                                    variant="standard"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={searchForm.releasedFrom}
                                    onChange={handleSearchParamChange}
                                />
                            </div>
                            
                            <div>
                                <TextField
                                    id="releasedTo"
                                    name="releasedTo"
                                    label="Release Date End"
                                    type="date"
                                    variant="standard"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={searchForm.releasedTo}
                                    onChange={handleSearchParamChange}
                                />
                            </div>
                            <div className="search-button">                                
                                <Button type="submit" variant="contained">Search</Button>
                            </div>
                        </ValidatorForm>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Home;