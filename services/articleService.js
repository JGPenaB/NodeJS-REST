const models = require("../database/models");

const listArticles = (call) => {
    models.Article.findAll({
        attributes: ["id","Author","Title","Slug"],
        include: [{
            model: models.User,
            as: "authorData",
            attributes: ["firstName", "lastName", "email"]
        },{
            model: models.Comment,
            attributes: ["id", "Content"]
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

const getArticleByID = (articleID, call) => {
    models.Article.findByPk(articleID,{
        include: {
            model: models.User,
            as: "authorData",
            attributes: ["firstName", "lastName", "email"]
        }
    })
    .then( (articleFound) => {
        return call(articleFound);
    })
    .catch( (error) => {
        console.log(error.message);
        return call(error);
    });
}

const createArticle = (articleData, call) => {
    models.Article.create({
        Title: articleData.Title,
        Slug: articleData.Slug,
        Content: articleData.Content,
        Author: articleData.Author,
    })
    .then( (newArticle) => {
        //return call(newArticle);
        getArticleByID(newArticle.dataValues.id, (response) => {
            return call(response);
        });
     })
     .catch( (error) => {
         console.log(error.message);
         return call(error);
     });
};


const updateArticle = (articleID, articleData, call) => {
    getArticleByID(articleID, (response) => {
        if(response === null){
            return call(null);
        }

        models.Article.update({
            Title: articleData.Title,
            Slug: articleData.Slug,
            Content: articleData.Content,
            Author: articleData.Author,
        },{
            where: {
                id: articleID
            },
            returning: true,
            plain: true
        })
        .then( (updatedArticle) => {
            return call(updatedArticle);
         })
         .catch( (error) => {
             console.log(error.message);
             return call(error);
         });
    });

};


const deleteArticle = (articleID, call) => {
    getArticleByID(articleID, (response) => {
        if(response === null){
            return call(null);
        }

        let deletedData = {
            id: response.dataValues.id,
            Title: response.dataValues.Title,
            Slug: response.dataValues.Slug,
            Content: response.dataValues.Content,
            Author: response.dataValues.Author,
        };

        models.Article.destroy({
            where: {
                id: articleID
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

module.exports = { listArticles, createArticle, getArticleByID, updateArticle, deleteArticle };