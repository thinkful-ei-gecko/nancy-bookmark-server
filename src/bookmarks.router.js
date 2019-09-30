const express = require('express')
const bookmarkRouter = express.Router();
const uuidv4 = require('uuid/v4');
const bodyParser = express.json();
const logger = require('./logger');



const bookmarksData = [
    {
      id: uuidv4(),
      title: 'some title',
      url: 'google.com',
      description: 'some description',
      rating: 1
  
    },
    {
      id: uuidv4(),
      title: 'more title',
      url: 'google.com',
      description: 'more description',
      rating: 1
  
    }
  ]

bookmarkRouter
    .route('/bookmarks')
    .get((req, res) => {
        logger.info('bookmarks retreived')
        return res.status(200).send(JSON.stringify(bookmarksData))
    })
    
    .post(bodyParser, (req, res) => {
        const { title, url, description, rating } = req.body

        if(!title) {
            logger.error('Title is required')
            return res.status(400).send('Title is required')
        }
        if(!url) {
            logger.error('url is required')
            return res.status(400).send('url is required')
        }
        if(!rating) {
            logger.error('rating is required')
            return res.status(400).send('rating is required')
        }

        let newBookmark = { 
            id: uuidv4(),
            title,
            url,
            description,
            rating
        }

        bookmarksData.push(newBookmark);
        logger.info('new bookmark created')
        return res.status(201).send('new bookmark created!')
    })


bookmarkRouter
    .route('/bookmarks/:id')
    .get((req, res) => {
        const { id } = req.params;

        let result = bookmarksData.find(b => b.id === id)
        if(!result) {
            logger.error('couldnt find bookmark :(')
            return res.status(404).send('couldnt find bookmark :(')
        }
        logger.info('bookmark found by id')
        return res.send(JSON.stringify(result))
    })
    .delete((req, res) => {
        const { id } = req.params

        let resultIndex = bookmarksData.findIndex(b => b.id === id)

        if(resultIndex === -1) {
            logger.error('couldnt find bookmark to delete :(')
            return res.status(404).send('couldnt find bookmark to delete :(')
        }
        bookmarksData.splice(resultIndex, 1)
        logger.info('delete bookmark by id successful')
        return res.status(204).end()
    })



module.exports = bookmarkRouter