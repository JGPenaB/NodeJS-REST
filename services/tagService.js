const models = require("../database/models");

const listTags = (call) => {

    models.Tags.findAll({
        attributes: ["id","tagName"],
        include: {
            model: models.Article,
            attributes: ["id", "Title", "Slug"],
            through: {
                attributes: []
            }
        }
    })
    .then( (list) => {
        return call(list);
    })
    .catch( (error) => {
        console.log(error.message);
        return call(error);
    });
};


const createTag = (articleID, tagName, call) => {
    
    models.Tags.create({
        tagName: tagName
    })
    .then( (newTag) => {
        models.ArticleTags.create({
            articleID: articleID,
            tagID: newTag.dataValues.id
        }).then((r) => {
            return call(newTag);
        })
        .catch( (error) => {
            console.log(error.message);
            return call(error);
        });
        
    })
    .catch( (error) => {
        console.log(error.message);
        return call(error);
    });
};

module.exports = { listTags, createTag };