const models = require("../database/models");

const listComments = (call) => {
    models.Comment.findAll({
        attributes: ["id","userID","articleID","Content"],
        include: [{
            model: models.User,
            attributes: ["id", "firstName", "lastName", "email"]
        },{
            model: models.Article,
            attributes: ["id", "Title", "Slug"]
        }]
    })
    .then( (list) => {
        return call(list);
    })
    .catch( (error) => {
        console.log(error.message);
        return call(error);
    });
};


const getCommentByID = (commentID, call) => {
    models.Comment.findByPk(commentID, {
        attributes: ["id","userID","articleID","Content"],
        include: [{
            model: models.User,
            attributes: ["id", "firstName", "lastName", "email"]
        },{
            model: models.Article,
            attributes: ["id", "Title", "Slug"]
        }]
    })
    .then( (commentFound) => {
        return call(commentFound);
    })
    .catch( (error) => {
        console.log(error.message);
        return call(error);
    });
};


const createComment = (commentData, call) => {
    models.Comment.create({
        userID: commentData.userID,
        articleID: commentData.articleID,
        Content: commentData.Content,
    })
    .then( (newComment) => {
        getCommentByID(newComment.dataValues.id, (response) => {
            return call(response);
        });
     })
     .catch( (error) => {
         console.log(error.message);
         return call(error);
     });
};


const updateComment = (commentID, Content, call) =>{
    getCommentByID(commentID, (response) => {
        if(response === null){
            return call(null);
        }

        models.Comment.update({
            Content: Content
        },{
            where: {
                id: commentID
            },
            returning: true,
            plain: true
        })
        .then( (updatedComment) => {
            getCommentByID(updatedComment[1].dataValues.id, (response) => {
                return call(response);
            });
        })
        .catch( (error) => {
            console.log(error.message);
            return call(error);
        });
    });
};


const deleteComment = (commentID, call) =>{
    getCommentByID(commentID, (response) => {
        if(response === null){
            return call(null);
        }

        let deletedData = {
            id: response.dataValues.id,
            userID: response.dataValues.userID,
            articleID: response.dataValues.articleID,
            Content: response.dataValues.Content,
        };

        models.Comment.destroy({
            where: {
                id: commentID
            },
            returning: true,
            plain: true
        })
        .then( (deleteResponse) => {
            return call(deletedData);
        })
        .catch( (error) => {
            console.log(error.message);
            return call(error);
        });
    });
};

module.exports = { listComments, getCommentByID, createComment, updateComment, deleteComment };