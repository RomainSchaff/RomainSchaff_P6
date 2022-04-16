const Sauce = require('../models/Sauce');
const fs = require('fs');
const User = require('../models/User');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    likedArray = [];
    dislikedArray = [];
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: likedArray,
      usersDisliked: dislikedArray,
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistré !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? 
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
};

exports.addLike = (req, res, next) => {
  let like = req.body.like;
  User.findOne({ _id: req.body.userId })
    .then(user => {
      Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
          let arrayOfIdLiked = sauce.usersLiked;
          let arrayOfIdDisliked = sauce.usersDisliked;
          let numberOflikes = sauce.likes;
          let numberOfDislikes = sauce.dislikes;
          switch (like) {
            case 0 :
              if (sauce.usersLiked.includes(user._id)) { 
                let userIdIndex = sauce.usersLiked.indexOf(user._id);
                arrayOfIdLiked.splice(userIdIndex, 1);
                numberOflikes--;
                Sauce.updateOne({ _id: req.params.id }, { likes: numberOflikes, usersLiked: arrayOfIdLiked, _id: req.params.id })
                  .then(() => res.status(200).json({ message: 'Like supprimé!'}))
                  .catch(error => res.status(400).json({ error }))
              };
              if (sauce.usersDisliked.includes(user._id)) {
                let userIdIndex = sauce.usersDisliked.indexOf(user._id);
                arrayOfIdDisliked.splice(userIdIndex, 1);
                numberOfDislikes--;
                Sauce.updateOne({ _id: req.params.id }, { dislikes: numberOfDislikes, usersDisliked: arrayOfIdDisliked, _id: req.params.id })
                  .then(() => res.status(200).json({ message: 'Dislike supprimé!'}))
                  .catch(error => res.status(400).json({ error }))
              };
              break;
          
            case 1 :
                arrayOfIdLiked.push(user._id);
                numberOflikes++;
                Sauce.updateOne({ _id: req.params.id }, { likes: numberOflikes, usersLiked: arrayOfIdLiked, _id: req.params.id })
                  .then(() => res.status(200).json({ message: `Like ajouté !` }))
                  .catch((error) => res.status(400).json({ error }))
                    
              break;
          
            case -1 :
                arrayOfIdDisliked.push(user._id);
                numberOfDislikes++;
                Sauce.updateOne({ _id: req.params.id }, { dislikes: numberOfDislikes, usersDisliked: arrayOfIdDisliked, _id: req.params.id })
                  .then(() => { res.status(200).json({ message: `Dislike ajouté !` }) })
                  .catch((error) => res.status(400).json({ error }))
              break;
              
              default:
                console.log(error);
          }         
        })
    })
    .catch(error => res.status(404).json({ error }))
};
