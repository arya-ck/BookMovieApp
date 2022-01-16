import React, { useEffect } from 'react';
import Header from "../../common/header/Header";
import { Button, Checkbox, GridList, GridListTile, GridListTileBar, ListItemText, MenuItem, Select, TextField } from '@material-ui/core';
import "./Home.css";
import { useHistory } from 'react-router-dom';
import { Card, CardContent, FormControl, Input, InputLabel, Typography } from '@mui/material';

const Home = function(props){
    
    // initilize home states
    const [upcomingMovies, setUpcomingMovies] = React.useState([]);
    const [releasedMovies, setReleasedMovies] = React.useState([]);
    const [genres, setGenres] = React.useState([]);
    const [artists, setArtists] = React.useState([]);
    const [searchForm, setSearchForm] = React.useState({name: '', genres: [], artists: [], releasedFrom: '', releasedTo: ''});
    const history = useHistory();

    let {theme} = props;

    // load upcoming movies from backend
    const loadUpcomingMovies = async () => {
        try {
            let rawResp = await fetch('http://localhost:8085/api/v1/movies?status=PUBLISHED&sort=release_date');
            let jsonResp = await rawResp.json();

            let movies = jsonResp.movies.sort((a, b) => {return new Date(a.release_date).getTime() - new Date(b.release_date).getTime()});
            setUpcomingMovies(movies);
        } catch(e) {
            console.info(e);
        }
    }

    // load released movies from backend
    const loadReleasedMovies = async () => {
        try {
            let rawResp = await fetch('http://localhost:8085/api/v1/movies?status=RELEASED&sort=release_date');
            let jsonResp = await rawResp.json();

            let movies = jsonResp.movies;
            setReleasedMovies(movies);
        } catch(e) {
            console.info(e);
        }
    }

    // load list of all genres for usage in the filter component
    const loadGenres = async () => {
        try {
            let rawResp = await fetch('http://localhost:8085/api/v1/genres');
            let jsonResp = await rawResp.json();
            let genreList = jsonResp.genres;
            setGenres(genreList);
        } catch(e) {
            console.info(e);
        }
    }

    // load list of all artists for usage in the filter component
    const loadArtists = async () => {
        try {
            let rawResp = await fetch('http://localhost:8085/api/v1/artists');
            let jsonResp = await rawResp.json();
            let artistList = jsonResp.artists;
            setArtists(artistList);
        } catch(e) {
            console.info(e);
        }
    }

    // navigate to details page when a movie tile is clicked
    const showMovieDetails = (id) => {
        history.push(`/movie/${id}`);
    }

    // load movies from backend based on search params set
    const loadSearchResults = async() => {
        try {
            let rawResp = await fetch(`http://localhost:8085/api/v1/movies?title=${searchForm.name}&genre=${searchForm.genres.join(',')}&artists=${searchForm.artists.join(',')}&start_date=${searchForm.releasedFrom}&end_date=${searchForm.releasedTo}`);
            let jsonResp = await rawResp.json();
            let movies = jsonResp.movies;
            setReleasedMovies(movies);
        } catch(e) {
            console.info(e);
        }
    }

    // handle click of apply button
    const onSearch = (e) => {
        e.preventDefault();
        loadSearchResults();
    };

    // update state whenever search input field changes
    const handleSearchParamChange = (e) => {
        let updatedForm = {
            ...searchForm 
        };
        updatedForm[e.target.name] = e.target.value;
        setSearchForm(updatedForm);
    };

    // update state when genre selection changes
    const handleGenreSelection = (event) => {
        const {
            target: { value },
        } = event;
        setSearchForm({
            ...searchForm,
            genres: typeof value === 'string' ? value.split(',') : value
        });
    }

    // update state when artist selection changes
    const handleArtistSelection = (event) => {
        const {
            target: { value },
        } = event;
        setSearchForm({
            ...searchForm,
            artists: typeof value === 'string' ? value.split(',') : value
        });
    }

    // load upcoming movies, released movies, all genres and all artists when component is initialized
    useEffect(() => {
        loadUpcomingMovies();
        loadReleasedMovies();
        loadGenres();
        loadArtists();
    }, []);

    return (
        <React.Fragment>
            <Header/>

            {/* Upcoming movies grid */}
            <div className='home-container'>
                <div className='upcoming-movies'>
                    <div className='upcoming-title'>
                        Upcoming Movies
                    </div>
                    <GridList cellHeight={250} cols={6} className="upcomingGridList" >
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

                {/* Released movies grid */}
                <div className='flex-container'>
                    <div className='left'>
                        <GridList cellHeight={350} cols={4} className="releasedGridList">
                            {
                                releasedMovies.map((movie) => {
                                    return (
                                        <GridListTile key={movie.id} onClick={() => {showMovieDetails(movie.id)}} className='released-poster'>
                                            <img src={movie.poster_url} alt={movie.title} />
                                                <GridListTileBar title={movie.title} subtitle={<span>Release Date: {new Intl.DateTimeFormat('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(movie.release_date))}</span>} />
                                        </GridListTile>
                                    )
                                })
                            }
                        </GridList>
                    </div>
                    <div className='right'>
                        {/* Movie filter form */}
                        <Card>
                            <CardContent>
                                <form className="filter-form" onSubmit={onSearch}>

                                    {/* Form title */}
                                    <Typography color={theme.palette.primary.light}>
                                        FIND MOVIES BY:
                                    </Typography>

                                    {/* Name */}
                                    <div className='search-field'>
                                        <FormControl sx={{ minWidth: '240px', maxWidth:'240px', margin: theme.spacing.unit }}>
                                            <InputLabel htmlFor='name' sx={{marginLeft: '-0.75rem'}}>Movie Name</InputLabel>
                                            <Input id="name" name="name" type="text" value={searchForm.name} onChange={handleSearchParamChange} />
                                        </FormControl>
                                    </div>
                                    
                                    {/* Genre */}
                                    <div className='search-field'>
                                        <FormControl sx={{ minWidth: '240px', maxWidth:'240px', margin: theme.spacing.unit }}>
                                            <InputLabel htmlFor="genre-multiple-checkbox" sx={{marginLeft: '-0.75rem', position: 'relative'}}>Genre</InputLabel>
                                            <Select
                                                id="genre-multiple-checkbox"
                                                multiple
                                                value={searchForm.genres}
                                                onChange={handleGenreSelection}
                                                renderValue={(selected) => selected.join(', ')}>
                                                {genres.map((genre) => (
                                                    <MenuItem key={genre.id} value={genre.description}>
                                                        <Checkbox checked={searchForm.genres.indexOf(genre.description) > -1} />
                                                        <ListItemText primary={genre.description} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>

                                    {/* Artists */}
                                    <div className='search-field'>
                                        <FormControl sx={{ minWidth: '240px', maxWidth:'240px', margin: theme.spacing.unit }}>
                                            <InputLabel htmlFor="artist-multiple-checkbox" sx={{marginLeft: '-0.75rem', position: 'relative'}}>Artists</InputLabel>
                                            <Select                                                
                                                id="artist-multiple-checkbox"
                                                multiple
                                                value={searchForm.artists}
                                                onChange={handleArtistSelection}
                                                renderValue={(selected) => selected.join(', ')}>
                                                {artists.map((artist) => (
                                                    <MenuItem key={artist.id} value={artist.first_name + ' ' + artist.last_name}>
                                                        <Checkbox checked={searchForm.artists.indexOf(artist.first_name + ' ' + artist.last_name) > -1} />
                                                        <ListItemText primary={artist.first_name + ' ' + artist.last_name} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>

                                    {/* Release date start */}
                                    <div className='search-field'>
                                        <FormControl sx={{ minWidth: '240px', maxWidth:'240px', margin: theme.spacing.unit }}>
                                            <InputLabel htmlFor='releasedFrom' shrink={true} sx={{marginLeft: '-0.75rem'}}>Release Date Start</InputLabel>
                                            <TextField
                                                id="releasedFrom"
                                                name="releasedFrom"
                                                type="date"
                                                variant="standard"
                                                value={searchForm.releasedFrom}
                                                onChange={handleSearchParamChange}
                                            />
                                        </FormControl>
                                    </div>
                                    
                                    {/* Release date end */}
                                    <div className='search-field'>
                                        <FormControl sx={{ minWidth: '240px', maxWidth:'240px', margin: theme.spacing.unit }}>
                                            <InputLabel htmlFor='releasedTo' shrink={true} sx={{marginLeft: '-0.75rem'}}>Release Date End</InputLabel>
                                            <TextField
                                                id="releasedTo"
                                                name="releasedTo"
                                                type="date"
                                                variant="standard"
                                                value={searchForm.releasedTo}
                                                onChange={handleSearchParamChange}
                                            />
                                        </FormControl>
                                    </div>

                                    {/* Apply button */}
                                    <div className="search-field" style={{ minWidth: '240px', maxWidth:'240px', margin: theme.spacing.unit }}>                                
                                        <Button type="submit" variant="contained" color='primary' className="search-button">Apply</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Home;