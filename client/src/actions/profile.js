import axios from 'axios';
import  { setAlert } from './alert';

import {
    GET_PROFILE,
    GET_PROFILES,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    ACCOUNT_DELETED,
    CLEAR_PROFILE,
    GET_REPOS
} from './types';


export const getCurrentProfile = () => async dispatch => {
    dispatch({type: CLEAR_PROFILE});

    try {
        const res = await axios.get('/api/profile/me');

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

    } catch (err) {
        console.log(err);
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });

    }
}


//Get all Profiles
export const getProfiles = () => async dispatch => {

    dispatch({
        type: CLEAR_PROFILE
    })
    try {
        const res = await axios.get('/api/profile');

        dispatch({
            type: GET_PROFILES,
            payload: res.data
        });

    } catch (err) {
        console.log(err);
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });

    }
}


//Get Profiles by Id
export const getProfileById = (id) => async dispatch => {
 

    try {
        const res = await axios.get(`/api/profile/user/${id}`);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

    } catch (err) {
        console.log(err);
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });

    }
}


//Get github repos
//Get Profiles by Id
export const getGithubRepos = (username) => async dispatch => {

    try {
        const res = await axios.get(`/api/profile/github/${username}`);

        dispatch({
            type: GET_REPOS,
            payload: res.data
        });

    } catch (err) {
        console.log(err);
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });

    }
}

export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        
       const config = {
            headers:{
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.post('/api/profile', formData, config);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })

        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created' , 'success'))

        if(!edit){
            history.push('/dashboard');
        }

    } catch (err) {

        const errors = err.response.data.errors;

        if(errors){
            errors.forEach(error => dispatch(
                setAlert(error.msg, 'danger')))
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
}

//Add Experience
export const addExperience = (formData, history) => async dispatch => {
    try {
        
        const config = {
             headers:{
                 'Content-Type': 'application/json'
             }
         }
 
         const res = await axios.put('/api/profile/experience', formData, config);

         console.log(formData);
 
         dispatch({
             type: UPDATE_PROFILE,
             payload: res.data
         })
 
         dispatch(setAlert('Experience Added' , 'success'));
         history.push('/dashboard');
 
     } catch (err) {
 
         const errors = err.response.data.errors;
 
         if(errors){
             errors.forEach(error => dispatch(
                 setAlert(error.msg, 'danger')))
         }
 
         dispatch({
             type: PROFILE_ERROR,
             payload: {msg: err.response.statusText, status: err.response.status}
         });
     }
}

//Add Education
export const addEducation = (formData, history) => async dispatch => {
    try {
        
        const config = {
             headers:{
                 'Content-Type': 'application/json'
             }
         }
 
         const res = await axios.put('/api/profile/education', formData, config);
 
         dispatch({
             type: UPDATE_PROFILE,
             payload: res.data
         })
 
         dispatch(setAlert('Education Added' , 'success'));
         history.push('/dashboard');
 
     } catch (err) {
 
         const errors = err.response.data.errors;
 
         if(errors){
             errors.forEach(error => dispatch(
                 setAlert(error.msg, 'danger')))
         }
 
         dispatch({
             type: PROFILE_ERROR,
             payload: {msg: err.response.statusText, status: err.response.status}
         });
     }
}

//Delete Experience
export const deleteExperience = (id) => async dispatch => {

    console.log(id);

    try {
        
        const res = await axios.delete(`/api/profile/experience/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Experience Removed' , 'danger'));
        

    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
}

//Delete Educatioin
export const deleteEducation = id => async dispatch => {

    try {
        
        const res = await axios.delete(`/api/profile/education/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Education Removed' , 'danger'));
        

    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
}


//Delete Account
export const deleteAccount = () => async dispatch => {

    if(window.confirm('Are you Sure, This cannot be undone')) {

        try {
          await axios.delete('/api/profile')


            dispatch({
                type: CLEAR_PROFILE
            })

            dispatch({
                type: ACCOUNT_DELETED
            })

            dispatch(setAlert('Your Account has been successfully removed'));
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: {msg: err.response.statusText, status: err.response.status}
            });
        }

    }


}